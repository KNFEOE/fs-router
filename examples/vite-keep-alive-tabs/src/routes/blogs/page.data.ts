import { blogs } from "./data";

export interface Blog {
  id: number;
  title: string;
  content: string;
}

export const loader = () =>
  new Promise<Blog[]>((resolve) => setTimeout(() => resolve(blogs), 1000));