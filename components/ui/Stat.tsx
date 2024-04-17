import { StatProps } from "@/types/stat";

function Stat({ title, value, description }: StatProps) {
  return (
    <div className="stat place-items-center">
      {!title ? null : <div className="stat-title">{title}</div>}

      <div className="stat-value">{value}</div>
      {!description ? null : <div className="stat-desc">{description}</div>}
    </div>
  );
}

export default Stat;
