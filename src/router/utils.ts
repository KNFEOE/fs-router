import * as fs from 'fs';
import * as path from 'path';

export const getPathWithoutExt = (filepath: string): string => {
  return filepath.replace(/\.[^/.]+$/, '');
};

export const hasAction = async (filepath: string): Promise<boolean> => {
  const content = await fs.promises.readFile(filepath, 'utf-8');
  return content.includes('export const action') || content.includes('export let action');
};

export const replaceWithAlias = (
  basePath: string,
  filePath: string,
  alias: string
): string => {
  const relativePath = path.relative(basePath, filePath);
  return path.join(alias, relativePath);
};

export const normalizeToPosixPath = (str: string): string => {
  return str.replace(/\\/g, '/');
};
