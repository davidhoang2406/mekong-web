interface Props {
  value: string
  onChange: (value: string) => void
  max?: string
  label?: string
}

/** Single-date picker used by the digest page. */
export function DateRangePicker({ value, onChange, max, label = 'Date' }: Props) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400">
      {label}
      <input
        type="date"
        value={value}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200"
      />
    </label>
  )
}
