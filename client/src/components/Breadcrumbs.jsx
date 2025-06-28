import { useLocation, Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { GoChevronRight } from "react-icons/go";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1  py-1 rounded-full text-gray-500 text-sm px-1 ">
      <Link to="/">
        <IoHomeOutline className="text-lg mr-1" />
      </Link>
      <span className="text-xs">
        <GoChevronRight />
      </span>
      {pathnames.length === 0 ? (
        <span className="text-black font-medium">Home</span>
      ) : (
        <>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <span key={index} className="flex items-center gap-1">
                 {!index === 0 ? (
                  <>
                    <Link to={routeTo} className="hover:underline capitalize">
                     {decodeURIComponent(name)}
                    </Link>
                  </>
                ) : (
                  <span className={` capitalize ${isLast?"font-semibold text-black":"hover:underline"}`}>
  {decodeURIComponent(name).split("-").filter(word => /^[A-Za-z]+$/.test(word)).join(" ")}

                    
                  </span>
                )}
                {!isLast && <span className="text-xs">›</span>}
              </span>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Breadcrumbs;
