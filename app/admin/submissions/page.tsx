import { RaceStatus, RaceSubmissionStatus } from "@prisma/client";
import { AdminNav } from "@/components/admin/admin-nav";
import { convertSubmissionToRaceAction, updateSubmissionStatusAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/states";

export default async function AdminSubmissionsPage() {
  await requireAdminSession();
  const [submissions, championships, tracks] = await Promise.all([
    prisma.raceSubmission.findMany({
      include: { championship: true, track: true, race: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.championship.findMany({ orderBy: { name: "asc" } }),
    prisma.track.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <AdminNav pathname="/admin/submissions" />
      </section>

      {submissions.length === 0 ? (
        <EmptyState
          title="No submissions yet"
          description="Incoming race submissions will appear here for review and conversion."
        />
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                    Submission
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-apex-slate">{submission.eventName}</h2>
                  <p className="mt-2 text-sm text-apex-muted">
                    {submission.series} • {submission.circuit}
                  </p>
                </div>
                <form action={updateSubmissionStatusAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={submission.id} />
                  <select name="status" defaultValue={submission.status} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                    {Object.values(RaceSubmissionStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Update</button>
                </form>
              </div>

              <p className="mt-4 text-sm leading-6 text-apex-muted">{submission.description}</p>

              <form action={convertSubmissionToRaceAction} className="mt-5 grid gap-3">
                <input type="hidden" name="submissionId" value={submission.id} />
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <input name="name" defaultValue={submission.eventName} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <input name="slug" defaultValue={submission.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <input name="series" defaultValue={submission.series} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <input name="location" defaultValue={submission.circuit} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <input name="startDate" type="datetime-local" defaultValue={submission.eventDate.toISOString().slice(0, 16)} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <input name="endDate" type="datetime-local" defaultValue={submission.eventDate.toISOString().slice(0, 16)} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <input name="latitude" type="number" step="0.0001" defaultValue={submission.latitude ?? ""} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <input name="longitude" type="number" step="0.0001" defaultValue={submission.longitude ?? ""} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                  <select name="championshipId" defaultValue={submission.championshipId ?? ""} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                    <option value="">Select championship</option>
                    {championships.map((championship) => (
                      <option key={championship.id} value={championship.id}>{championship.name}</option>
                    ))}
                  </select>
                  <select name="trackId" defaultValue={submission.trackId ?? ""} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                    <option value="">Select track</option>
                    {tracks.map((track) => (
                      <option key={track.id} value={track.id}>{track.name}</option>
                    ))}
                  </select>
                  <select name="status" defaultValue={RaceStatus.UPCOMING} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                    {Object.values(RaceStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <textarea name="summary" rows={3} defaultValue={submission.description} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={submission.status === RaceSubmissionStatus.CONVERTED || Boolean(submission.raceId)}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Convert To Race
                  </button>
                  {submission.race ? (
                    <span className="text-sm text-apex-muted">Converted to {submission.race.name}</span>
                  ) : null}
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
