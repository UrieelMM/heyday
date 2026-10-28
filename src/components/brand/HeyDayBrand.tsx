export function HeyDayBrand({
  compact = false,
  light = false,
}: {
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <span className={`heyday-brand${light ? ' heyday-brand--light' : ''}`} aria-label="HeyDay">
      <img src="/heyday-mark.svg" alt="" width="36" height="36" />
      {!compact && (
        <span className="heyday-brand__word" aria-hidden="true">
          Hey<em>Day</em><span className="heyday-brand__spark">✦</span>
        </span>
      )}
    </span>
  );
}
