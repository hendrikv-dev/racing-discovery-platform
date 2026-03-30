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
        <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            Contributor Portal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Submit a verified race entry</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Share a race we should add so more fans can discover it faster.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-200" />
              <p className="font-semibold">Verified Entry Notice</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Every submission is reviewed before it appears in the race calendar.
            </p>
          </div>
        </div>

        <div className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
          <SectionHeading
            eyebrow="Verification Flow"
            title="Race submission form"
            description="Send the key details we need to review and publish the race confidently."
          />
          <form action={createRaceSubmissionAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Event Name</span>
                <input name="eventName" required className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white" placeholder="Official race title" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Series</span>
                <input name="series" required className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white" placeholder="Formula Alpha, GT Masters, etc." />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Event Date</span>
                <input name="eventDate" type="datetime-local" required className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Circuit</span>
                <input name="circuit" required className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white" placeholder="Venue or street course" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Championship</span>
                <select name="championshipId" className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white">
                  <option value="">Optional championship</option>
                  {championships.map((championship) => (
                    <option key={championship.id} value={championship.id}>{championship.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Track Match</span>
                <select name="trackId" className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white">
                  <option value="">Optional track</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>{track.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Latitude</span>
                <input name="latitude" type="number" step="0.0001" className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white" placeholder="Optional map coordinate" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-apex-slate">Longitude</span>
                <input name="longitude" type="number" step="0.0001" className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white" placeholder="Optional map coordinate" />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-apex-slate">Description</span>
              <textarea
                name="description"
                required
                rows={5}
                className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
                placeholder="Add context, official notes, and supporting detail."
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-apex-slate">Source Notes</span>
              <textarea
                name="sourceNotes"
                rows={4}
                className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
                placeholder="Links, official schedule notes, or source references."
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-apex-slate">Contact Email</span>
              <input name="contactEmail" type="email" className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white" placeholder="Optional follow-up contact" />
            </label>
            <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 sm:w-auto">
              Submit for verification
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
