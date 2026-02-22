import { principles } from "@/content/home";
import { Separator } from "@/components/ui/separator";

export function PrinciplesSection() {
  return (
    <section className="rounded-3xl border border-black/10 bg-card/70 p-6 sm:p-8">
      <div className="mb-6 flex items-end justify-between gap-6">
        <h2 className="font-display text-3xl leading-none italic sm:text-4xl">Principles</h2>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">UI FOUNDATION</p>
      </div>
      <div className="space-y-4">
        {principles.map((principle) => (
          <div key={principle} className="space-y-4">
            <p className="text-base text-foreground/85">{principle}</p>
            <Separator className="bg-black/10" />
          </div>
        ))}
      </div>
    </section>
  );
}
