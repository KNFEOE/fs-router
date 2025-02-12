interface Base {
  page: number;
}

export type PageQueryParams = {
  id?: number;
} & Base;
