interface Param1 {
  page: number;
}

interface Param2 {
  id: number;
}

export type PageQueryParams = Param1 | Param2;
