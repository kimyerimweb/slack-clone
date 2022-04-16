import "../styles/home.module.scss";
import Head from "next/head";
import fetcher from "../utils/fetcher";
import useSWR from "swr";
import { useEffect } from "react";
import Router from "next/router";

function Home() {
  const { data } = useSWR("http://localhost:3095/api/users", fetcher);
  useEffect(() => {
    data ? Router.replace("/workspace/channel") : Router.replace("/login");
  }, [data]);

  return (
    <>
      <Head>
        <title>Sleact</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}

export default Home;
