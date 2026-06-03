import { Button } from './button'

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly T[]
  active: T
  onChange: (tab: T) => void
}) {
  return (
    <div className="flex gap-1">
      {tabs.map((t) => (
        <Button key={t} active={t === active} onClick={() => onChange(t)}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </Button>
      ))}
    </div>
  )
}
