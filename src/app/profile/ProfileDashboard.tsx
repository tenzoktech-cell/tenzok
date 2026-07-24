"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  CircleCheck,
  Clock,
  CreditCard,
  FileText,
  FolderKanban,
  GraduationCap,
  Mail,
  LayoutDashboard,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { Button, buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/components/ui/Toast";
import type {
  ActionState,
} from "@/lib/profile-actions";
import {
  changePassword,
  deleteProject,
  saveProject,
  savePrefs,
  updateCompanyDetails,
  updateProfile,
  updateStudentDetails,
} from "@/lib/profile-actions";
import type {
  CompanyProfile,
  Profile,
  Project,
  StudentProfile,
} from "@/lib/db-types";
import { ROLE_LABELS } from "@/lib/db-types";
import { createClient } from "@/utils/supabase/client";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "—";

const INPUT =
  "w-full rounded-2xl border border-line bg-surface/70 px-4 py-3.5 text-base text-ink placeholder:text-ink-subtle transition-all hover:border-line-strong focus:border-cool focus:bg-surface focus:outline-none";
const LABEL =
  "mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-ink-muted";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`group block ${className}`.trim()}>
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

/** Wires a server action to toasts; renders its children inside a <form>. */
function ActionForm({
  action,
  submitLabel,
  children,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.notice) toast("success", state.notice);
    if (state?.error) toast("error", state.error);
  }, [state, toast]);

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      {children}
      <div className="mt-1 border-t border-line pt-5 sm:col-span-2">
        <Button type="submit" disabled={pending} className="min-w-36 shadow-lg shadow-black/15">
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRound;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-line bg-surface-raised/80 p-6 shadow-xl shadow-black/10 backdrop-blur sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-cool/5 blur-3xl"
      />
      <h2 className="relative flex items-center gap-3 text-lg font-semibold tracking-tight text-ink">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cool/25 bg-cool/10 text-cool">
          <Icon size={17} />
        </span>
        {title}
      </h2>
      <div className="relative mt-7">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

type Tab = "projects" | "details" | "role" | "settings";

interface Props {
  profile: Profile;
  projects: Project[];
  student: StudentProfile | null;
  company: CompanyProfile | null;
  lastLogin: string | null;
}

export default function ProfileDashboard({
  profile,
  projects,
  student,
  company,
  lastLogin,
}: Props) {
  const [tab, setTab] = useState<Tab>("projects");

  const roleTabLabel =
    profile.role === "student"
      ? "Academic Details"
      : profile.role === "company"
        ? "Organization"
        : null;

  const TABS: { id: Tab; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "details", label: "Edit Profile" },
    ...(roleTabLabel ? [{ id: "role" as Tab, label: roleTabLabel }] : []),
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10rem] top-12 -z-10 h-[34rem] w-[34rem] rounded-full bg-cool/10 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-14rem] top-[38rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-accent/[0.08] blur-[140px]"
      />
      <Container className="max-w-7xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cool">
              <LayoutDashboard size={14} />
              Personal workspace
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
              Projects, profile details, and account controls in one place.
            </p>
          </div>
          <span className="rounded-full border border-line bg-surface-raised/70 px-4 py-2 text-xs text-ink-muted backdrop-blur">
            {ROLE_LABELS[profile.role]} account
          </span>
        </div>

        <IdentityCard profile={profile} lastLogin={lastLogin} />

        <div
          role="group"
          aria-label="Profile sections"
          className="mt-8 flex w-full flex-wrap gap-1.5 rounded-2xl border border-line bg-surface-raised/70 p-1.5 shadow-lg shadow-black/10 backdrop-blur sm:w-fit"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`min-h-11 flex-1 cursor-pointer rounded-xl border px-4 text-sm font-medium transition-all sm:flex-none ${
                tab === t.id
                  ? "border-cool/35 bg-cool/10 text-ink shadow-sm"
                  : "border-transparent text-ink-subtle hover:bg-surface-overlay hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6">
          {tab === "projects" && <ProjectsSection projects={projects} />}
          {tab === "details" && <DetailsSection profile={profile} />}
          {tab === "role" && profile.role === "student" && (
            <StudentSection student={student} userId={profile.id} />
          )}
          {tab === "role" && profile.role === "company" && (
            <CompanySection company={company} />
          )}
          {tab === "settings" && <SettingsSection profile={profile} />}
        </div>
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Identity card: cover, avatar, meta                                  */
/* ------------------------------------------------------------------ */

function IdentityCard({
  profile,
  lastLogin,
}: {
  profile: Profile;
  lastLogin: string | null;
}) {
  const toast = useToast();
  const router = useRouter();
  const avatarInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, kind: "avatar" | "cover") => {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${profile.id}/${kind}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updateError } = await supabase
        .from("profiles")
        .update(kind === "avatar" ? { avatar_url: data.publicUrl } : { cover_url: data.publicUrl })
        .eq("id", profile.id);
      if (updateError) throw updateError;
      toast("success", kind === "avatar" ? "Profile picture updated." : "Cover updated.");
      router.refresh();
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const meta: { icon: typeof Mail; label: string; value: ReactNode }[] = [
    { icon: Mail, label: "Email", value: profile.email ?? "—" },
    { icon: Shield, label: "Role", value: ROLE_LABELS[profile.role] },
    { icon: Calendar, label: "Member since", value: fmtDate(profile.created_at) },
    { icon: Clock, label: "Last login", value: fmtDate(lastLogin) },
    {
      icon: CreditCard,
      label: "Plan",
      value: (
        <>
          <span className="capitalize">{profile.plan}</span>
          {profile.plan_expires_at ? ` · expires ${fmtDate(profile.plan_expires_at)}` : ""}
        </>
      ),
    },
    {
      icon: CircleCheck,
      label: "Status",
      value: <span className="capitalize">{profile.status}</span>,
    },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-surface-raised/90 shadow-2xl shadow-black/20">
      {/* Cover */}
      <div
        className="relative h-40 bg-gradient-to-br from-cool/25 via-surface-overlay to-accent/20 bg-cover bg-center sm:h-52"
        style={
          profile.cover_url ? { backgroundImage: `url(${profile.cover_url})` } : undefined
        }
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-surface-raised/80 via-transparent to-transparent"
        />
        <button
          type="button"
          onClick={() => coverInput.current?.click()}
          disabled={uploading}
          className="absolute right-4 top-4 flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-surface/70 px-4 text-xs font-medium text-ink shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-white/25 hover:bg-surface-overlay"
        >
          <Camera size={14} />
          Change cover
        </button>
        <input
          ref={coverInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "cover")}
        />
      </div>

      <div className="p-6 sm:p-9">
        <div className="flex flex-wrap items-end gap-5">
          {/* Avatar */}
          <div className="relative -mt-20 sm:-mt-24">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-surface-raised bg-surface-overlay shadow-xl shadow-black/30 sm:h-28 sm:w-28">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={40} className="text-ink-subtle" />
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInput.current?.click()}
              disabled={uploading}
              aria-label="Change profile picture"
              className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-cool/30 bg-cool text-cool-ink shadow-lg shadow-black/30 transition-transform hover:scale-105"
            >
              <Camera size={14} />
            </button>
            <input
              ref={avatarInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "avatar")}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              {profile.full_name ?? "Unnamed"}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
              <span>@{profile.username ?? "user"}</span>
              <span className="rounded-full border border-cool/25 bg-cool/10 px-3 py-1 text-xs font-medium text-cool">
                {ROLE_LABELS[profile.role]}
              </span>
            </p>
          </div>
        </div>

        {profile.bio && (
          <p className="mt-6 max-w-3xl text-sm leading-7 text-ink-muted sm:text-base">
            {profile.bio}
          </p>
        )}

        <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meta.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-2xl border border-line bg-surface/60 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-cool">
                <Icon size={14} />
              </span>
              <div className="min-w-0">
                <dt className="text-[0.68rem] uppercase tracking-[0.1em] text-ink-subtle">
                  {label}
                </dt>
                <dd className="mt-1 truncate text-sm font-medium text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {profile.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<Project["status"], string> = {
  draft: "border-line text-ink-subtle",
  active: "border-accent/40 text-accent",
  completed: "border-emerald-500/40 text-emerald-400",
};

function ProjectsSection({ projects }: { projects: Project[] }) {
  const [editing, setEditing] = useState<Project | "new" | null>(null);

  return (
    <Card title="Your projects" icon={FolderKanban}>
      {editing ? (
        <ProjectForm
          project={editing === "new" ? null : editing}
          onDone={() => setEditing(null)}
        />
      ) : (
        <>
          <div className="mb-6">
            <Button onClick={() => setEditing("new")} className="shadow-lg shadow-black/15">
              <Plus size={15} />
              New project
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-line-strong bg-gradient-to-br from-cool/[0.06] to-transparent px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cool/25 bg-cool/10 text-cool">
                <FolderKanban size={24} />
              </span>
              <p className="mt-5 text-lg font-semibold tracking-tight text-ink">
                No projects yet
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Create your first project to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex min-h-56 flex-col rounded-[1.6rem] border border-line bg-surface/70 p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-medium text-ink">{project.title}</h3>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs capitalize ${STATUS_STYLES[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  {project.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">
                      {project.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-xs leading-5 text-ink-subtle">
                    <span>
                      Created {fmtDate(project.created_at)} · Updated{" "}
                      {fmtDate(project.updated_at)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditing(project)}
                      aria-label={`Edit ${project.title}`}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-transparent text-ink-subtle transition-all hover:border-cool/25 hover:bg-cool/10 hover:text-cool"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function ProjectForm({
  project,
  onDone,
}: {
  project: Project | null;
  onDone: () => void;
}) {
  const [saveState, saveAction, saving] = useActionState(saveProject, null);
  const [deleteState, deleteAction, deleting] = useActionState(deleteProject, null);
  const toast = useToast();

  useEffect(() => {
    const state = saveState ?? deleteState;
    if (state?.notice) {
      toast("success", state.notice);
      onDone();
    }
    if (state?.error) toast("error", state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState, deleteState]);

  return (
    <div className="grid gap-5 rounded-[1.75rem] border border-line bg-surface/50 p-5 sm:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-cool">
          {project ? "Edit project" : "New project"}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Keep the essentials clear so every next step stays visible.
        </p>
      </div>
      <form action={saveAction} className="grid gap-5 sm:grid-cols-2">
        {project && <input type="hidden" name="id" value={project.id} />}
        <Field label="Project name" className="sm:col-span-2">
          <input
            name="title"
            defaultValue={project?.title ?? ""}
            required
            className={INPUT}
            placeholder="e.g. Campus placement portal"
          />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea
            name="description"
            defaultValue={project?.description ?? ""}
            rows={3}
            className={INPUT}
            placeholder="What is this project about?"
          />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={project?.status ?? "draft"} className={INPUT}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </Field>
        <div className="flex flex-wrap items-end gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : project ? "Save changes" : "Create project"}
          </Button>
          <Button variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>

      {project && (
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (
              !window.confirm(
                `Delete "${project.title}" permanently? This cannot be undone.`,
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={project.id} />
          <button
            type="submit"
            disabled={deleting}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 size={14} />
            {deleting ? "Deleting…" : "Delete this project"}
          </button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Personal details                                                    */
/* ------------------------------------------------------------------ */

function DetailsSection({ profile }: { profile: Profile }) {
  return (
    <Card title="Profile details" icon={UserRound}>
      <ActionForm action={updateProfile} submitLabel="Save profile">
        <Field label="Full name">
          <input name="full_name" defaultValue={profile.full_name ?? ""} required className={INPUT} />
        </Field>
        <Field label="Username">
          <input name="username" defaultValue={profile.username ?? ""} className={INPUT} />
        </Field>
        <Field label="Phone number">
          <input name="phone" defaultValue={profile.phone ?? ""} className={INPUT} />
        </Field>
        <Field label="Country">
          <input name="country" defaultValue={profile.country ?? ""} className={INPUT} />
        </Field>
        <Field label="City">
          <input name="city" defaultValue={profile.city ?? ""} className={INPUT} />
        </Field>
        <Field label="Website">
          <input name="website" defaultValue={profile.website ?? ""} className={INPUT} placeholder="https://…" />
        </Field>
        <Field label="LinkedIn">
          <input name="linkedin" defaultValue={profile.linkedin ?? ""} className={INPUT} placeholder="https://linkedin.com/in/…" />
        </Field>
        <Field label="GitHub">
          <input name="github" defaultValue={profile.github ?? ""} className={INPUT} placeholder="https://github.com/…" />
        </Field>
        <Field label="Skills (comma separated)" className="sm:col-span-2">
          <input
            name="skills"
            defaultValue={profile.skills.join(", ")}
            className={INPUT}
            placeholder="React, Python, Figma"
          />
        </Field>
        <Field label="Bio" className="sm:col-span-2">
          <textarea name="bio" defaultValue={profile.bio ?? ""} rows={4} className={INPUT} />
        </Field>
      </ActionForm>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Role-specific sections                                              */
/* ------------------------------------------------------------------ */

function StudentSection({
  student,
  userId,
}: {
  student: StudentProfile | null;
  userId: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const resumeInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadResume = async (file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${userId}/resume-${Date.now()}.pdf`;
      const { error } = await supabase.storage.from("resumes").upload(path, file, {
        upsert: true,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("resumes").getPublicUrl(path);
      const { error: updateError } = await supabase
        .from("student_profiles")
        .upsert({ user_id: userId, resume_url: data.publicUrl });
      if (updateError) throw updateError;
      toast("success", "Resume uploaded.");
      router.refresh();
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card title="Academic details" icon={GraduationCap}>
      <ActionForm action={updateStudentDetails} submitLabel="Save academic details">
        <Field label="College name">
          <input name="college" defaultValue={student?.college ?? ""} className={INPUT} />
        </Field>
        <Field label="University">
          <input name="university" defaultValue={student?.university ?? ""} className={INPUT} />
        </Field>
        <Field label="Degree">
          <input name="degree" defaultValue={student?.degree ?? ""} className={INPUT} placeholder="B.Tech, MCA…" />
        </Field>
        <Field label="Department">
          <input name="department" defaultValue={student?.department ?? ""} className={INPUT} />
        </Field>
        <Field label="Current semester">
          <input name="semester" defaultValue={student?.semester ?? ""} className={INPUT} />
        </Field>
        <Field label="Graduation year">
          <input name="graduation_year" defaultValue={student?.graduation_year ?? ""} className={INPUT} />
        </Field>
        <Field label="CGPA">
          <input name="cgpa" defaultValue={student?.cgpa ?? ""} className={INPUT} />
        </Field>
      </ActionForm>

      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface/60 p-5">
        <button
          type="button"
          onClick={() => resumeInput.current?.click()}
          disabled={uploading}
          className={buttonClass("secondary", "md", "shadow-lg shadow-black/10")}
        >
          <Upload size={15} />
          {uploading ? "Uploading…" : student?.resume_url ? "Replace resume" : "Upload resume"}
        </button>
        {student?.resume_url && (
          <a
            href={student.resume_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-accent underline underline-offset-4"
          >
            <FileText size={14} />
            View current resume
            <ArrowUpRight size={13} />
          </a>
        )}
        <input
          ref={resumeInput}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])}
        />
      </div>
    </Card>
  );
}

function CompanySection({ company }: { company: CompanyProfile | null }) {
  return (
    <Card title="Organization details" icon={Building2}>
      <ActionForm action={updateCompanyDetails} submitLabel="Save organization details">
        <Field label="Organization name">
          <input name="organization_name" defaultValue={company?.organization_name ?? ""} className={INPUT} />
        </Field>
        <Field label="Industry">
          <input name="industry" defaultValue={company?.industry ?? ""} className={INPUT} />
        </Field>
        <Field label="Company website">
          <input name="website" defaultValue={company?.website ?? ""} className={INPUT} placeholder="https://…" />
        </Field>
        <Field label="Company size">
          <select name="company_size" defaultValue={company?.company_size ?? ""} className={INPUT}>
            <option value="">Select…</option>
            <option>1–10</option>
            <option>11–50</option>
            <option>51–200</option>
            <option>201–1000</option>
            <option>1000+</option>
          </select>
        </Field>
        <Field label="Headquarters">
          <input name="headquarters" defaultValue={company?.headquarters ?? ""} className={INPUT} />
        </Field>
        <Field label="Contact number">
          <input name="contact_number" defaultValue={company?.contact_number ?? ""} className={INPUT} />
        </Field>
        <Field label="GST number (optional)">
          <input name="gst_number" defaultValue={company?.gst_number ?? ""} className={INPUT} />
        </Field>
        <Field label="Company description" className="sm:col-span-2">
          <textarea name="description" defaultValue={company?.description ?? ""} rows={4} className={INPUT} />
        </Field>
      </ActionForm>

      <div className="mt-8 rounded-[1.5rem] border border-cool/20 bg-gradient-to-br from-cool/[0.08] to-transparent p-5 text-sm leading-relaxed text-ink-muted">
        <p className="flex items-center gap-2 font-medium text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cool/10 text-cool">
            <Briefcase size={15} />
          </span>
          Need help completing your organization profile?
        </p>
        <p className="mt-2">
          For additional assistance contact{" "}
          <a
            href="mailto:info@tenzok.in"
            className="text-accent underline underline-offset-4"
          >
            info@tenzok.in
          </a>
          .
        </p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Settings: password + preferences                                    */
/* ------------------------------------------------------------------ */

function SettingsSection({ profile }: { profile: Profile }) {
  return (
    <>
      <Card title="Change password" icon={Shield}>
        <ActionForm action={changePassword} submitLabel="Change password">
          <Field label="New password">
            <input name="password" type="password" minLength={6} required className={INPUT} />
          </Field>
          <Field label="Confirm new password">
            <input name="confirm" type="password" minLength={6} required className={INPUT} />
          </Field>
        </ActionForm>
      </Card>

      <Card title="Notifications & privacy" icon={Mail}>
        <ActionForm action={savePrefs} submitLabel="Save preferences">
          <div className="grid gap-3 sm:col-span-2">
            <Pref
              name="email_notifications"
              label="Email notifications"
              hint="Product updates and important account emails."
              defaultChecked={profile.prefs.email_notifications ?? true}
            />
            <Pref
              name="chat_notifications"
              label="Chat notifications"
              hint="Show a toast when a new message arrives."
              defaultChecked={profile.prefs.chat_notifications ?? true}
            />
            <Pref
              name="profile_public"
              label="Public profile"
              hint="Allow your name and role to appear in chat search."
              defaultChecked={profile.prefs.profile_public ?? true}
            />
          </div>
        </ActionForm>
      </Card>
    </>
  );
}

function Pref({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-line bg-surface/70 p-4 transition-all hover:border-line-strong hover:bg-surface">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-5 w-5 rounded accent-[var(--color-cool)]"
      />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="mt-0.5 block text-xs text-ink-muted">{hint}</span>
      </span>
    </label>
  );
}
