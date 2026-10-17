// Development: API server (restarts on change) + Vite dev server with hot reload.
import { spawn } from 'node:child_process';

const run = (cmd, args) => spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
const procs = [
  run('node', ['--watch-path=server', '--watch-path=shared', '--watch-path=studio', '--watch-path=prompts', 'server/index.ts']),
  run('npx', ['vite']),
];
const stop = () => procs.forEach((p) => p.kill());
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
procs.forEach((p) => p.on('exit', (code) => code && stop()));
