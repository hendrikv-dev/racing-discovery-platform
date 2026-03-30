import { AdminNav } from "@/components/admin/admin-nav";
import { updateRacerAdminAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminRacersPage() {
  await requireAdminSession();
  const [racers, championships] = await Promise.all([
    prisma.racer.findMany({ include: { championship: true }, orderBy: { name: "asc" } }),
    prisma.championship.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <AdminNav pathname="/admin/racers" />
      </section>
      <div className="grid gap-4">
        {racers.map((racer) => (
          <form key={racer.id} action={updateRacerAdminAction} className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel">
            <input type="hidden" name="id" value={racer.id} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-apex-slate">{racer.name}</h2>
                <p className="mt-1 text-sm text-apex-muted">{racer.team}</p>
              </div>
              <select name="championshipId" defaultValue={racer.championshipId ?? ""} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                <option value="">No championship assigned</option>
                {championships.map((championship) => (
                  <option key={championship.id} value={championship.id}>{championship.name}</option>
                ))}
              </select>
            </div>
            <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Assignment</button>
          </form>
        ))}
      </div>
    </div>
  );
}
