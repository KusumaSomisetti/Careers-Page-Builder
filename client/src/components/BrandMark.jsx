function BrandMark() {
  return (
    <div className="relative h-11 w-11 text-slate-500">
      <div className="absolute inset-x-0 left-0 top-1 h-8 w-8 rounded-[10px] border-[3px] border-current" />
      <div className="absolute bottom-0 right-0 h-8 w-8 rounded-[10px] border-[3px] border-current bg-white/70" />
    </div>
  );
}

export default BrandMark;
