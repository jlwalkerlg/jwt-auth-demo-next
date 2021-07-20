import Head from "next/head";
import React, { FC, useState } from "react";
import api, { User } from "../api";
import { LoginResponse } from "./api/login";

const HomePage: FC = () => {
  const [error, setError] = useState("");

  const [user, setUser] = useState<User>();

  const onLogin = async () => {
    try {
      setError("");

      const response = await api.post<LoginResponse>("/login", {
        email: "walker.jlg@gmail.com",
      });

      localStorage.setItem("accessToken", response.data.accessToken);
    } catch (e) {
      setError(e.message);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("accessToken");
  };

  const onGetProfile = async () => {
    try {
      setError("");
      setUser(undefined);

      const response = await api.get<User>("/profile");

      setUser(response.data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <main>
        {error && <p>{error}</p>}
        {user && <p>Logged in as {user.email}</p>}

        <div>
          <p>Get Profile</p>

          <button onClick={onGetProfile}>Get Profile</button>
        </div>

        <hr />

        <div>
          <p>Login</p>

          <input type="email" value="walker.jlg@gmail.com" disabled />
          <button onClick={onLogin}>Login</button>
        </div>

        <hr />

        <div>
          <p>Logout</p>

          <button onClick={onLogout}>Logout</button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
