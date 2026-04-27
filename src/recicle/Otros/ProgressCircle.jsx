import { useEffect, useState, useRef } from "react";

const DEFAULT_COLORS = [
  { color: "#E0F7FA", stop: 0 },
  { color: "#4CAF50", stop: 20 },
  { color: "#FFEB3B", stop: 40 },
  { color: "#7B1FA2", stop: 65 },
  { color: "#D32F2F", stop: 100 },
];

const ProgressCircle = ({
  percentage,
  size = 240,
  colors = DEFAULT_COLORS,
  onEditChange,
}) => {
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const circleRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setProgress(percentage);
  }, [percentage, isEditing]);

  const handleMouseDown = (e) => {
    if (onEditChange) {
      setIsEditing(true);
      e.preventDefault();
      handleMouseMove(e);
    }
  };

  const handleMouseMove = (e) => {
    if (!isEditing || !circleRef.current) return;
    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let newPercentage = ((angle * 180) / Math.PI + 90) / 3.6;
    if (newPercentage < 0) newPercentage += 100;
    const finalPercentage = Math.min(100, Math.max(0, Math.round(newPercentage)));
    setProgress(finalPercentage);
    onEditChange(finalPercentage);
  };

  const handleMouseUp = () => setIsEditing(false);

  useEffect(() => {
    if (isEditing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isEditing]);

  const rotationAngle = (progress / 100) * 360;
  const gradientStops = colors.map((c) => `${c.color} ${c.stop}%`).join(", ");

  return (
    <div
      ref={circleRef}
      className="relative flex justify-center items-center"
      style={{ width: size, height: size }}
    >
      {/* 1. Capa de Fondo y Progreso (Base) */}
      <div className="absolute inset-[1px] rounded-full" style={{ background: `conic-gradient(${gradientStops})` }} />
      <div className="absolute inset-0  shadow-inner border border-gray-100 rounded-full"
        style={{ background: `conic-gradient(transparent 0% ${progress}%, white ${progress}% 100%)` }} />

      {/* 2. Círculo interior con INPUT (z-10) */}
      <div
        className="absolute bg-white z-10 rounded-full flex items-center justify-center shadow-md"
        style={{ width: size - 50, height: size - 50 }}
      >
        <div className="flex items-center">
          <input
            type="text"
            value={progress}
            onChange={(e) => {
              const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
              setProgress(val);
              onEditChange(val);
            }}
            className="w-16 text-3xl font-bold text-center bg-transparent focus:outline-none text-sky-900"
          />
          <span className="text-xl font-bold -ml-2 text-sky-600">%</span>
        </div>
      </div>

      {/* 3. Capa del Puntero (z-20 para estar encima del input) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      >
        <div
          className="absolute rounded-full flex justify-center items-center border p-1 border-gray-400 bg-white shadow-lg pointer-events-auto transition-transform hover:scale-110"
          style={{
            width: 40,
            height: 40,
            left: "50%",
            top: 15,
            transform: "translate(-50%, -50%)",
            cursor: isEditing ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="bg-gradient-to-br from-sky-600 to-teal-300 rounded-full w-[80%] h-[80%]"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;