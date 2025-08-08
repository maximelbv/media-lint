import path from "node:path";
import { MediaType } from "../types";

export async function detectType(
  file: string
): Promise<{ media: MediaType; ext: string }> {
  const ext = path.extname(file).slice(1).toLowerCase();
  if (ext === "svg") return { media: "svg", ext };

  const ftModule: any = await import("file-type");
  const fileTypeFromFile =
    ftModule.fileTypeFromFile || (await ftModule.default?.fileTypeFromFile);

  const ft = await fileTypeFromFile(file);
  const mime = ft?.mime ?? "";

  if (mime.startsWith("image/")) return { media: "image", ext };
  if (mime.startsWith("video/")) return { media: "video", ext };
  if (mime.startsWith("audio/")) return { media: "audio", ext };
  return { media: "other", ext };
}
