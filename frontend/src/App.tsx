import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavLayout from "./layouts/NavLayout";
import Articles from "./pages/Articles";
import Polls from "./pages/Polls";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import { Stats } from "./pages/Stats";
import { Roster } from "./pages/Roster";
import ProfileLayout from "./layouts/ProfileLayout";
import ProfileHome from "./pages/ProfileHome";
import ProfileArticles from "./pages/ProfileArticles";
import ProfilePolls from "./pages/ProfilePolls";
import ProfileSchedule from "./pages/ProfileSchedule";

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
          <Route path="teams/:id/" element={<ProfileLayout type="teams" />}>
            <Route index element={<ProfileHome />} />
            <Route path="roster" element={<Roster />} />
            <Route path="stats" element={<Stats />} />
            <Route path="schedule" element={<ProfileSchedule />} />
            <Route path="articles" element={<ProfileArticles />} />
            <Route path="polls" element={<ProfilePolls />} />
          </Route>
          <Route path="players/:id" element={<ProfileLayout type="players" />}>
            <Route index element={<ProfileHome />} />
            <Route path="stats" element={<Stats />} />
            <Route path="articles" element={<ProfileArticles />} />
            <Route path="polls" element={<ProfilePolls />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
