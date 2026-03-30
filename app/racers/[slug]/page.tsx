import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { FollowButton } from "@/components/tracking/follow-button";
import { MetricCard, SectionHeading } from "@/components/ui";
import { getRacerBySlug } from "@/lib/discovery";

export default async function RacerProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const racer = await getRacerBySlug(slug, session?.user?.id);

  if (!racer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="glass-border overflow-hidden rounded-[28px] bg-white/80 shadow-panel">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[420px]">
            <Image
              src={racer.image}
              alt={`${racer.name} portrait`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
                Racer Profile
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-apex-slate md:text-5xl">
                {racer.name}
              </h1>
              <p className="mt-3 text-lg text-apex-muted">
                {racer.team} • {racer.nationality} • Car #{racer.number}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-7 text-apex-muted">
                Personalized racer follow controls now persist to the tracking tables in Prisma.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <FollowButton
                  entity="racers"
                  entityId={racer.id}
                  initialTracked={racer.isTracked}
                  activeLabel="Following"
                  inactiveLabel="Follow Racer"
                />
                {racer.championshipSlug ? (
                  <Link
                    href={`/championships/${racer.championshipSlug}`}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-apex-slate transition duration-200 hover:-translate-y-0.5"
                  >
                    View Championship
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Victories"
                value={String(racer.victories).padStart(2, "0")}
                detail="Career wins across premier series."
              />
              <MetricCard
                label="Podiums"
                value={String(racer.podiums).padStart(2, "0")}
                detail="Top-three finishes in verified events."
              />
              <MetricCard
                label="Titles"
                value={String(racer.championships).padStart(2, "0")}
                detail="Championships secured to date."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
          <SectionHeading
            eyebrow="Machine Gallery"
            title={racer.vehicle}
            description="Vehicle focus for the current competitive package, built around technical identity and race fit."
          />
          <div className="rounded-[24px] bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Championship Context</p>
            <p className="mt-5 text-lg font-semibold">
              {racer.championshipName ?? "Independent competitor context"}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Racer profiles can now connect back to championship pages for stronger discovery
              loops and saved tracking flows.
            </p>
          </div>
        </div>

        <div className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
          <SectionHeading
            eyebrow="Racer Snapshot"
            title="Current profile data"
            description="The detail view now reads the persisted racer record instead of static-only scaffolding."
          />
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="px-4 py-4 font-medium text-apex-slate">Team</td>
                  <td className="px-4 py-4 text-apex-muted">{racer.team}</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-apex-slate">Nationality</td>
                  <td className="px-4 py-4 text-apex-muted">{racer.nationality}</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-apex-slate">Championship</td>
                  <td className="px-4 py-4 text-apex-muted">
                    {racer.championshipName ?? "Not assigned"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-apex-slate">Vehicle</td>
                  <td className="px-4 py-4 text-apex-muted">{racer.vehicle}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
