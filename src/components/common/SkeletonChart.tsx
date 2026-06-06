export function SkeletonChart({ height = 380 }: { height?: number }) {
  return (
    <div className="animate-pulse rounded-md bg-bg-muted" style={{ height }} />
  )
}
