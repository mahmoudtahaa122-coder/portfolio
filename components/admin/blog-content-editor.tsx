'use client'

import dynamic from 'next/dynamic'
import { commands } from '@uiw/react-md-editor'

import '@uiw/react-md-editor/markdown-editor.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const blogToolbar = [
  commands.bold,
  commands.italic,
  commands.group(
    [commands.title1, commands.title2, commands.title3],
    {
      name: 'heading',
      groupName: 'heading',
      buttonProps: { 'aria-label': 'Insert heading' },
    },
  ),
  commands.divider,
  commands.link,
  commands.code,
  commands.codeBlock,
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.divider,
  commands.quote,
  commands.image,
  commands.divider,
  commands.codeEdit,
  commands.codeLive,
  commands.codePreview,
]

export function BlogContentEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div
      data-color-mode="dark"
      className="w-full min-h-[400px] overflow-hidden rounded-md border border-border bg-card [&_.w-md-editor]:bg-card [&_.w-md-editor-toolbar]:border-border [&_.w-md-editor-toolbar]:bg-secondary/90 [&_.w-md-editor-text]:bg-secondary/30 [&_.w-md-editor-text-pre]:font-mono [&_.w-md-editor-preview]:bg-card"
    >
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        preview="live"
        visibleDragbar
        height={400}
        minHeight={400}
        commands={blogToolbar}
        extraCommands={[]}
      />
    </div>
  )
}
