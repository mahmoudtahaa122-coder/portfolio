'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import {
  Trash2,
  Pencil,
  Plus,
  LogOut,
  LayoutDashboard,
  Loader2,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { usePortfolioAdmin } from '@/hooks/use-portfolio-admin'
import type {
  BlogPostRow,
  CertificationRow,
  EducationRow,
  ExperienceRow,
  ProfileRow,
  ProjectRow,
  SkillRow,
  TestimonialRow,
  VolunteeringRow,
} from '@/lib/admin/types'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function parseCommaList(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function listToCsv(arr: string[] | null): string {
  return (arr ?? []).join(', ')
}

function maxSortOrder<T extends { sort_order?: number | null }>(rows: T[]): number {
  return rows.reduce((m, r) => Math.max(m, r.sort_order ?? 0), 0)
}

type DeleteTarget =
  | { kind: 'project'; row: ProjectRow }
  | { kind: 'skill'; row: SkillRow }
  | { kind: 'experience'; row: ExperienceRow }
  | { kind: 'certification'; row: CertificationRow }
  | { kind: 'blog_post'; row: BlogPostRow }
  | { kind: 'profile'; row: ProfileRow }
  | { kind: 'education'; row: EducationRow }
  | { kind: 'testimonial'; row: TestimonialRow }
  | { kind: 'volunteering'; row: VolunteeringRow }

function tableForDelete(kind: DeleteTarget['kind']): string {
  switch (kind) {
    case 'project':
      return 'projects'
    case 'skill':
      return 'skills'
    case 'experience':
      return 'experience'
    case 'certification':
      return 'certifications'
    case 'blog_post':
      return 'blog_posts'
    case 'profile':
      return 'profile'
    case 'education':
      return 'education'
    case 'testimonial':
      return 'testimonials'
    case 'volunteering':
      return 'volunteering'
  }
}

export function AdminDashboard() {
  const { hydrated, loggedIn, data, refreshing, refresh, login, logout } =
    usePortfolioAdmin()
  const [password, setPassword] = React.useState('')
  const [loginBusy, setLoginBusy] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = React.useState<DeleteTarget | null>(
    null,
  )

  const wrapRefresh = React.useCallback(
    async (action: () => Promise<void>) => {
      try {
        await action()
        await refresh()
        toast.success('Changes synced.')
      } catch (e: unknown) {
        toast.error(
          e instanceof Error ? e.message : 'Something went wrong in Supabase.',
        )
      }
    },
    [refresh],
  )

  async function confirmDelete() {
    if (!pendingDelete) return
    const tgt = pendingDelete
    await wrapRefresh(async () => {
      const table = tableForDelete(tgt.kind)
      const { error } = await supabase.from(table).delete().eq('id', tgt.row.id)
      if (error) throw error
      setPendingDelete(null)
    })
  }

  async function tryLogin(ev: React.FormEvent) {
    ev.preventDefault()
    setLoginError(null)
    setLoginBusy(true)
    try {
      await login(password)
      setPassword('')
    } catch (e: unknown) {
      setLoginError(e instanceof Error ? e.message : 'Login failed.')
    } finally {
      setLoginBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors theme="dark" position="bottom-right" />

      {!hydrated ? (
        <div className="flex min-h-screen items-center justify-center gap-2">
          <Spinner className="size-6 text-primary" />
          <span className="text-muted-foreground">Loading…</span>
        </div>
      ) : !loggedIn ? (
        <div className="flex min-h-screen items-center justify-center p-6">
          <Card className="w-full max-w-md border-border bg-card shadow-xl shadow-primary/5">
            <CardHeader className="text-center space-y-1">
              <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <LayoutDashboard className="size-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Portfolio admin</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your admin password to manage Supabase content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={tryLogin}>
                <div className="space-y-2">
                  <Label htmlFor="pw">Password</Label>
                  <Input
                    id="pw"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setLoginError(null)
                    }}
                    className="bg-secondary/40 border-border"
                    placeholder="••••••••"
                  />
                  {loginError ? (
                    <p className="text-sm text-destructive">{loginError}</p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginBusy || !password.trim()}
                >
                  {loginBusy ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
              <Separator className="my-6 bg-border" />
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">&larr; Back to site</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-[1200px] px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Read and write{' '}
                <code className="rounded bg-secondary px-1 py-px text-xs font-mono">
                  projects
                </code>
                ,{' '}
                <code className="rounded bg-secondary px-1 py-px text-xs font-mono">
                  skills
                </code>
                , and related tables via Supabase.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {refreshing ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Spinner className="size-4" />
                  Syncing…
                </span>
              ) : null}
              <Button variant="outline" className="border-border" asChild>
                <Link href="/">View site</Link>
              </Button>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => {
                  logout()
                  toast.success('Signed out.')
                }}
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full gap-6">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-secondary/70 p-1">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="volunteering">Volunteering</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <ProfilePanel
                row={data.profile}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'profile', row })}
              />
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <ProjectsPanel
                rows={data.projects}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'project', row })}
              />
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <SkillsPanel
                rows={data.skills}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'skill', row })}
              />
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <ExperiencePanel
                rows={data.experience}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'experience', row })}
              />
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4">
              <CertificationsPanel
                rows={data.certifications}
                wrapRefresh={wrapRefresh}
                onDelete={(row) =>
                  setPendingDelete({ kind: 'certification', row })
                }
              />
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <EducationPanel
                rows={data.education}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'education', row })}
              />
            </TabsContent>

            <TabsContent value="blog" className="space-y-4">
              <BlogPanel
                rows={data.blog_posts}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'blog_post', row })}
              />
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-4">
              <TestimonialsPanel
                rows={data.testimonials}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'testimonial', row })}
              />
            </TabsContent>

            <TabsContent value="volunteering" className="space-y-4">
              <VolunteeringPanel
                rows={data.volunteering}
                wrapRefresh={wrapRefresh}
                onDelete={(row) => setPendingDelete({ kind: 'volunteering', row })}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this row?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete &&
                `'${truncate(
                  previewLabel(pendingDelete),
                  80,
                )}' will be removed from Supabase. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void confirmDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s
  return `${s.slice(0, n - 1)}…`
}

function previewLabel(d: DeleteTarget): string {
  switch (d.kind) {
    case 'project':
      return d.row.title
    case 'skill':
      return `${d.row.category}: ${d.row.name}`
    case 'experience':
      return `${d.row.title} @ ${d.row.company ?? ''}`
    case 'certification':
      return d.row.name
    case 'blog_post':
      return d.row.title
    case 'profile':
      return d.row.display_name ?? 'Profile row'
    case 'education':
      return d.row.degree ?? d.row.institution ?? 'Education'
    case 'testimonial':
      return d.row.name
    case 'volunteering':
      return `${d.row.title} @ ${d.row.organization}`
  }
}

/** ---- Projects ---- */

function ProjectsPanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: ProjectRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: ProjectRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ProjectRow | null>(null)

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [techCsv, setTechCsv] = React.useState('')
  const [year, setYear] = React.useState('')
  const [github, setGithub] = React.useState('')
  const [iconName, setIconName] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState('0')

  function openCreate() {
    setEditing(null)
    setTitle('')
    setDescription('')
    setTechCsv('')
    setYear('')
    setGithub('')
    setIconName('')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: ProjectRow) {
    setEditing(row)
    setTitle(row.title)
    setDescription(row.description ?? '')
    setTechCsv(listToCsv(row.tech_stack))
    setYear(row.year ?? '')
    setGithub(row.github ?? '')
    setIconName(row.icon_name ?? '')
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      title,
      description: description || null,
      tech_stack: parseCommaList(techCsv),
      year: year || null,
      github: github || null,
      icon_name: iconName || null,
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add project
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Tech</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[220px] font-medium">
                    {truncate(row.title, 56)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.year ?? '—'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                    {listToCsv(row.tech_stack)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                    No projects yet — add one to get started.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit project' : 'New project'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tech stack (comma-separated)</Label>
              <Input
                value={techCsv}
                onChange={(e) => setTechCsv(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Year</Label>
                <Input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>GitHub URL</Label>
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Icon name (optional Lucide)</Label>
              <Input
                value={iconName}
                placeholder="e.g. Library"
                onChange={(e) => setIconName(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!title.trim()} onClick={() => void submit()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Skills ---- */

function SkillsPanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: SkillRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: SkillRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<SkillRow | null>(null)
  const [category, setCategory] = React.useState('')
  const [categoryIcon, setCategoryIcon] = React.useState('')
  const [name, setName] = React.useState('')
  const [level, setLevel] = React.useState('80')
  const [sortOrder, setSortOrder] = React.useState('0')

  function openCreate() {
    setEditing(null)
    setCategory('')
    setCategoryIcon('')
    setName('')
    setLevel('80')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: SkillRow) {
    setEditing(row)
    setCategory(row.category)
    setCategoryIcon(row.category_icon ?? '')
    setName(row.name)
    setLevel(String(row.level ?? 0))
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      category,
      category_icon: categoryIcon || null,
      name,
      level: Math.min(100, Math.max(0, Number.parseInt(level, 10) || 0)),
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('skills')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('skills').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add skill
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.level ?? '—'}%
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    No skills.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit skill' : 'New skill'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category icon name (Lucide)</Label>
              <Input
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                className="bg-secondary/40 border-border"
                placeholder="Optional"
              />
            </div>
            <div className="grid gap-2">
              <Label>Skill name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Level (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!category.trim() || !name.trim()}
              onClick={() => void submit()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Experience ---- */

function ExperiencePanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: ExperienceRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: ExperienceRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ExperienceRow | null>(null)
  const [title, setTitle] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [period, setPeriod] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [type, setType] = React.useState('work')
  const [sortOrder, setSortOrder] = React.useState('0')
  const [tagsCsv, setTagsCsv] = React.useState('')

  function openCreate() {
    setEditing(null)
    setTitle('')
    setCompany('')
    setLocation('')
    setPeriod('')
    setDescription('')
    setTagsCsv('')
    setType('work')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: ExperienceRow) {
    setEditing(row)
    setTitle(row.title)
    setCompany(row.company ?? '')
    setLocation(row.location ?? '')
    setPeriod(row.period ?? '')
    setDescription(row.description ?? '')
    setTagsCsv(listToCsv(row.tags))
    setType(row.type ?? 'work')
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      title,
      company: company || null,
      location: location || null,
      period: period || null,
      description: description || null,
      type: type || null,
      tags: parseCommaList(tagsCsv),
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('experience')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('experience').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add experience
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[180px] font-medium">
                    {truncate(row.title, 40)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.company ?? '—'}
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">
                      {row.type ?? '—'}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate text-xs text-muted-foreground">
                    {listToCsv(row.tags)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    No experience entries.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit experience' : 'New experience'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Company</Label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Period</Label>
              <Input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full border-border bg-secondary/40">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="work">work</SelectItem>
                  <SelectItem value="internship">internship</SelectItem>
                  <SelectItem value="military">military</SelectItem>
                  <SelectItem value="training">training</SelectItem>
                  <SelectItem value="education">education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tagsCsv}
                placeholder="Networking, ISP, Automation"
                onChange={(e) => setTagsCsv(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!title.trim()} onClick={() => void submit()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Certifications ---- */

function CertificationsPanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: CertificationRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: CertificationRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<CertificationRow | null>(null)
  const [name, setName] = React.useState('')
  const [provider, setProvider] = React.useState('')
  const [link, setLink] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState('0')

  function openCreate() {
    setEditing(null)
    setName('')
    setProvider('')
    setLink('')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: CertificationRow) {
    setEditing(row)
    setName(row.name)
    setProvider(row.provider ?? '')
    setLink(row.link ?? '')
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      name,
      provider: provider || null,
      link: link || null,
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('certifications')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('certifications').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add certification
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[200px] font-medium">
                    {truncate(row.name, 52)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.provider ?? '—'}
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate text-xs text-muted-foreground">
                    {row.link ?? '—'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    No certifications.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit certification' : 'New certification'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Provider</Label>
              <Input
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Link</Label>
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!name.trim()} onClick={() => void submit()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Blog ---- */

function BlogPanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: BlogPostRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: BlogPostRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<BlogPostRow | null>(null)
  const [title, setTitle] = React.useState('')
  const [excerpt, setExcerpt] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [readTime, setReadTime] = React.useState('')
  const [dateDisplay, setDateDisplay] = React.useState('')
  const [tagsCsv, setTagsCsv] = React.useState('')
  const [iconName, setIconName] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState('0')

  function openCreate() {
    setEditing(null)
    setTitle('')
    setExcerpt('')
    setSlug('')
    setCategory('')
    setReadTime('')
    setDateDisplay('')
    setTagsCsv('')
    setIconName('')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: BlogPostRow) {
    setEditing(row)
    setTitle(row.title)
    setExcerpt(row.excerpt ?? '')
    setSlug(row.slug)
    setCategory(row.category ?? '')
    setReadTime(row.read_time ?? '')
    setDateDisplay(row.date_display ?? '')
    setTagsCsv(listToCsv(row.tags))
    setIconName(row.icon_name ?? '')
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      title,
      excerpt: excerpt || null,
      slug,
      category: category || null,
      read_time: readTime || null,
      date_display: dateDisplay || null,
      tags: parseCommaList(tagsCsv),
      icon_name: iconName || null,
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add post
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[200px] font-medium">
                    {truncate(row.title, 48)}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate font-mono text-xs text-muted-foreground">
                    {row.slug}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.category ?? '—'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    No blog posts.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit post' : 'New post'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-secondary/40 border-border font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label>Excerpt</Label>
              <Textarea
                rows={4}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Read time</Label>
                <Input
                  value={readTime}
                  placeholder="12 min read"
                  onChange={(e) => setReadTime(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Date (display)</Label>
              <Input
                value={dateDisplay}
                placeholder="Mar 2026"
                onChange={(e) => setDateDisplay(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tagsCsv}
                onChange={(e) => setTagsCsv(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Icon name (Lucide)</Label>
                <Input
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-secondary/40 border-border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!title.trim() || !slug.trim()}
              onClick={() => void submit()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Profile (single logical row) ---- */

function ProfilePanel({
  row,
  wrapRefresh,
  onDelete,
}: {
  row: ProfileRow | null
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: ProfileRow) => void
}) {
  const [open, setOpen] = React.useState(false)

  const [displayName, setDisplayName] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [availability, setAvailability] = React.useState('')
  const [heroIntro, setHeroIntro] = React.useState('')
  const [rolesCsv, setRolesCsv] = React.useState('')
  const [githubUrl, setGithubUrl] = React.useState('')
  const [linkedinUrl, setLinkedinUrl] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [locationField, setLocationField] = React.useState('')
  const [aboutBio, setAboutBio] = React.useState('')

  function openCreateOrEdit(r: ProfileRow | null) {
    if (!r) {
      setDisplayName('')
      setTitle('')
      setAvailability('')
      setHeroIntro('')
      setRolesCsv('')
      setGithubUrl('')
      setLinkedinUrl('')
      setEmail('')
      setPhone('')
      setLocationField('')
      setAboutBio('')
    } else {
      setDisplayName(r.display_name ?? '')
      setTitle(r.title ?? '')
      setAvailability(r.availability_badge ?? '')
      setHeroIntro(r.hero_intro ?? '')
      setRolesCsv(listToCsv(r.typewriter_roles))
      setGithubUrl(r.github_url ?? '')
      setLinkedinUrl(r.linkedin_url ?? '')
      setEmail(r.email ?? '')
      setPhone(r.phone ?? '')
      setLocationField(r.location ?? '')
      setAboutBio(r.about_bio ?? '')
    }
    setOpen(true)
  }

  async function submit(r: ProfileRow | null) {
    const payload = {
      display_name: displayName || null,
      title: title || null,
      availability_badge: availability || null,
      hero_intro: heroIntro || null,
      typewriter_roles: parseCommaList(rolesCsv),
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
      email: email || null,
      phone: phone || null,
      location: locationField || null,
      about_bio: aboutBio || null,
    }

    await wrapRefresh(async () => {
      if (r) {
        const { error } = await supabase
          .from('profile')
          .update(payload)
          .eq('id', r.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('profile').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        {!row ? (
          <Button className="gap-2" onClick={() => openCreateOrEdit(null)}>
            <Plus className="size-4" />
            Create profile row
          </Button>
        ) : null}
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!row ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No profile row — create one to store hero and footer content.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell className="font-medium">
                    {row.display_name ?? '—'}
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate text-sm">
                    {row.title ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.email ?? '—'}
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                    {row.availability_badge ?? '—'}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openCreateOrEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {!row ? 'Create profile row' : 'Edit profile row'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Display name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Title / headline</Label>
              <Input
                value={title}
                placeholder="Subtitle line under name (not typewriter)"
                onChange={(e) => setTitle(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Availability badge text</Label>
              <Input
                value={availability}
                placeholder="Badge above name"
                onChange={(e) => setAvailability(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Hero intro paragraph</Label>
              <Textarea
                rows={4}
                value={heroIntro}
                onChange={(e) => setHeroIntro(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Typewriter roles (comma-separated)</Label>
              <Input
                value={rolesCsv}
                placeholder="Network Engineer, Python Developer …"
                onChange={(e) => setRolesCsv(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>GitHub URL</Label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="border-border bg-secondary/40"
                />
              </div>
              <div className="grid gap-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="border-border bg-secondary/40"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border bg-secondary/40"
                />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-border bg-secondary/40"
                />
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input
                  value={locationField}
                  onChange={(e) => setLocationField(e.target.value)}
                  className="border-border bg-secondary/40"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>About bio</Label>
              <Textarea
                rows={8}
                value={aboutBio}
                placeholder="Shows in About section summary when set"
                onChange={(e) => setAboutBio(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submit(row)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Education ---- */

function EducationPanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: EducationRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: EducationRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<EducationRow | null>(null)
  const [degree, setDegree] = React.useState('')
  const [field, setField] = React.useState('')
  const [institution, setInstitution] = React.useState('')
  const [period, setPeriod] = React.useState('')
  const [loc, setLoc] = React.useState('')
  const [grade, setGrade] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState('0')

  function openCreate() {
    setEditing(null)
    setDegree('')
    setField('')
    setInstitution('')
    setPeriod('')
    setLoc('')
    setGrade('')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: EducationRow) {
    setEditing(row)
    setDegree(row.degree ?? '')
    setField(row.field ?? '')
    setInstitution(row.institution ?? '')
    setPeriod(row.period ?? '')
    setLoc(row.location ?? '')
    setGrade(row.grade ?? '')
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      degree: degree || null,
      field: field || null,
      institution: institution || null,
      period: period || null,
      location: loc || null,
      grade: grade || null,
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('education')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('education').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add education
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Degree</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[200px] font-medium">
                    {truncate(row.degree ?? '—', 48)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.institution ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.period ?? '—'}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No education rows.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit education' : 'New education'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Degree</Label>
              <Input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Field</Label>
              <Input
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Institution</Label>
              <Input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Period</Label>
              <Input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Location</Label>
              <Input
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Grade</Label>
              <Input
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submit()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Testimonials ---- */

function TestimonialsPanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: TestimonialRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: TestimonialRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<TestimonialRow | null>(null)
  const [name, setName] = React.useState('')
  const [role, setRole] = React.useState('')
  const [relationship, setRelationship] = React.useState('')
  const [date, setDate] = React.useState('')
  const [quote, setQuote] = React.useState('')
  const [linkedinUrl, setLinkedinUrl] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState('0')

  function openCreate() {
    setEditing(null)
    setName('')
    setRole('')
    setRelationship('')
    setDate('')
    setQuote('')
    setLinkedinUrl('')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: TestimonialRow) {
    setEditing(row)
    setName(row.name)
    setRole(row.role ?? '')
    setRelationship(row.relationship ?? '')
    setDate(row.date ?? '')
    setQuote(row.quote)
    setLinkedinUrl(row.linkedin_url ?? '')
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      name,
      role: role || null,
      relationship: relationship || null,
      date: date || null,
      quote,
      linkedin_url: linkedinUrl || null,
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('testimonials').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add testimonial
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.role ?? '—'}
                  </TableCell>
                  <TableCell className="max-w-[260px] truncate text-xs text-muted-foreground">
                    {row.quote}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No testimonials.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit testimonial' : 'New testimonial'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Relationship</Label>
              <Input
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Quote</Label>
              <Textarea
                rows={6}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!name.trim() || !quote.trim()}
              onClick={() => void submit()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** ---- Volunteering ---- */

function VolunteeringPanel({
  rows,
  wrapRefresh,
  onDelete,
}: {
  rows: VolunteeringRow[]
  wrapRefresh: (fn: () => Promise<void>) => Promise<void>
  onDelete: (row: VolunteeringRow) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<VolunteeringRow | null>(null)
  const [title, setTitle] = React.useState('')
  const [organization, setOrganization] = React.useState('')
  const [period, setPeriod] = React.useState('')
  const [loc, setLoc] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [tagsCsv, setTagsCsv] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState('0')

  function openCreate() {
    setEditing(null)
    setTitle('')
    setOrganization('')
    setPeriod('')
    setLoc('')
    setDescription('')
    setTagsCsv('')
    setSortOrder(String(maxSortOrder(rows) + 1))
    setOpen(true)
  }

  function openEdit(row: VolunteeringRow) {
    setEditing(row)
    setTitle(row.title)
    setOrganization(row.organization)
    setPeriod(row.period ?? '')
    setLoc(row.location ?? '')
    setDescription(row.description ?? '')
    setTagsCsv(listToCsv(row.tags))
    setSortOrder(String(row.sort_order ?? 0))
    setOpen(true)
  }

  async function submit() {
    const payload = {
      title,
      organization,
      period: period || null,
      location: loc || null,
      description: description || null,
      tags: parseCommaList(tagsCsv),
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    }
    await wrapRefresh(async () => {
      if (editing) {
        const { error } = await supabase
          .from('volunteering')
          .update(payload)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('volunteering').insert(payload)
        if (error) throw error
      }
      setOpen(false)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Add volunteering
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Role / title</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.organization}</TableCell>
                  <TableCell className="text-muted-foreground">{row.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.period ?? '—'}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border gap-1"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No volunteering rows.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit volunteering' : 'New volunteering'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Title (role)</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Organization</Label>
              <Input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Period</Label>
              <Input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Location</Label>
              <Input
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tagsCsv}
                onChange={(e) => setTagsCsv(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border-border bg-secondary/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!title.trim() || !organization.trim()}
              onClick={() => void submit()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
