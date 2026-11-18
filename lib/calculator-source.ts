import { readFileSync } from "node:fs";
import path from "node:path";

export type CalculatorSource = {
  css: string;
  markup: string;
  scripts: string[];
  /** shadcn control styling, injected after the app's own CSS. */
  overridesCss: string;
};

let cached: CalculatorSource | null = null;

/**
 * The Farm Calculator's original single-file app lives in
 * lib/farm-calculator-source.html (exported from the Muse web artifact).
 * This splits it once into its CSS, body markup and scripts, so the
 * Next.js shell can mount the app unchanged.
 */
export function getCalculatorSource(): CalculatorSource {
  if (cached) return cached;

  const file = path.join(process.cwd(), "lib", "farm-calculator-source.html");
  const html = readFileSync(file, "utf8");

  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1])
    .join("\n");

  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (m) => m[1],
  );

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  const body = bodyMatch ? bodyMatch[1] : "";
  // The scripts live at the end of <body>; the markup is everything else.
  const markup = body.replace(/<script>[\s\S]*?<\/script>/g, "").trim();

  const overridesCss = readFileSync(
    path.join(process.cwd(), "components", "shadcn-overrides.css"),
    "utf8",
  );

  cached = { css, markup, scripts, overridesCss };
  return cached;
}
