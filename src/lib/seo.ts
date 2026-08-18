import { useEffect } from "react";
import type { RouteHead } from "@/lib/router-compat";

function upsert(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Applies the route's metadata (title, description, OG/Twitter tags) to <head>. */
export function useSeo(head?: RouteHead) {
  useEffect(() => {
    if (!head) return;
    const { meta = [] } = head();
    for (const tag of meta) {
      if (tag["title"]) {
        document.title = tag["title"];
        continue;
      }
      const content = tag["content"];
      if (!content) continue;
      if (tag["name"]) upsert("name", tag["name"], content);
      else if (tag["property"]) upsert("property", tag["property"], content);
    }
  }, [head]);
}
