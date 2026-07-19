export function pickCheapestAvailableModel<T extends {
  reasoning: boolean;
  cost: { input: number; output: number };
}>(models: T[]): T | undefined {
  return [...models].sort((a, b) => {
    const output = a.cost.output - b.cost.output;
    if (output) return output;
    const input = a.cost.input - b.cost.input;
    if (input) return input;
    return Number(a.reasoning) - Number(b.reasoning);
  })[0];
}

export function normalizeSessionTitle(raw: string): string | undefined {
  const firstLine = raw.split(/\r?\n/, 1)[0]?.trim();
  if (!firstLine) return undefined;

  const cleaned = firstLine
    .replace(/^[\s`"'“”‘’*_-]+/, "")
    .replace(/[\s`"'“”‘’*_-]+$/, "")
    .replace(/^(?:titre|title)\s*:\s*/i, "")
    .replace(/[.!?…。！？]+$/u, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return undefined;

  const bounded = cleaned.split(" ").slice(0, 8).join(" ");
  return bounded.length > 80 ? bounded.slice(0, 80).trimEnd() : bounded;
}
