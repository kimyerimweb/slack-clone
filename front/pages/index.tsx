import "../styles/home.module.scss";
import Head from "next/head";
import fetcher from "../utils/fetcher";
import useSWR from "swr";
import { useEffect } from "react";
import Router from "next/router";

function Home() {
  const { data, error } = useSWR("http://localhost:3095/api/users", fetcher);

  useEffect(() => {
    if (!data) {
      Router.replace("/login");
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>안녕?</h1>
    </>
  );
}

export default Home;
