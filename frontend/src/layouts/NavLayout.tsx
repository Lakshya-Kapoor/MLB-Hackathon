import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState } from "react";

export default function NavLayout() {
  const [search, setSearch] = useState(false);

  return (
    <div className="min-h-screen h-[200vh] bg-dark5 pt-20">
      <NavBar search={search} setSearch={setSearch} />
      <Outlet />
    </div>
  );
}
