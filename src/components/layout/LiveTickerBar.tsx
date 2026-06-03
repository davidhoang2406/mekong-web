// Phase 3 placeholder. The live ticker needs the WebSocket server (mekong-ws);
// until then this renders a static, non-live bar. Wire it to the Zustand
// tickerStore + /ws subscription in Phase 3.
export function LiveTickerBar() {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/40 px-4 py-1.5 text-xs text-zinc-500">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-600" />
      Live ticker — available in Phase 3 (WebSocket)
    </div>
  )
}
