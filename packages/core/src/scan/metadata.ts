import sharp from "sharp";
import { execa } from "execa";
import ffprobe from "ffprobe-static";

export type ImageMeta = {
  width?: number;
  height?: number;
  megapixels?: number;
  bytes: number;
};
export type VideoMeta = {
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
  bytes: number;
};
export type AudioMeta = {
  duration?: number;
  sample_rate?: number;
  bytes: number;
};

export async function readImageMeta(file: string): Promise<ImageMeta> {
  const s = sharp(file, { failOnError: false });
  const m = await s.metadata();
  const { width, height } = m;
  const fs = await import("node:fs/promises");
  const stat = await fs.stat(file);
  const mp = width && height ? (width * height) / 1_000_000 : undefined;
  return { width, height, megapixels: mp, bytes: stat.size };
}

export async function readAVMeta(file: string): Promise<VideoMeta | AudioMeta> {
  if (!ffprobe.path)
    return {
      bytes: (await (await import("node:fs/promises")).stat(file)).size,
    };
  const { stdout } = await execa(ffprobe.path, [
    "-v",
    "error",
    "-show_format",
    "-show_streams",
    "-of",
    "json",
    file,
  ]);
  const json = JSON.parse(stdout);
  const fs = await import("node:fs/promises");
  const stat = await fs.stat(file);

  const video = json.streams?.find((s: any) => s.codec_type === "video");
  const audio = json.streams?.find((s: any) => s.codec_type === "audio");
  const duration =
    Number(json.format?.duration ?? audio?.duration ?? video?.duration ?? 0) ||
    undefined;

  if (video) {
    const fps =
      video.r_frame_rate && video.r_frame_rate !== "0/0"
        ? Number(video.r_frame_rate.split("/")[0]) /
          Number(video.r_frame_rate.split("/")[1])
        : undefined;
    return {
      width: video.width,
      height: video.height,
      duration,
      fps,
      bytes: stat.size,
    };
  }
  // audio only
  return {
    duration,
    sample_rate: audio ? Number(audio.sample_rate) : undefined,
    bytes: stat.size,
  };
}
