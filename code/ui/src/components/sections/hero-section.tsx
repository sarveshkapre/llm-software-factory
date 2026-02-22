import { projectTagline } from "@/content/home";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="space-y-10">
      <Badge variant="outline" className="rounded-full border-black/20 px-4 py-1 text-[11px] tracking-[0.18em] uppercase">
        LLM SOFTWARE FACTORY
      </Badge>
      <div className="max-w-4xl space-y-6">
        <h1 className="text-balance text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Build calm,
          <span className="font-display italic text-foreground/80"> intentional </span>
          AI products.
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {projectTagline}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="rounded-full px-6">Start a Workflow</Button>
        <Button variant="outline" className="rounded-full border-black/20 px-6">
          View System Notes
        </Button>
      </div>
    </section>
  );
}
