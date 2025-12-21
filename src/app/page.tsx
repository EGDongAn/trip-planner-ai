import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center gap-12 px-6 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            Plan Your Perfect Trip
            <span className="block text-blue-600 dark:text-blue-400 mt-2">
              with AI
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            Tell us your travel dreams, and our AI will craft personalized itineraries
            with real flights, hotels, and activities tailored just for you.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/plan"
          className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span>Start Planning</span>
          <svg
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              AI-Powered
            </h3>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
              Advanced AI understands your preferences and creates personalized itineraries
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Real-Time Data
            </h3>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
              Live flight and hotel prices, verified availability, and instant booking links
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Interactive Chat
            </h3>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
              Refine your itinerary by chatting with AI to adjust plans on the fly
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
