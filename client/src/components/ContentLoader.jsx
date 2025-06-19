const ContentLoader = () => {
  return (
    <div className="h-[85vh] flex flex-col items-center justify-center bg-white">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500 mb-4" />


      {/* Text */}
      <p className="text-gray-700 font-semibold text-lg">
        Loading, please wait...
      </p>
    </div>
  );
};
export default ContentLoader;
