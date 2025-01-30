import { useState } from "react";
import InputElement from "../components/InputElement";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-dark1 bg-opacity-45 flex flex-col gap-28 items-center p-10 rounded-xl w-[600px] border-dark1 border-[1px] ">
      <h3 className="text-5xl font-medium">Signup</h3>
      <div className="flex flex-col items-stretch w-full gap-10">
        <InputElement
          placeHolder="Enter username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <InputElement
          placeHolder="Enter email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <InputElement
          placeHolder="Enter password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className="self-stretch">
        <button className="bg-red1 hover:bg-red3 active:bg-red1 w-full p-3 rounded-lg text-light1 text-2xl font-medium">
          Signup
        </button>
        <p className="mt-3 text-center text-xl">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="text-blue-500 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
