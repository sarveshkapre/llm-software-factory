import { modules } from "@/content/home";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ModuleGridSection() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {modules.map((module, index) => (
        <Card
          key={module.title}
          className="bg-card/75 border-black/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: `${120 + index * 90}ms` }}
        >
          <CardHeader className="space-y-5">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">{module.metric}</p>
            <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              {module.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
