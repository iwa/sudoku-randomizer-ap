interface Props {
  checked: number;
  total: number;
}

export default function APLocationProgress({ checked, total }: Props) {
  if (total === 0) return null;

  const percentage = Math.round((checked / total) * 100);

  return (
    <div className="rounded border border-zinc-600 bg-zinc-700 px-3 py-2 mt-3">
      <h3 className="text-xs font-semibold text-zinc-400 uppercase mb-1">
        Location Progress
      </h3>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-zinc-200 whitespace-nowrap">
          {checked} / {total}
        </span>
      </div>
    </div>
  );
}
