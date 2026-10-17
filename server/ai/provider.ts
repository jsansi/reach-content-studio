// AI provider abstraction. The pipeline only knows this interface; it never imports a vendor SDK directly.
//
// - "anthropic_api": the backend calls Claude with the built prompt and gets validated JSON back.
// - "claude_code":   no API key. The step that needs Claude's reasoning is written to disk as a task package
//                    (data/tasks/job-N/) that Jaime runs in Claude Code; the result is imported back.
// The renderer (studio/engine.js) is deterministic and is not an AI provider: it runs the same in both modes.
import type { GenerationResultT, RevisionResultT } from '../../shared/schema.ts';
import type { DesignRevisionResultT, ProposalT, ProposalsResultT } from '../../shared/design.ts';
import type { ApprovedCopy, CopyResultT } from '../../shared/structure.ts';
import type { AIKind } from './schemas.ts';
import type { GenerationContext } from '../pipeline/context.ts';
import type { BuiltPrompt } from './prompts.ts';
import { AnthropicProvider } from './anthropic.ts';
import { ClaudeCodeProvider } from './claude-code.ts';

export interface AIRequest {
  kind: AIKind;
  jobId: number;
  allowedImages?: string[]; // design kinds: the only image paths a proposal may use
  approvedCopy?: ApprovedCopy | null; // texts approved in step 1, which the result must use as written
  fixedSlides?: { slides: number[]; base: ProposalT } | null; // design revisions: slides that must not change
  prompt: BuiltPrompt;
  context: GenerationContext;
}

export type AIResponse =
  | { type: 'result'; result: GenerationResultT | RevisionResultT | ProposalsResultT | DesignRevisionResultT | CopyResultT; provider: string }
  | { type: 'task_package'; dir: string; provider: string };

export interface AIProvider {
  readonly id: 'anthropic_api' | 'claude_code';
  readonly label: string;
  readonly model: string | null;
  run(req: AIRequest): Promise<AIResponse>;
}

let provider: AIProvider | null = null;

export function getProvider(): AIProvider {
  if (provider) return provider;
  const mode = process.env.REACH_AI_MODE || (process.env.ANTHROPIC_API_KEY ? 'anthropic_api' : 'claude_code');
  provider = mode === 'anthropic_api' ? new AnthropicProvider(process.env.ANTHROPIC_MODEL || 'claude-opus-5-5') : new ClaudeCodeProvider();
  return provider;
}
