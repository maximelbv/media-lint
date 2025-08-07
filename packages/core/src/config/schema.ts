import { z } from "zod";

const bytes = z.union([z.number().nonnegative(), z.string().min(1)]); // "1.5MB"
const seconds = z.union([z.number().nonnegative(), z.string().min(1)]); // "60s"

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
        name: z.any().optional(), // regex
        rules: z.record(z.any()),
      })
    )
    .default([]),
  report: z
    .object({
      format: z.array(z.enum(["table", "json"])).default(["table"]),
      outFile: z.string().optional(),
    })
    .default({ format: ["table"] }),
  ignoreFiles: z.array(z.string()).default([]),
});

export type LintConfig = z.infer<typeof ConfigSchema>;
