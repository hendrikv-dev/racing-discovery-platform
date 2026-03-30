import { AdminNav } from "@/components/admin/admin-nav";
import { updateTrackAdminAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminTracksPage() {
  await requireAdminSession();
  const tracks = await prisma.track.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <AdminNav pathname="/admin/tracks" />
      </section>
      <div className="grid gap-4">
        {tracks.map((track) => (
          <form key={track.id} action={updateTrackAdminAction} className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel">
            <input type="hidden" name="id" value={track.id} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-apex-slate">{track.name}</h2>
                <p className="mt-1 text-sm text-apex-muted">{track.country}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input name="latitude" type="number" step="0.0001" defaultValue={track.latitude} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                <input name="longitude" type="number" step="0.0001" defaultValue={track.longitude} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              </div>
            </div>
            <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Coordinates</button>
          </form>
        ))}
      </div>
    </div>
  );
}
