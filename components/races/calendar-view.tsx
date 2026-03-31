"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DiscoveryRace } from "@/lib/discovery";
import { EmptyState } from "@/components/states";

function toDateKey(value: string) {
  return value.slice(0, 10);
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1));
  const startOffset = firstDay.getUTCDay();
  const startDate = new Date(Date.UTC(year, month, 1 - startOffset));

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(startDate);
    day.setUTCDate(startDate.getUTCDate() + index);
    return day;
  });
}

export function CalendarEventChip({
  race,
  selected,
  onSelect
}: {
  race: DiscoveryRace;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[12px] px-2 py-1 text-left text-xs font-semibold transition duration-150 ${
        selected
          ? "bg-violet-600 text-white"
          : race.isTracked
            ? "border border-violet-400/30 bg-violet-500/12 text-violet-200 hover:bg-violet-500/18"
            : "border border-teal-400/20 bg-teal-500/10 text-teal-200 hover:bg-teal-500/16"
      }`}
    >
      {race.name}
    </button>
  );
}

export function CalendarDayCell({
  day,
  currentMonth,
  races,
  selected,
  onSelectDay,
  onSelectRace
}: {
  day: Date;
  currentMonth: number;
  races: DiscoveryRace[];
  selected: boolean;
  onSelectDay: () => void;
  onSelectRace: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelectDay}
      className={`min-h-[140px] rounded-[20px] border p-3 text-left transition duration-150 ${
        selected
          ? "border-violet-400/40 bg-violet-500/10"
          : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${day.getUTCMonth() === currentMonth ? "text-zinc-100" : "text-zinc-500"}`}>
          {day.getUTCDate()}
        </span>
        {races.length > 0 ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-zinc-200">
            {races.length}
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-2">
        {races.slice(0, 2).map((race) => (
          <CalendarEventChip
            key={race.id}
            race={race}
            selected={selected}
            onSelect={onSelectRace}
          />
        ))}
      </div>
    </button>
  );
}

export function CalendarGrid({
  monthDate,
  races,
  selectedDay,
  onSelectDay
}: {
  monthDate: Date;
  races: DiscoveryRace[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
}) {
  const currentMonth = monthDate.getUTCMonth();
  const days = buildCalendarDays(monthDate);

  return (
    <div className="grid gap-3 md:grid-cols-7">
      {days.map((day) => {
        const dayKey = toDateKey(day.toISOString());
        const dayRaces = races.filter((race) => toDateKey(race.startDate) === dayKey);

        return (
          <CalendarDayCell
            key={day.toISOString()}
            day={day}
            currentMonth={currentMonth}
            races={dayRaces}
            selected={selectedDay === dayKey}
            onSelectDay={() => onSelectDay(dayKey)}
            onSelectRace={() => onSelectDay(dayKey)}
          />
        );
      })}
    </div>
  );
}

export function CalendarView({ races }: { races: DiscoveryRace[] }) {
  if (races.length === 0) {
    return <EmptyState title="No races on this calendar" description="Try widening the date range or clearing filters to repopulate the calendar." />;
  }

  const firstRaceDate = races[0] ? new Date(races[0].startDate) : new Date();
  const monthDate = new Date(Date.UTC(firstRaceDate.getUTCFullYear(), firstRaceDate.getUTCMonth(), 1));
  const defaultSelected = races[0] ? toDateKey(races[0].startDate) : toDateKey(monthDate.toISOString());
  const [selectedDay, setSelectedDay] = useState(defaultSelected);

  const selectedDayRaces = useMemo(
    () => races.filter((race) => toDateKey(race.startDate) === selectedDay),
    [races, selectedDay]
  );

  return (
    <section className="space-y-4">
      <div className="surface-panel rounded-[28px] p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              Calendar View
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
                timeZone: "UTC"
              }).format(monthDate)}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-300">
            Jump straight from the month view into the exact day you want to watch.
          </p>
        </div>
        <CalendarGrid
          monthDate={monthDate}
          races={races}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      </div>

      <div className="surface-panel rounded-[28px] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
          Selected Day
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-50">{selectedDay}</h3>
        <div className="mt-4 space-y-3">
          {selectedDayRaces.length > 0 ? (
            selectedDayRaces.map((race) => (
              <Link
                key={race.id}
                href={`/races/${race.slug}`}
                className="surface-card block rounded-[20px] px-4 py-4 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
              >
                <p className="font-semibold text-zinc-50">{race.name}</p>
                <p className="mt-1 text-sm text-zinc-300">
                  {race.championshipName} • {race.trackName} • {race.location}
                </p>
                {race.isTracked ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                    Tracked race
                  </p>
                ) : null}
              </Link>
            ))
          ) : (
            <p className="text-sm text-zinc-300">No races are scheduled for that day.</p>
          )}
        </div>
      </div>
    </section>
  );
}
