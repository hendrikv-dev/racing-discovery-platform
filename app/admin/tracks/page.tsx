import { AdminNav } from "@/components/admin/admin-nav";
import { updateTrackAdminAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminTracksPage() {
  await requireAdminSession();
  const tracks = await prisma.track.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <section className="app-panel rounded-[28px] p-6">
        <AdminNav pathname="/admin/tracks" />
      </section>
      <div className="grid gap-4">
        {tracks.map((track) => (
          <form key={track.id} action={updateTrackAdminAction} className="app-panel rounded-[24px] p-5">
            <input type="hidden" name="id" value={track.id} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-50">{track.name}</h2>
                <p className="mt-1 text-sm text-zinc-300">{track.country}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input name="latitude" type="number" step="0.0001" defaultValue={track.latitude} className="app-input" />
                <input name="longitude" type="number" step="0.0001" defaultValue={track.longitude} className="app-input" />
              </div>
            </div>
            <button className="primary-action mt-4 rounded-xl px-4 py-2 text-sm font-semibold">Save Coordinates</button>
          </form>
        ))}
      </div>
    </div>
  );
}
