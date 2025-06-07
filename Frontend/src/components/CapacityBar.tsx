interface Props {
  used: number;
  max: number;
}

export default function CapacityBar({ used, max }: Props) {
  const percentage = Math.min((used / max) * 100, 100);
  return (
    <div className="w-full bg-gray-200 rounded-lg h-4">
      <div
        className={`h-4 rounded-lg ${percentage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
