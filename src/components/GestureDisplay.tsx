interface Gesture {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface GestureDisplayProps {
  gesture: Gesture;
  status: string;
  isLarge: boolean;
}

export function GestureDisplay({ gesture, status, isLarge }: GestureDisplayProps) {
  return (
    <div className={`text-center ${isLarge ? "space-y-4" : "space-y-2"}`}>
      <div
        className={`${
          isLarge ? "w-32 h-32" : "w-16 h-16"
        } mx-auto bg-white/10 rounded-2xl p-3 backdrop-blur-sm`}
      >
        <img
          src={gesture.image}
          alt={gesture.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h2 className={`${isLarge ? "text-xl" : "text-sm"} font-bold text-watch-text`}>
          {gesture.name}
        </h2>
        <p className={`${isLarge ? "text-sm" : "text-xs"} text-watch-text/60 mt-1`}>
          {gesture.description}
        </p>
        {status && (
          <p className={`${isLarge ? "text-base" : "text-xs"} font-semibold text-success mt-2`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
