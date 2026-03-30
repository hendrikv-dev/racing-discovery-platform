import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmptyState } from "@/components/states";
import { MyTrackingNav } from "@/components/tracking/my-tracking-nav";
import { SectionHeading } from "@/components/ui";
import { getMyTracking } from "@/lib/discovery";

export default async function MyTrackedChampionshipsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-tracking/championships");
  }

  const data = await getMyTracking(session.user.id);

  if (!data) {
    redirect("/login?callbackUrl=/my-tracking/championships");
  }

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <MyTrackingNav pathname="/my-tracking/championships" />
      </section>
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Followed Championships"
          title="Saved title fights"
          description="All championships followed by the authenticated user."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.championships.length > 0 ? (
            data.championships.map((championship) => (
              <Link
                key={championship.id}
                href={`/championships/${championship.slug}`}
                className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                  {championship.category}
                </p>
                <h2 className="mt-2 text-xl font-bold text-apex-slate">{championship.name}</h2>
                <p className="mt-3 text-sm text-apex-muted">{championship.description}</p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState title="No followed championships yet" description="Follow a championship to start building your series watchlist." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
