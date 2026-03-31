import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Dot, Gauge, MapPinned, Timer } from "lucide-react";
import { Championship, Race, RaceStatus, Racer, Track } from "@/data/site";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">{description}</p>
      </div>
      {href ? (
        <Link
          href={href}
          className="secondary-action inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
        >
          Explore more
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: RaceStatus }) {
  const styles: Record<RaceStatus, string> = {
    Live: "border-violet-400/40 bg-violet-500/12 text-violet-200",
    Upcoming: "border-teal-400/35 bg-teal-500/10 text-teal-200",
    Completed: "border-zinc-600 bg-zinc-800 text-zinc-300"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <Dot className="h-4 w-4" />
      {status}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="surface-card rounded-2xl p-5 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-zinc-50">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{detail}</p>
    </div>
  );
}

export function RaceCard({ race }: { race: Race }) {
  return (
    <div className="surface-card group rounded-[20px] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            {race.series}
          </p>
          <h3 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h3>
        </div>
        <StatusBadge status={race.status} />
      </div>
      <p className="text-sm leading-6 text-zinc-300">{race.summary}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-200">
        <span className="surface-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
          <Timer className="h-4 w-4 text-teal-300" />
          {race.date}
        </span>
        <span className="surface-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
          <MapPinned className="h-4 w-4 text-teal-300" />
          {race.location}
        </span>
      </div>
    </div>
  );
}

export function RacerCard({ racer }: { racer: Racer }) {
  return (
    <Link
      href={`/racers/${racer.slug}`}
      className="surface-card group overflow-hidden rounded-[20px] transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={racer.image}
          alt={`${racer.name} portrait for Racing Platform`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-[#09090F]/10 to-transparent" />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-zinc-50">{racer.name}</p>
          {racer.verified ? (
            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
              Verified
            </span>
          ) : null}
        </div>
        <p className="text-sm text-zinc-300">{racer.team}</p>
        <div className="mt-4 flex gap-3 text-sm text-zinc-200">
          <span className="surface-chip rounded-full px-3 py-2">{racer.nationality}</span>
          <span className="surface-chip rounded-full px-3 py-2">#{racer.number}</span>
        </div>
      </div>
    </Link>
  );
}

export function TrackCard({ track }: { track: Track }) {
  return (
    <Link
      href={`/tracks/${track.slug}`}
      className="surface-card group overflow-hidden rounded-[20px] transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={track.image}
          alt={`${track.name} circuit view`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-[#09090F]/5 to-transparent" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-zinc-50">{track.name}</p>
            <p className="mt-1 text-sm text-zinc-300">{track.country}</p>
          </div>
          <Gauge className="h-5 w-5 text-teal-300" />
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-300">{track.history}</p>
      </div>
    </Link>
  );
}

export function ChampionshipCard({ championship }: { championship: Championship }) {
  return (
    <div className="surface-card group overflow-hidden rounded-[20px] transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={championship.image}
          alt={`${championship.name} championship visual`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-tr ${championship.accent}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
          {championship.category}
        </p>
        <h3 className="mt-2 text-xl font-bold text-zinc-50">{championship.name}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-300">{championship.description}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-200">
          <span className="surface-chip rounded-full px-3 py-2">{championship.season}</span>
          <span className="surface-chip rounded-full px-3 py-2">{championship.region}</span>
          <span className="surface-chip rounded-full px-3 py-2">{championship.raceCount} races</span>
        </div>
      </div>
    </div>
  );
}
