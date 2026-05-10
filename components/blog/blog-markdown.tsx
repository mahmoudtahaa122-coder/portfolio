'use client'

import type { Components } from 'react-markdown'

/** Element styles for Markdown body on blog post pages */
export const blogMarkdownComponents = {
  h1: ({ children }) => (
    <h1 className="scroll-mt-28 text-3xl font-bold mb-4 mt-8">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="scroll-mt-28 text-2xl font-semibold mb-3 mt-6 border-b border-border pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="scroll-mt-28 text-xl font-semibold mb-2 mt-4">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-4 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-4 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-muted-foreground marker:text-muted-foreground">
      {children}
    </li>
  ),
  a: ({ children, href }) => (
    <a
      className="text-primary hover:underline"
      href={href}
      rel="noopener noreferrer"
      target={href?.startsWith('http') ? '_blank' : undefined}
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const inline = !className
    if (inline) {
      return (
        <code
          className="bg-secondary px-1.5 py-0.5 rounded font-mono text-sm text-foreground"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-secondary rounded-lg p-4 mb-4 overflow-x-auto [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-muted-foreground">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-border/60">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => <td className="px-3 py-2 align-top">{children}</td>,
} satisfies Components
