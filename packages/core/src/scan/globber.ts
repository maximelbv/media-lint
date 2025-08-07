import fg from "fast-glob";

export async function listFiles(include: string[], exclude: string[]) {
  return await fg(include, { ignore: exclude, onlyFiles: true, dot: false });
}
