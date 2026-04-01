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
      <section className="app-panel rounded-[28px] p-6">
        <AdminNav pathname="/admin/racers" />
      </section>
      <div className="grid gap-4">
        {racers.map((racer) => (
          <form key={racer.id} action={updateRacerAdminAction} className="app-panel rounded-[24px] p-5">
            <input type="hidden" name="id" value={racer.id} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-50">{racer.name}</h2>
                <p className="mt-1 text-sm text-zinc-300">{racer.team}</p>
              </div>
              <select name="championshipId" defaultValue={racer.championshipId ?? ""} className="app-input">
                <option value="">No championship assigned</option>
                {championships.map((championship) => (
                  <option key={championship.id} value={championship.id}>{championship.name}</option>
                ))}
              </select>
            </div>
            <button className="primary-action mt-4 rounded-xl px-4 py-2 text-sm font-semibold">Save Assignment</button>
          </form>
        ))}
      </div>
    </div>
  );
}
