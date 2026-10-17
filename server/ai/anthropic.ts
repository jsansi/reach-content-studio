// Anthropic API provider. Credentials come from the environment (ANTHROPIC_API_KEY or an `ant auth login`
// profile) and are only used here, server-side. Nothing about the key is logged or sent to the browser.
import fs from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { RESULT_SCHEMAS } from './schemas.ts';
import { abs } from '../paths.ts';
import type { AIProvider, AIRequest, AIResponse } from './provider.ts';

const MAX_PDF_BYTES = 8 * 1024 * 1024; // keeps a request well under the 32 MB limit

export class AnthropicProvider implements AIProvider {
  readonly id = 'anthropic_api' as const;
  readonly label = 'Anthropic API';
  readonly model: string;
  private client = new Anthropic();
  constructor(model: string) {
    this.model = model;
  }

  async run(req: AIRequest): Promise<AIResponse> {
    // Only the publication's own attachments are sent as documents; product knowledge goes in as text excerpts.
    const documents: Anthropic.Beta.BetaContentBlockParam[] = [];
    const notes: string[] = [];
    for (const d of req.context.documents) {
      const data = fs.readFileSync(abs(d.path));
      if (d.mime === 'application/pdf' && data.length <= MAX_PDF_BYTES)
        documents.push({ type: 'document', title: d.filename, source: { type: 'base64', media_type: 'application/pdf', data: data.toString('base64') } });
      else if (/^text\//.test(d.mime) || /\.(md|txt)$/i.test(d.filename))
        documents.push({ type: 'document', title: d.filename, source: { type: 'text', media_type: 'text/plain', data: data.toString('utf8') } });
      else notes.push(`${d.filename} no se envió (formato no compatible o más de 8 MB).`);
    }

    const schema = RESULT_SCHEMAS[req.kind];
    let response;
    try {
      response = await this.client.beta.messages.parse({
        model: this.model,
        max_tokens: req.kind === 'propose' ? 48000 : 16000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high', format: betaZodOutputFormat(schema as any) },
        system: req.prompt.system,
        messages: [{ role: 'user', content: [...documents, { type: 'text', text: req.prompt.user }] }],
      });
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError) throw new Error('La API de Anthropic rechazó las credenciales. Revisa ANTHROPIC_API_KEY en el archivo .env.');
      if (e instanceof Anthropic.RateLimitError) throw new Error('Límite de uso de la API alcanzado. Espera unos minutos y reintenta.');
      if (e instanceof Anthropic.BadRequestError) throw new Error(`La API rechazó la solicitud: ${e.message}`);
      if (e instanceof Anthropic.APIConnectionError) throw new Error('No se pudo conectar con la API de Anthropic. Revisa la conexión a internet.');
      if (e instanceof Anthropic.APIError) throw new Error(`Error de la API de Anthropic (${e.status}). Reintenta en unos minutos.`);
      throw e;
    }
    if (response.stop_reason === 'refusal') throw new Error('Claude declinó esta solicitud. Revisa el brief o las instrucciones e inténtalo de nuevo.');
    if (response.stop_reason === 'max_tokens') throw new Error('La respuesta de Claude quedó incompleta (límite de tokens). Reintenta con menos diapositivas o instrucciones más breves.');
    const parsed = response.parsed_output;
    if (!parsed) throw new Error('Claude no devolvió un JSON válido para el esquema del carrusel.');
    (parsed as { warnings: string[] }).warnings.push(...notes);
    return { type: 'result', result: parsed, provider: `anthropic_api:${response.model}` };
  }
}
