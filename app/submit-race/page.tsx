import { ShieldCheck } from "lucide-react";
import { createRaceSubmissionAction } from "@/app/admin/actions";
import { SectionHeading } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function SubmitRacePage() {
  const [championships, tracks] = await Promise.all([
    prisma.championship.findMany({ orderBy: { name: "asc" } }),
    prisma.track.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#11131C]/95 p-6 text-white shadow-[0_18px_48px_rgba(0,0,0,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
            Contributor Portal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Submit a verified race entry</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            Share a race we should add so more fans can discover it faster.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-zinc-900/70 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-teal-300" />
              <p className="font-semibold">Verified Entry Notice</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Every submission is reviewed before it appears in the race calendar.
            </p>
          </div>
        </div>

        <div className="app-panel rounded-[28px] p-6">
          <SectionHeading
            eyebrow="Verification Flow"
            title="Race submission form"
            description="Send the key details we need to review and publish the race confidently."
          />
          <form action={createRaceSubmissionAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="app-label mb-2 block">Event Name</span>
                <input name="eventName" required className="app-input w-full" placeholder="Official race title" />
              </label>
              <label className="block">
                <span className="app-label mb-2 block">Series</span>
                <input name="series" required className="app-input w-full" placeholder="Formula Alpha, GT Masters, etc." />
              </label>
              <label className="block">
                <span className="app-label mb-2 block">Event Date</span>
                <input name="eventDate" type="datetime-local" required className="app-input w-full" />
              </label>
              <label className="block">
                <span className="app-label mb-2 block">Circuit</span>
                <input name="circuit" required className="app-input w-full" placeholder="Venue or street course" />
              </label>
              <label className="block">
                <span className="app-label mb-2 block">Championship</span>
                <select name="championshipId" className="app-input w-full">
                  <option value="">Optional championship</option>
                  {championships.map((championship) => (
                    <option key={championship.id} value={championship.id}>{championship.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="app-label mb-2 block">Track Match</span>
                <select name="trackId" className="app-input w-full">
                  <option value="">Optional track</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>{track.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="app-label mb-2 block">Latitude</span>
                <input name="latitude" type="number" step="0.0001" className="app-input w-full" placeholder="Optional map coordinate" />
              </label>
              <label className="block">
                <span className="app-label mb-2 block">Longitude</span>
                <input name="longitude" type="number" step="0.0001" className="app-input w-full" placeholder="Optional map coordinate" />
              </label>
            </div>
            <label className="block">
              <span className="app-label mb-2 block">Description</span>
              <textarea
                name="description"
                required
                rows={5}
                className="app-input min-h-[10rem] w-full"
                placeholder="Add context, official notes, and supporting detail."
              />
            </label>
            <label className="block">
              <span className="app-label mb-2 block">Source Notes</span>
              <textarea
                name="sourceNotes"
                rows={4}
                className="app-input min-h-[9rem] w-full"
                placeholder="Links, official schedule notes, or source references."
              />
            </label>
            <label className="block">
              <span className="app-label mb-2 block">Contact Email</span>
              <input name="contactEmail" type="email" className="app-input w-full" placeholder="Optional follow-up contact" />
            </label>
            <button className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] sm:w-auto">
              Submit for verification
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
