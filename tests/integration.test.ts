// End-to-end checks against a real server on a temporary data folder:
// POC renderer still byte-identical, seed import, persistence across restarts, direct edit with partial
// re-render, approval rules and downloads. Takes ~20 s (Playwright renders). Run: npm test
import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

const DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'reach-int-'));
const PORT = 4690;
const URL = `http://localhost:${PORT}`;
const md5 = (b: Buffer) => crypto.createHash('md5').update(b).digest('hex');
let server: ChildProcess | null = null;

async function start() {
  server = spawn(process.execPath, ['server/index.ts'], {
    env: { ...process.env, REACH_DATA_DIR: DATA, PORT: String(PORT), REACH_AI_MODE: 'claude_code', ANTHROPIC_API_KEY: '', REACH_OFFLINE: '1' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`${URL}/api/settings`)).ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('server did not start');
}
async function stop() {
  if (!server) return;
  const s = server;
  await new Promise((r) => (s.once('exit', r), s.kill()));
  server = null;
}
const api = async (method: string, p: string, body?: unknown) => {
  const r = await fetch(URL + p, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, json: (await r.json().catch(() => null)) as any };
};
const waitJob = async (pubId: number) => {
  for (let i = 0; i < 150; i++) {
    const d = (await api('GET', `/api/publications/${pubId}`)).json;
    if (d.jobs[0] && !['pending', 'running'].includes(d.jobs[0].status)) return d;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('job timeout');
};

before(start);
after(async () => {
  await stop();
  fs.rmSync(DATA, { recursive: true, force: true });
});

test('the POC renderer CLI still produces byte-identical slides', async () => {
  const out = path.join(DATA, 'poc');
  const content = JSON.parse(fs.readFileSync('content/spinal-decompression/dia-mundial-columna-2026.json', 'utf8'));
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'c.json'), JSON.stringify({ ...content, output: out }));
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['studio/render.js', path.join(out, 'c.json')]);
  for (const f of ['slide-01.png', 'slide-02.png', 'slide-03.png'])
    assert.equal(md5(fs.readFileSync(path.join(out, f))), md5(fs.readFileSync(path.join('output/spinal-decompression', f))), f);
});

test('World Spine Day is seeded as version 1 without changing its images', async () => {
  const d = (await api('GET', '/api/publications/1')).json;
  assert.equal(d.publication.date, '2026-10-16');
  assert.equal(d.versions.length, 1);
  for (const s of d.versions[0].slides) {
    const png = Buffer.from(await (await fetch(`${URL}${d.versions[0].dir}/${s.file}`)).arrayBuffer());
    assert.equal(md5(png), md5(fs.readFileSync(path.join('output/spinal-decompression', s.file))));
    assert.equal(png.readUInt32BE(16), 1080);
    assert.equal(png.readUInt32BE(20), 1350);
  }
});

test('publications survive a restart; edits re-render only changed slides; approval rules hold', async () => {
  const created = await api('POST', '/api/publications', {
    brand_id: 'btl-medical-sv', date: '2026-11-12', topic: 'Prueba de persistencia', format: 'carousel', objective: 'Educar a la audiencia', product_ids: ['spinal-decompression'],
  });
  assert.equal(created.status, 200);
  assert.equal(created.json.status, 'planned');
  assert.equal((await api('POST', '/api/publications', { brand_id: 'btl-medical-sv' })).status, 400);

  await stop();
  await start();
  const list = (await api('GET', '/api/publications?from=2026-11-01&to=2026-11-30')).json;
  assert.ok(list.some((p: any) => p.topic === 'Prueba de persistencia'));

  // Claude Code mode: generation stops at a task package, honestly marked as waiting.
  await api('POST', `/api/publications/${created.json.id}/generate`);
  const g = await waitJob(created.json.id);
  assert.equal(g.jobs[0].outcome, 'task_package');
  assert.equal(g.jobs[0].stages.find((s: any) => s.key === 'content').status, 'waiting');
  assert.equal((await api('POST', `/api/publications/${created.json.id}/generate`)).status, 409);

  // Direct edit on the seeded publication: only slide 1 is re-rendered.
  const d = (await api('GET', '/api/publications/1')).json;
  const content = structuredClone(d.versions[0].content);
  content.slides[0].question = '¿Por qué tratarlas a todas igual?';
  await api('POST', '/api/publications/1/edit', { version_id: d.versions[0].id, content });
  const e = await waitJob(1);
  assert.equal(e.jobs[0].status, 'completed', e.jobs[0].error);
  const v2 = e.versions[0];
  assert.equal(v2.number, 2);
  assert.deepEqual(v2.slides.map((s: any) => s.rendered), [true, false, false]);
  assert.equal(v2.validation.status, 'passed', v2.validation.problems.join('\n'));

  assert.equal((await api('POST', '/api/publications/1/approve', { version_id: d.versions[0].id })).status, 409); // not current
  assert.equal((await api('POST', '/api/publications/1/status', { to: 'published' })).status, 409); // not approved yet
  assert.equal((await api('POST', '/api/publications/1/approve', { version_id: v2.id })).json.publication.status, 'approved');

  const zipRes = await fetch(`${URL}/api/versions/${v2.id}/zip`);
  assert.equal(zipRes.headers.get('content-type'), 'application/zip');
  const one = await fetch(`${URL}/api/versions/${v2.id}/slides/1/download`);
  assert.match(one.headers.get('content-disposition') ?? '', /REACH_BTL-Medical-El-Salvador_Carrusel_2026-10-16_v02_slide-01\.png/);

  await stop();
  await start();
  const again = (await api('GET', '/api/publications/1')).json;
  assert.equal(again.publication.status, 'approved');
  assert.equal(again.versions.length, 2);
});
