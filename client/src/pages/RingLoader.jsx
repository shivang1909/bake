const RingLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-dashed border-orange-500 rounded-full animate-spin" />
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold">
          <span className="text-xs">LOADING</span>
        </div>
      </div>
    </div>
  );
};
export default RingLoader;