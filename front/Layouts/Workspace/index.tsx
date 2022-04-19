import styles from "./workspace.module.scss";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Router from "next/router";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import fetcher from "../../utils/fetcher";
import gravatar from "gravatar";
import Link from "next/link";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Menu from "../../components/Menu";
import NewWorkSpaceCreationModal from "../../components/NewWorkSpaceCreationModal";
import { IUser } from "../../typings/db";

export default function Workspace({ children }) {
  const { data } = useSWR<IUser | false>(
    "http://localhost:3095/api/users",
    fetcher
  );

  const [logoutError, setLogoutError] = useState<string>("");
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState<boolean>(false);

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

  const handleToggleProfile = useCallback((e) => {
    e.stopPropagation();
    setShowProfile((prev) => !prev);
  }, []);

  const handleToggleWorkspaceModal = useCallback((e) => {
    e.stopPropagation();
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.rightMenu}>
          <span onClick={handleToggleProfile} className={styles.img}>
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
            {showProfile && (
              <Menu handleCloseModal={handleToggleProfile}>
                <div className={styles.profileModal}>
                  <div>
                    <Image
                      src={gravatar.url(data?.email, {
                        protocol: "http",
                        s: "36",
                        d: "retro",
                      })}
                      alt={data?.nickname}
                      width={36}
                      height={36}
                    />
                    <div>
                      <span id="profile-name">{data?.nickname}</span>
                      <span id="profile-active">Active</span>
                    </div>
                  </div>
                  <button onClick={logout} className={styles.logOutButton}>
                    로그아웃
                  </button>
                </div>
              </Menu>
            )}
          </span>
        </div>
      </header>
      <div className={styles.workspaceWrapper}>
        <div className={styles.workspaces}>
          {data?.Workspaces?.map((ws) => {
            return (
              <Link href={`/workspace/channel`} passHref key={ws.id}>
                <button type="button" className={styles.workspaceButton}>
                  {ws.name.slice(0, 1).toUpperCase()}
                </button>
              </Link>
            );
          })}
          <button
            type="button"
            className={styles.addButton}
            onClick={handleToggleWorkspaceModal}
          >
            +
          </button>
          ;
        </div>
        <nav className={styles.channels}>
          <button className={styles.workspaceName}>Sleact</button>
          <div className={styles.menuScroll}>menuScroll</div>
        </nav>
        <div className={styles.chats}>{children}</div>
      </div>
      <ToastContainer />
      {showWorkspaceModal && (
        <NewWorkSpaceCreationModal
          handleToggleWorkspaceModal={handleToggleWorkspaceModal}
          setShowWorkspaceModal={setShowWorkspaceModal}
          setShowProfile={setShowProfile}
        />
      )}
    </>
  );
}
