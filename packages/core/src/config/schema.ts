import { z } from "zod";
import { OUTPUT_FORMATS, REPORT_FORMATS } from "../formats/registry";

const bytes = z.union([z.number().nonnegative(), z.string().min(1)]);
const seconds = z.union([z.number().nonnegative(), z.string().min(1)]);

export const ConfigSchema = z.object({
  include: z.array(z.string()).min(1),
  exclude: z.array(z.string()).default([]),
  rules: z.object({
    general: z
      .object({
        maxBytes: bytes.optional(),
        allowedFormats: z.array(z.string()).optional(),
        naming: z
          .object({
            pattern: z.string().optional(),
            noSpaces: z.boolean().optional(),
          })
          .optional(),
      })
      .default({}),
    image: z
      .object({
        maxWidth: z.number().int().positive().optional(),
        maxHeight: z.number().int().positive().optional(),
        maxMegapixels: z.number().positive().optional(),
      })
      .optional(),
    video: z
      .object({
        maxDuration: seconds.optional(),
        maxWidth: z.number().int().positive().optional(),
        maxHeight: z.number().int().positive().optional(),
        maxFps: z.number().positive().optional(),
      })
      .optional(),
    audio: z
      .object({
        maxDuration: seconds.optional(),
        sampleRate: z.array(z.number().positive()).optional(),
      })
      .optional(),
  }),
  overrides: z
    .array(
      z.object({
        include: z.string().optional(),
        name: z.any().optional(),
        rules: z.record(z.any()),
      })
    )
    .default([]),
  output: z
    .object({
      format: z.enum(OUTPUT_FORMATS).default(OUTPUT_FORMATS[0]),
    })
    .default({ format: OUTPUT_FORMATS[0] }),
  report: z
    .object({
      enabled: z.boolean().default(false),
      path: z.string().optional(),
      format: z.enum(REPORT_FORMATS).default(REPORT_FORMATS[0]),
    })
    .default({ enabled: false, format: REPORT_FORMATS[0] }),
  ignoreFiles: z.array(z.string()).default([]),
});

export type LintConfig = z.infer<typeof ConfigSchema>;
