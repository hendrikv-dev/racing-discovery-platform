import { AdminNav } from "@/components/admin/admin-nav";
import { createChampionshipAction, deleteChampionshipAction, updateChampionshipAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminChampionshipsPage() {
  await requireAdminSession();
  const championships = await prisma.championship.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <AdminNav pathname="/admin/championships" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Create</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Add championship</h1>
          <form action={createChampionshipAction} className="mt-6 grid gap-4">
            {["name", "slug", "category", "region", "season", "image", "accentColor"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                className="rounded-[18px] border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300"
              />
            ))}
            <textarea
              name="description"
              rows={5}
              placeholder="description"
              className="rounded-[18px] border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300"
            />
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
              Create Championship
            </button>
          </form>
        </div>

        <div className="grid gap-4">
          {championships.map((championship) => (
            <form
              key={championship.id}
              action={updateChampionshipAction}
              className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel"
            >
              <input type="hidden" name="id" value={championship.id} />
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["name", championship.name],
                  ["slug", championship.slug],
                  ["category", championship.category],
                  ["region", championship.region],
                  ["season", championship.season],
                  ["image", championship.image],
                  ["accentColor", championship.accentColor]
                ].map(([name, value]) => (
                  <input
                    key={name}
                    name={name}
                    defaultValue={value}
                    className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                ))}
              </div>
              <textarea
                name="description"
                rows={4}
                defaultValue={championship.description}
                className="mt-3 w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  Save
                </button>
                <button
                  formAction={deleteChampionshipAction}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
