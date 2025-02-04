import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";
import { AuthContext } from "../contexts/AuthContext";

export default function NavBar() {
  const { search, setSearch } = useContext(SearchContext);
  const { loading, userToken, logout } = useContext(AuthContext)!;

  return (
    <header className="select-none border-b-[1px] border-dark1 bg-dark4 fixed z-10 top-0 w-full h-20 xl:px-0 px-[30px] flex justify-center text-light1">
      <div className="xl:w-[1200px] w-full flex items-center justify-between">
        <div className="flex items-center gap-20 text-xl font-normal text-opacity-80">
          <Link to={"/"} className="text-4xl font-secular text-blue-400">
            MLBee
          </Link>
          <div className="flex gap-8 text-lg text-light5/80">
            <NavLink setSearch={setSearch} to="/standings">
              Standings
            </NavLink>
            <NavLink setSearch={setSearch} to="/teams">
              Teams
            </NavLink>
            <NavLink setSearch={setSearch} to="/articles">
              Articles
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div
            onClick={() => setSearch(!search)}
            className={`relative bg-dark1 opacity-90 p-[10px] w-12 h-12 rounded-full group hover:cursor-pointer hover:bg-light2 active:bg-light5 transition-colors duration-300 ${
              search && "bg-light3"
            }`}
          >
            <img
              src="/search-light.svg"
              className={`absolute top-[12px] left-[13px] w-6 transition-opacity duration-300 opacity-100 group-hover:opacity-0 ${
                search && "opacity-0"
              }`}
            />
            <img
              src="/search.svg"
              className={`absolute top-[12px] left-[13px] w-6 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                search && "opacity-100"
              }`}
            />
          </div>

          {loading ? (
            <></>
          ) : userToken ? (
            <button
              onClick={logout}
              className="border border-light1 border-opacity-30 px-6 py-3 rounded-lg hover:border-opacity-100 active:bg-light1 active:text-dark5 transition-colors duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to={"/auth/login"}
              className="border border-light1 border-opacity-30 px-6 py-3 rounded-lg hover:border-opacity-100 active:bg-light1 active:text-dark5 transition-colors duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  to,
  setSearch,
  children,
}: {
  to: string;
  setSearch: (search: boolean) => void;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={() => setSearch(false)}
      className={`relative transition-colors font-medium duration-300 group ${
        isActive ? "text-light2 font-semibold" : "hover:text-light3"
      }`}
    >
      {children}
    </Link>
  );
}
