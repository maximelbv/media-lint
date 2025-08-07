export function parseBytes(v?: string | number) {
  if (v == null) return undefined;
  if (typeof v === "number") return v;
  const m = /^(\d+(?:\.\d+)?)([kKmMgG][bB])?$/.exec(v.trim());
  if (!m) return Number.NaN;
  const n = parseFloat(m[1]);
  const unit = (m[2] ?? "").toLowerCase();
  const mult =
    unit === "kb" ? 1e3 : unit === "mb" ? 1e6 : unit === "gb" ? 1e9 : 1;
  return Math.round(n * mult);
}

export function parseSeconds(v?: string | number) {
  if (v == null) return undefined;
  if (typeof v === "number") return v;
  const m = /^(\d+(?:\.\d+)?)(ms|s|m|h)?$/.exec(v.trim());
  if (!m) return Number.NaN;
  const n = parseFloat(m[1]);
  const u = m[2] ?? "s";
  const mult = u === "ms" ? 0.001 : u === "s" ? 1 : u === "m" ? 60 : 3600;
  return n * mult;
}
