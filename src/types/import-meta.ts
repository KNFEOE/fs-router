import type { ViteHotContext } from 'vite/types/hot.js';

export interface ImportMetaHot {
  accept(): void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  on(event: string, callback: (data: any) => void): void;
}

export declare interface ImportMeta {
  hot?: ViteHotContext | undefined;
}
