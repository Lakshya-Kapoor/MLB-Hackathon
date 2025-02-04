import { useContext } from "react";
import SubNavButton from "./SubNavButton";
import { ProfileContext } from "../contexts/ProfileContext";

export default function ProfileNav() {
  const { type } = useContext(ProfileContext)!;

  if (type == "players") {
    return (
      <nav className="-mb-px flex space-x-8">
        <SubNavButton name="Home" />
        <SubNavButton name="Stats" />
        <SubNavButton name="Articles" />
      </nav>
    );
  }
  return (
    <nav className="-mb-px flex space-x-8">
      <SubNavButton name="Home" />
      <SubNavButton name="Roster" />
      <SubNavButton name="Stats" />
      <SubNavButton name="Schedule" />
      <SubNavButton name="Articles" />
    </nav>
  );
}
