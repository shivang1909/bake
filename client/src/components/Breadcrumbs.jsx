import { useLocation, Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { GoChevronRight } from "react-icons/go";
import Search from "./Search";

import React from "react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1  py-1 rounded-full text-gray-500 text-sm px-4 ">
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
                      {decodeURIComponent(name).split("-")[0]}
                    
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
