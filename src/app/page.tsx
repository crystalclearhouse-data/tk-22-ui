export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-xl w-full px-6 py-12 border border-zinc-800 rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">
          TK-22 Control Surface
        </h1>

        <p className="text-zinc-400 mb-8">
          This interface exists to issue execution intent and receive closure.
        </p>

        <div className="space-y-4">
          <button
            className="w-full py-3 rounded bg-white text-black font-medium hover:bg-zinc-200 transition"
          >
            Execute Scan
          </button>

          <button
            className="w-full py-3 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-900 transition"
          >
            View Closure
          </button>
        </div>
      </div>
    </main>
  );
}
