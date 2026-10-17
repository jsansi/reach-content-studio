// Types for studio/engine.js, used by the TypeScript server.
export declare const ROOT: string;
export declare const W: number;
export declare const H: number;
export declare const MIN_TEXT: number;
export declare const LAYOUTS: string[];
export declare const STYLE_PROPS: Set<string>;
export declare function availableIcons(): string[];
export declare function slideFile(i: number): string;
export declare function styleOverrides(slides: unknown[]): string;
export interface RenderedSlide { index: number; file: string; width: number; height: number; bytes: number; rendered: boolean }
export interface RenderProblem { slide: number; message: string }
export declare function renderCarousel(opts: {
  content: unknown;
  outDir: string;
  only?: number[] | null;
  reuseFrom?: string | null;
  extras?: boolean;
}): Promise<{ slides: RenderedSlide[]; problems: RenderProblem[] }>;
export declare function writeExtras(content: unknown, outDir: string, pngs: string[]): void;
