import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState } from "react";
import Search from "../components/Search";

export default function NavLayout() {
  const [search, setSearch] = useState(false);

  return (
    <div className="min-h-screen bg-dark5 pt-20">
      <NavBar search={search} setSearch={setSearch} />
      <div className={`${search ? "hidden" : ""}`}>
        <Outlet />
      </div>
      <div className="flex justify-center px-[30px]">
        {search && <Search />}
      </div>
    </div>
  );
}
