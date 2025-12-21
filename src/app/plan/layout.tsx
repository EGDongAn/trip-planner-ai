export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Trip Planner
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Let AI help you plan your perfect journey
          </p>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
