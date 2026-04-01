import { AdminNav } from "@/components/admin/admin-nav";
import { createChampionshipAction, deleteChampionshipAction, updateChampionshipAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminChampionshipsPage() {
  await requireAdminSession();
  const championships = await prisma.championship.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <section className="app-panel rounded-[28px] p-6">
        <AdminNav pathname="/admin/championships" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-card-strong rounded-[28px] p-6 text-white">
          <p className="app-kicker">Create</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Add championship</h1>
          <form action={createChampionshipAction} className="mt-6 grid gap-4">
            {["name", "slug", "category", "region", "season", "image", "accentColor"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                className="app-input"
              />
            ))}
            <textarea
              name="description"
              rows={5}
              placeholder="description"
              className="app-input"
            />
            <button className="primary-action rounded-xl px-5 py-3 text-sm font-semibold">
              Create Championship
            </button>
          </form>
        </div>

        <div className="grid gap-4">
          {championships.map((championship) => (
            <form
              key={championship.id}
              action={updateChampionshipAction}
              className="app-panel rounded-[24px] p-5"
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
                    className="app-input"
                  />
                ))}
              </div>
              <textarea
                name="description"
                rows={4}
                defaultValue={championship.description}
                className="mt-3 w-full app-input"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="primary-action rounded-xl px-4 py-2 text-sm font-semibold">
                  Save
                </button>
                <button
                  formAction={deleteChampionshipAction}
                  className="rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200"
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
