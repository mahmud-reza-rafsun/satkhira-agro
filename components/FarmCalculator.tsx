"use client";

import { useEffect, useRef } from "react";

/**
 * Mounts the Farm Calculator app inside Next.js.
 *
 * The app's markup is rendered as-is, and its original scripts run in
 * their original order once the markup is in the DOM — the same order
 * the single-file version ran them in. The app keeps using localStorage
 * exactly as before (same keys), so Backup / Restore keeps working.
 */
export default function FarmCalculator({
  css,
  markup,
  scripts,
  overridesCss,
}: {
  css: string;
  markup: string;
  scripts: string[];
  overridesCss: string;
}) {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    for (const code of scripts) {
      const el = document.createElement("script");
      el.textContent = code;
      document.body.appendChild(el);
    }
  }, [scripts]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      {/* shadcn control styling — after the app's own CSS so it wins,
          layout untouched (only the controls' own look changes). */}
      <style dangerouslySetInnerHTML={{ __html: overridesCss }} />
    </>
  );
}
