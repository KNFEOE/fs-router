interface ImportMetaHot {
  accept(): void;
  on(event: string, callback: (data: any) => void): void;
}

declare interface ImportMeta {
  hot?: ImportMetaHot;
}