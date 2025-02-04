import { useContext, useState } from "react";
import InputElement from "../components/InputElement";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    async function signup() {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email: "" }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
        login(data.token);
      } else {
        if ("detail" in data) {
          alert(data.detail);
        }
      }
    }

    signup();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-dark1 bg-opacity-45 flex flex-col gap-28 items-center p-10 rounded-xl w-[600px] border-dark1 border-[1px] "
    >
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
        <button
          type="submit"
          className="bg-red1 hover:bg-red4 active:bg-red1 transition-colors duration-200 w-full p-3 rounded-lg text-light1 text-2xl font-medium"
        >
          Login
        </button>
        <p className="mt-2 text-center text-xl">
          Don't have an account?{" "}
          <Link to={"/auth/signup"} className="text-blue-500 font-medium">
            Signup
          </Link>{" "}
        </p>
      </div>
    </form>
  );
}
