import { Atmosphere } from "@/components/layout/atmosphere";
import { PromptStudio } from "@/components/factory/prompt-studio";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Atmosphere />
      <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <PromptStudio />
      </main>
    </div>
  );
}
