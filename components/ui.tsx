import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Dot, Gauge, MapPinned, Timer } from "lucide-react";
import { Race, RaceStatus, Racer, Track } from "@/data/site";

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
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-apex-muted">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-apex-slate md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-apex-muted md:text-base">{description}</p>
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5"
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
    Live: "bg-red-50 text-apex-alert ring-red-100",
    Upcoming: "bg-blue-50 text-apex-blue ring-blue-100",
    Completed: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[status]}`}>
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
    <div className="glass-border rounded-[20px] bg-white/80 p-5 shadow-panel backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-apex-muted">{label}</p>
      <p className="mt-4 text-4xl font-bold text-apex-slate">{value}</p>
      <p className="mt-2 text-sm leading-6 text-apex-muted">{detail}</p>
    </div>
  );
}

export function RaceCard({ race }: { race: Race }) {
  return (
    <div className="glass-border group rounded-[20px] bg-white/85 p-5 shadow-panel transition duration-200 hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
            {race.series}
          </p>
          <h3 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h3>
        </div>
        <StatusBadge status={race.status} />
      </div>
      <p className="text-sm leading-6 text-apex-muted">{race.summary}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm text-apex-slate">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
          <Timer className="h-4 w-4 text-apex-blue" />
          {race.date}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
          <MapPinned className="h-4 w-4 text-apex-blue" />
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
      className="glass-border group overflow-hidden rounded-[20px] bg-white/90 shadow-panel transition duration-200 hover:-translate-y-1"
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={racer.image}
          alt={`${racer.name} portrait for Racing Platform`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-apex-slate">{racer.name}</p>
          {racer.verified ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-apex-blue">
              Verified
            </span>
          ) : null}
        </div>
        <p className="text-sm text-apex-muted">{racer.team}</p>
        <div className="mt-4 flex gap-3 text-sm text-apex-slate">
          <span className="rounded-full bg-slate-100 px-3 py-2">{racer.nationality}</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">#{racer.number}</span>
        </div>
      </div>
    </Link>
  );
}

export function TrackCard({ track }: { track: Track }) {
  return (
    <Link
      href={`/tracks/${track.slug}`}
      className="glass-border group overflow-hidden rounded-[20px] bg-white/90 shadow-panel transition duration-200 hover:-translate-y-1"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={track.image}
          alt={`${track.name} circuit view`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-apex-slate">{track.name}</p>
            <p className="mt-1 text-sm text-apex-muted">{track.country}</p>
          </div>
          <Gauge className="h-5 w-5 text-apex-blue" />
        </div>
        <p className="mt-4 text-sm leading-6 text-apex-muted">{track.history}</p>
      </div>
    </Link>
  );
}
