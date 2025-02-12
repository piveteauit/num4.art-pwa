interface StatCardProps {
  title: string;
  value: number;
  currency?: string;
}

export const StatCard = ({ title, value, currency }: StatCardProps) => (
  <div className="bg-white/5 p-4 rounded-lg text-center">
    <h3 className="text-white/60 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-bold">
      {value} {currency}
    </p>
  </div>
);
