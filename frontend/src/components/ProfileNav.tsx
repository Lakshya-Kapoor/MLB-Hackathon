import { useContext } from "react";
import SubNavButton from "./SubNavButton";
import { ProfileContext } from "../contexts/ProfileContext";

export default function ProfileNav() {
  const profileType = useContext(ProfileContext);

  if (profileType == "players") {
    return (
      <nav className="-mb-px flex space-x-8">
        <SubNavButton name="Home" />
        <SubNavButton name="Stats" />
        <SubNavButton name="Schedule" />
        <SubNavButton name="Articles" />
        <SubNavButton name="Polls" />
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
      <SubNavButton name="Polls" />
    </nav>
  );
}
