interface ProgressRingProps {
  progress: number;
}

export function ProgressRing({ progress }: ProgressRingProps) {
  const stroke = 12;
  const radius = 50; // Use percentage-based radius
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full -rotate-90"
    >
      {/* Background circle */}
      <circle
        stroke="rgba(255, 255, 255, 0.1)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx="50"
        cy="50"
      />
      {/* Progress circle */}
      <circle
        stroke="hsl(var(--progress-ring))"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease" }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx="50"
        cy="50"
      />
    </svg>
  );
}
