import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavLayout from "./layouts/NavLayout";
import Articles from "./pages/Articles";
import Polls from "./pages/Polls";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Team from "./pages/Team";
import Player from "./pages/Player";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/" element={<AuthLayout />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/" element={<NavLayout />}>
          <Route path="articles" element={<Articles />} />
          <Route path="polls" element={<Polls />} />
          <Route path="teams" element={<Teams />} />
          <Route path="players" element={<Players />} />
          <Route path="teams/:id" element={<Team />} />
          <Route path="players/:id" element={<Player />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
