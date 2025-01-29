import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavLayout from "./layouts/NavLayout";
import Articles from "./pages/Articles";
import Polls from "./pages/Polls";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import TeamLayout from "./layouts/TeamLayout";
import Player from "./pages/Player";
import {
  TeamRoster,
  TeamArticles,
  TeamHome,
  TeamPolls,
  TeamSchedule,
  TeamStats,
} from "./pages/TeamPages";

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
          <Route path="teams/:id/" element={<TeamLayout />}>
            <Route index element={<TeamHome />} />
            <Route path="roster" element={<TeamRoster />} />
            <Route path="stats" element={<TeamStats />} />
            <Route path="schedule" element={<TeamSchedule />} />
            <Route path="articles" element={<TeamArticles />} />
            <Route path="polls" element={<TeamPolls />} />
          </Route>
          <Route path="players/:id" element={<Player />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
