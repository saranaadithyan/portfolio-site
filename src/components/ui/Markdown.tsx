"use client";

import { isValidElement, type ReactNode, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

function getCodeText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getCodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getCodeText(children.props.children);
  }
  return "";
}

function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const code = getCodeText(children).replace(/\n$/, "");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="not-prose relative my-6 overflow-hidden rounded-lg bg-zinc-900">
      <button
        type="button"
        onClick={copyCode}
        className="absolute right-3 top-3 rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-200 transition-colors hover:bg-zinc-700"
        aria-label={copied ? "Code copied" : "Copy code to clipboard"}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="m-0 overflow-x-auto p-4 pt-12 text-sm text-zinc-100">
        {children}
      </pre>
    </div>
  );
}

function MarkdownTable({ children }: { children?: ReactNode }) {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-[#d5d7d5] bg-white shadow-sm">
      <table className="m-0 min-w-full border-collapse text-left text-sm text-[#444444]">
        {children}
      </table>
    </div>
  );
}

function MarkdownTableHead({ children }: { children?: ReactNode }) {
  return <thead className="bg-[#282929] text-xs uppercase tracking-wider text-white">{children}</thead>;
}

function MarkdownTableHeader({ children }: { children?: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-semibold">{children}</th>;
}

function MarkdownTableCell({ children }: { children?: ReactNode }) {
  return <td className="border-t border-[#e4e5e4] px-4 py-3 align-top even:bg-[#fafafa]">{children}</td>;
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-neutral mt-8 max-w-none prose-headings:text-[#282929] prose-p:text-[#444444]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          pre: CodeBlock,
          table: MarkdownTable,
          thead: MarkdownTableHead,
          th: MarkdownTableHeader,
          td: MarkdownTableCell,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
