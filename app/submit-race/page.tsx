import { ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { submitFields } from "@/data/site";

export default function SubmitRacePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            Contributor Portal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Submit a verified race entry</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Structured intake for community-driven updates, built to preserve editorial quality and
            data trust across the platform.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-200" />
              <p className="font-semibold">Verified Entry Notice</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Submissions are reviewed against official series schedules, circuit metadata, and
              contributor history before publication.
            </p>
          </div>
        </div>

        <div className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
          <SectionHeading
            eyebrow="Verification Flow"
            title="Race submission form"
            description="Capture event name, date, series, and context in a high-confidence intake workflow."
          />
          <form className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {submitFields.map((field) => (
                <label key={field.label} className="block">
                  <span className="mb-2 block text-sm font-medium text-apex-slate">{field.label}</span>
                  <input
                    className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
                    placeholder={field.hint}
                  />
                </label>
              ))}
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-apex-slate">Description</span>
              <textarea
                rows={6}
                className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
                placeholder="Add context, official notes, and supporting detail."
              />
            </label>
            <div className="flex items-start gap-3 rounded-[18px] bg-blue-50 p-4 text-sm text-apex-slate">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300" />
              <p>
                I confirm this submission is based on official or directly sourced race information
                and may be audited before publishing.
              </p>
            </div>
            <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 sm:w-auto">
              Submit for verification
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
