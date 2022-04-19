import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Router from "next/router";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import fetcher from "../utils/fetcher";
import gravatar from "gravatar";

function Workspace({ children }) {
  const { data } = useSWR("http://localhost:3095/api/users", fetcher);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    if (!data) {
      Router.replace("/login");
    }
  }, [data]);

  const logout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate("http://localhost:3095/api/users");
        Router.replace("/login");
      })
      .catch((error) => {
        setLogoutError(error.response.data);
      });
  }, []);

  return (
    <>
      <header>
        <div>
          <Image
            src={gravatar.url(data?.email, {
              protocol: "http",
              s: "28",
              d: "retro",
            })}
            alt={data?.nickname}
            width={28}
            height={28}
          ></Image>
        </div>
      </header>
      <button onClick={logout}>로그아웃</button>
      {children}
    </>
  );
}

export default Workspace;
