import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState } from "react";
import Search from "../components/Search";
import { SearchContext } from "../contexts/SearchContext";

export default function NavLayout() {
  const [search, setSearch] = useState(false);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <div className="min-h-screen bg-dark5 py-20 flex flex-col items-center">
        <NavBar />
        <div className="xl:w-[1200px] w-full pt-10 xl:px-0 px-[30px]">
          <div className={`${search ? "hidden" : "block"}`}>
            <Outlet />
          </div>
          <div className={`${search ? "block" : "hidden"}`}>
            <Search />
          </div>
        </div>
      </div>
    </SearchContext.Provider>
  );
}
