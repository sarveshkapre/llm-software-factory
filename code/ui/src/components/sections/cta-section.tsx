import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="rounded-3xl border border-black/10 bg-[linear-gradient(120deg,oklch(0.99_0.01_92)_0%,oklch(0.97_0.01_80)_55%,oklch(0.96_0.02_220)_100%)] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">NEXT STEP</p>
          <p className="text-xl leading-snug text-foreground sm:text-2xl">
            Ship your first modular workflow in under a day.
          </p>
        </div>
        <Button className="w-full rounded-full px-6 sm:w-auto">Create Starter Spec</Button>
      </div>
    </section>
  );
}
