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
      <section className="app-panel rounded-[28px] p-6">
        <AdminNav pathname="/admin/races" />
      </section>
      <div className="grid gap-4">
        {races.map((race) => (
          <form key={race.id} action={updateRaceAdminAction} className="app-panel rounded-[24px] p-5">
            <input type="hidden" name="id" value={race.id} />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <input name="name" defaultValue={race.name} className="app-input" />
              <input name="slug" defaultValue={race.slug} className="app-input" />
              <input name="series" defaultValue={race.series} className="app-input" />
              <input name="location" defaultValue={race.location} className="app-input" />
              <input name="ticketUrl" defaultValue={race.ticketUrl ?? ""} className="app-input" placeholder="Optional ticket URL" />
              <input name="startDate" type="datetime-local" defaultValue={race.startDate.toISOString().slice(0, 16)} className="app-input" />
              <input name="endDate" type="datetime-local" defaultValue={race.endDate.toISOString().slice(0, 16)} className="app-input" />
              <input name="latitude" type="number" step="0.0001" defaultValue={race.latitude} className="app-input" />
              <input name="longitude" type="number" step="0.0001" defaultValue={race.longitude} className="app-input" />
              <select name="championshipId" defaultValue={race.championshipId} className="app-input">
                {championships.map((championship) => (
                  <option key={championship.id} value={championship.id}>{championship.name}</option>
                ))}
              </select>
              <select name="trackId" defaultValue={race.trackId} className="app-input">
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>{track.name}</option>
                ))}
              </select>
              <select name="status" defaultValue={race.status} className="app-input">
                {Object.values(RaceStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <textarea name="summary" rows={3} defaultValue={race.summary} className="mt-3 w-full app-input" />
            <button className="primary-action mt-4 rounded-xl px-4 py-2 text-sm font-semibold">Save Race</button>
          </form>
        ))}
      </div>
    </div>
  );
}
