interface Props {
  lives: number | null;
  gridLocked: boolean;
}

export default function Lives({ lives, gridLocked }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-zinc-400 uppercase mr-1">
        Lives
      </span>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`text-xl ${lives !== null && i <= lives ? "opacity-100" : "opacity-25"}`}
        >
          ❤️
        </span>
      ))}
      {gridLocked && (
        <span className="ml-2 text-xs font-semibold text-red-400 uppercase">
          Grid locked — generate a new one
        </span>
      )}
    </div>
  );
}
