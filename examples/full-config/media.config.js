export default {
  include: ["assets/**/*"],
  rules: {
    general: {
      allowedFormats: [
        "webp",
        "avif",
        "png",
        "svg",
        "mp4",
        "webm",
        "mp3",
        "wav",
      ],
      maxBytes: 1.5 * 1024 * 1024,
      naming: { noSpaces: true },
    },
    image: {
      maxWidth: 3840,
      maxHeight: 3840,
      maxMegapixels: 8,
    },
  },
  output: {
    format: "table",
  },
  report: {
    enabled: true,
    path: "reports/media-lint.json",
    format: "json",
  },
};
