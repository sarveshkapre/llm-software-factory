export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.95_0.03_92)_0%,transparent_68%)]" />
      <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.9_0.02_200)_0%,transparent_72%)]" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
    </div>
  );
}
