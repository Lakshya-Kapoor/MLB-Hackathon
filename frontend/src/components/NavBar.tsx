import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";

export default function NavBar() {
  const [notification, setNotification] = useState(false);
  const { search, setSearch } = useContext(SearchContext);

  return (
    <header className="select-none border-b-[1px] border-dark1 bg-dark4 fixed top-0 w-full h-20 xl:px-0 px-[30px] flex justify-center text-light1">
      <div className="xl:w-[1200px] w-full flex items-center justify-between">
        <div className="flex items-center gap-16 text-xl font-normal text-light1 text-opacity-80">
          <h1>MLB</h1>
          <NavLink setSearch={setSearch} to="/teams">
            Teams
          </NavLink>
          <NavLink setSearch={setSearch} to="/players">
            Players
          </NavLink>
          <NavLink setSearch={setSearch} to="/articles">
            Articles
          </NavLink>
          <NavLink setSearch={setSearch} to="/polls">
            Polls
          </NavLink>
        </div>
        <div className="flex items-center gap-8">
          {/* Search icon */}
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

          {/* Notification icon */}
          <div
            onClick={() => setNotification(!notification)}
            className={`relative opacity-90 p-[10px] w-12 h-12 rounded-full hover:cursor-pointer hover:bg-dark1`}
          >
            <img
              src="/bell.svg"
              className={`absolute top-[10px] left-[13px] w-[22px] ${
                notification ? "hidden" : "block"
              }`}
            />
            <img
              src="/bell-active.svg"
              className={`absolute top-[10px] left-[13px] w-[22px] ${
                notification ? "block" : "hidden"
              }`}
            />
          </div>
          <Link
            to={"/auth/login"}
            className="border border-light1 border-opacity-30 px-6 py-3 rounded-lg hover:border-opacity-100 active:bg-light1 active:text-dark5 transition-colors duration-300"
          >
            Login
          </Link>
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
      className={`relative transition-colors duration-300 group ${
        isActive && "text-light1 font-semibold"
      }`}
    >
      {children}
      <span className="absolute top-[52px] left-0 h-[1px] w-0 bg-light1 transition-all duration-[400ms] ease-out group-hover:w-full" />
    </Link>
  );
}
