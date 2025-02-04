import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavLayout from "./layouts/NavLayout";
import { Stats } from "./pages/Stats";
import { Roster } from "./pages/Roster";
import ProfileLayout from "./layouts/ProfileLayout";
import ProfileHome from "./pages/ProfileHome";
import ProfileArticles from "./pages/ProfileArticles";
import ProfileSchedule from "./pages/ProfileSchedule";
import AuthProvider from "./contexts/AuthProvider";
import Standings from "./pages/Standings";
import Teams from "./pages/Teams";
import ArticlePage from "./pages/ArticlePage";
import Articles from "./pages/Articles";
import Home from "./pages/Home";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/" element={<AuthLayout />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/" element={<NavLayout />}>
            <Route index element={<Home />} />
            <Route path="articles/:id/" element={<ArticlePage />} />
            <Route path="standings" element={<Standings />} />
            <Route path="teams" element={<Teams />} />
            <Route path="articles" element={<Articles />} />
            <Route path="teams/:id/" element={<ProfileLayout type="teams" />}>
              <Route index element={<ProfileHome />} />
              <Route path="roster" element={<Roster />} />
              <Route path="stats" element={<Stats />} />
              <Route path="schedule" element={<ProfileSchedule />} />
              <Route path="articles" element={<ProfileArticles />} />
            </Route>
            <Route
              path="players/:id"
              element={<ProfileLayout type="players" />}
            >
              <Route index element={<ProfileHome />} />
              <Route path="stats" element={<Stats />} />
              <Route path="articles" element={<ProfileArticles />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
