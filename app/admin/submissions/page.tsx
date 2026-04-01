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
      <section className="app-panel rounded-[28px] p-6">
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
            <div key={submission.id} className="app-panel rounded-[24px] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    Submission
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-zinc-50">{submission.eventName}</h2>
                  <p className="mt-2 text-sm text-zinc-300">
                    {submission.series} • {submission.circuit}
                  </p>
                </div>
                <form action={updateSubmissionStatusAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={submission.id} />
                  <select name="status" defaultValue={submission.status} className="app-input min-w-[12rem]">
                    {Object.values(RaceSubmissionStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]">Update</button>
                </form>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">{submission.description}</p>

              <form action={convertSubmissionToRaceAction} className="mt-5 grid gap-3">
                <input type="hidden" name="submissionId" value={submission.id} />
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <input name="name" defaultValue={submission.eventName} className="app-input" />
                  <input name="slug" defaultValue={submission.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="app-input" />
                  <input name="series" defaultValue={submission.series} className="app-input" />
                  <input name="location" defaultValue={submission.circuit} className="app-input" />
                  <input name="startDate" type="datetime-local" defaultValue={submission.eventDate.toISOString().slice(0, 16)} className="app-input" />
                  <input name="endDate" type="datetime-local" defaultValue={submission.eventDate.toISOString().slice(0, 16)} className="app-input" />
                  <input name="latitude" type="number" step="0.0001" defaultValue={submission.latitude ?? ""} className="app-input" />
                  <input name="longitude" type="number" step="0.0001" defaultValue={submission.longitude ?? ""} className="app-input" />
                  <select name="championshipId" defaultValue={submission.championshipId ?? ""} className="app-input">
                    <option value="">Select championship</option>
                    {championships.map((championship) => (
                      <option key={championship.id} value={championship.id}>{championship.name}</option>
                    ))}
                  </select>
                  <select name="trackId" defaultValue={submission.trackId ?? ""} className="app-input">
                    <option value="">Select track</option>
                    {tracks.map((track) => (
                      <option key={track.id} value={track.id}>{track.name}</option>
                    ))}
                  </select>
                  <select name="status" defaultValue={RaceStatus.UPCOMING} className="app-input">
                    {Object.values(RaceStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <textarea name="summary" rows={3} defaultValue={submission.description} className="app-input min-h-[7rem]" />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={submission.status === RaceSubmissionStatus.CONVERTED || Boolean(submission.raceId)}
                    className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Convert To Race
                  </button>
                  {submission.race ? (
                    <span className="text-sm text-zinc-300">Converted to {submission.race.name}</span>
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
