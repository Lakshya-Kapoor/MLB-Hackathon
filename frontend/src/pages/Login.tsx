import { useState } from "react";
import InputElement from "../components/InputElement";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-dark1 bg-opacity-45 flex flex-col gap-28 items-center p-10 rounded-xl w-[600px] border-dark1 border-[1px] ">
      <h3 className="text-5xl font-medium">Login</h3>
      <div className="flex flex-col items-stretch w-full gap-10">
        <InputElement
          placeHolder="Enter username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
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
          Login
        </button>
        <p className="mt-2 text-center text-xl">
          Don't have an account?{" "}
          <Link to={"/auth/signup"} className="text-blue-500 font-medium">
            Signup
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}
