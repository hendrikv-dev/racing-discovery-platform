import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { MetricCard, SectionHeading } from "@/components/ui";

export default async function AdminPage() {
  await requireAdminSession();

  const [championships, races, racers, submissions] = await Promise.all([
    prisma.championship.count(),
    prisma.race.count(),
    prisma.racer.count(),
    prisma.raceSubmission.count()
  ]);

  return (
    <div className="space-y-8">
      <section className="surface-card-strong rounded-[28px] p-6 text-white">
        <p className="app-kicker">Admin</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Keep discovery data sharp</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
          Keep championship pages accurate, map locations easy to trust, and approved submissions
          ready for discovery.
        </p>
        <div className="mt-6">
          <AdminNav pathname="/admin" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Championships" value={String(championships).padStart(2, "0")} detail="Series available for public discovery." />
        <MetricCard label="Races" value={String(races).padStart(2, "0")} detail="Race records that can be filtered and tracked." />
        <MetricCard label="Racers" value={String(racers).padStart(2, "0")} detail="Competitors fans can follow and revisit." />
        <MetricCard label="Submissions" value={String(submissions).padStart(2, "0")} detail="Incoming race submissions awaiting review or conversion." />
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Admin Areas"
          title="Admin shortcuts"
          description="Jump straight to the part of the catalog you want to improve."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["/admin/championships", "Championship CRUD", "Create, update, and remove championship records."],
            ["/admin/races", "Race Data Quality", "Set championship links and race locations."],
            ["/admin/racers", "Racer Assignment", "Attach racers to championships cleanly."],
            ["/admin/tracks", "Track Coordinates", "Correct latitude and longitude for map views."],
            ["/admin/submissions", "Submission Conversion", "Approve submissions and convert them into real races."]
          ].map(([href, title, description]) => (
            <Link key={href} href={href} className="app-card rounded-[22px] p-5">
              <h2 className="text-xl font-bold text-zinc-50">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
