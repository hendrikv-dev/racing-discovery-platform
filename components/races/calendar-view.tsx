"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DiscoveryRace } from "@/lib/discovery";

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
      className={`w-full rounded-[12px] px-2 py-1 text-left text-xs font-semibold transition duration-200 ${
        selected ? "bg-slate-900 text-white" : "bg-blue-50 text-apex-blue hover:bg-blue-100"
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
      className={`min-h-[140px] rounded-[20px] border p-3 text-left transition duration-200 ${
        selected
          ? "border-slate-900 bg-slate-50"
          : "border-slate-200 bg-white hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${day.getUTCMonth() === currentMonth ? "text-apex-slate" : "text-slate-400"}`}>
          {day.getUTCDate()}
        </span>
        {races.length > 0 ? (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-apex-slate">
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
      <div className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
              Calendar View
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
                timeZone: "UTC"
              }).format(monthDate)}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-apex-muted">
            Events are placed on their date cells using `startDate`, and the selected day reveals
            its full event list.
          </p>
        </div>
        <CalendarGrid
          monthDate={monthDate}
          races={races}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      </div>

      <div className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
          Selected Day
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-apex-slate">{selectedDay}</h3>
        <div className="mt-4 space-y-3">
          {selectedDayRaces.length > 0 ? (
            selectedDayRaces.map((race) => (
              <Link
                key={race.id}
                href={`/races/${race.slug}`}
                className="block rounded-[20px] bg-slate-50 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                <p className="font-semibold text-apex-slate">{race.name}</p>
                <p className="mt-1 text-sm text-apex-muted">
                  {race.championshipName} • {race.trackName} • {race.location}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-apex-muted">No races on the selected day.</p>
          )}
        </div>
      </div>
    </section>
  );
}
