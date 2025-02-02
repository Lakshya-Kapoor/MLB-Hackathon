interface StatItemProps {
  label: string;
  value: string | number;
}

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className=" border border-dark1 hover:bg-dark1/30 transition-colors duration-200 p-3 rounded-lg group">
      <div className="text-sm font-medium text-light5">{label}</div>
      <div className="text-lg font-semibold text-light1">{value}</div>
    </div>
  );
}
