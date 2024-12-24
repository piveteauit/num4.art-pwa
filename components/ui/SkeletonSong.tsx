export default function SkeletonSong() {
  return (
    <div className="flex w-full gap-8 animate-pulse">
      <div className="w-[52px] h-[52px] bg-white/10 rounded-sm"></div>
      <div className="flex flex-col items-start gap-2">
        <div className="h-6 w-32 bg-white/10 rounded"></div>
        <div className="h-4 w-24 bg-white/10 rounded"></div>
      </div>
    </div>
  );
}
