"use client";

import { useEffect, useState } from "react";
import cn from "classnames";

interface Props {
  content: string;
}

interface TocLinks {
  id: string;
  text: string;
  level: number;
}

export default function PostIsland({ content }: Props) {
  const [links, setLinks] = useState<TocLinks[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const nodes = Array.from(doc.querySelectorAll("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]"));

    setLinks(
      nodes.map(n => ({
        id: n.id,
        text: n.textContent?.trim() ?? "",
        level: Number(n.tagName[1]),
      }))
    );
  }, [content]);

  return (
    <nav className="fixed top-36 right-12 w-64 hidden xl:inline-block">
      {links.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={
            "block border-l dark:border-neutral-700 px-4 py-1 text-neutral-500 dark:text-neutral-500 "
          }
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
