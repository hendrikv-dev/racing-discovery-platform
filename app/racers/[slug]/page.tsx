import Image from "next/image";
import { notFound } from "next/navigation";
import { MetricCard, SectionHeading } from "@/components/ui";
import { racers } from "@/data/site";

export default async function RacerProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const racer = racers.find((entry) => entry.slug === slug);

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
                A biometric-style dossier centered on pace, precision, and competitive arc across
                recent race weekends.
              </p>
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
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Machine Notes</p>
            <p className="mt-5 text-lg font-semibold">Hybrid power deployment optimized for late-corner exit.</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Aero efficiency, tire window control, and energy harvesting balance define the setup
              philosophy for this package.
            </p>
          </div>
        </div>

        <div className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
          <SectionHeading
            eyebrow="Engagement History"
            title="Recent race results"
            description="Tabular event history designed for quick comparison and form analysis."
          />
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-apex-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                  <th className="px-4 py-3 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {racer.recentResults.map((result) => (
                  <tr key={result.event}>
                    <td className="px-4 py-4 font-medium text-apex-slate">{result.event}</td>
                    <td className="px-4 py-4 text-apex-slate">{result.position}</td>
                    <td className="px-4 py-4 text-apex-muted">{result.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
