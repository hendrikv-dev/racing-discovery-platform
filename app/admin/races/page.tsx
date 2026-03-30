import { RaceStatus } from "@prisma/client";
import { AdminNav } from "@/components/admin/admin-nav";
import { updateRaceAdminAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminRacesPage() {
  await requireAdminSession();
  const [races, championships, tracks] = await Promise.all([
    prisma.race.findMany({ include: { championship: true, track: true }, orderBy: { startDate: "asc" } }),
    prisma.championship.findMany({ orderBy: { name: "asc" } }),
    prisma.track.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <AdminNav pathname="/admin/races" />
      </section>
      <div className="grid gap-4">
        {races.map((race) => (
          <form key={race.id} action={updateRaceAdminAction} className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel">
            <input type="hidden" name="id" value={race.id} />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <input name="name" defaultValue={race.name} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input name="slug" defaultValue={race.slug} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input name="series" defaultValue={race.series} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input name="location" defaultValue={race.location} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input name="startDate" type="datetime-local" defaultValue={race.startDate.toISOString().slice(0, 16)} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input name="endDate" type="datetime-local" defaultValue={race.endDate.toISOString().slice(0, 16)} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input name="latitude" type="number" step="0.0001" defaultValue={race.latitude} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input name="longitude" type="number" step="0.0001" defaultValue={race.longitude} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <select name="championshipId" defaultValue={race.championshipId} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                {championships.map((championship) => (
                  <option key={championship.id} value={championship.id}>{championship.name}</option>
                ))}
              </select>
              <select name="trackId" defaultValue={race.trackId} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>{track.name}</option>
                ))}
              </select>
              <select name="status" defaultValue={race.status} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                {Object.values(RaceStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <textarea name="summary" rows={3} defaultValue={race.summary} className="mt-3 w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Race</button>
          </form>
        ))}
      </div>
    </div>
  );
}
