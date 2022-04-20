import styles from "./workspace.module.scss";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
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
import NewChannelCreationModal from "../../components/NewChannelCreationModal";
import InviteWorkspaceModal from "../../components/InviteWorkspaceModal";
import InviteChannelModal from "../../components/InviteChannelModal";
import ChannelList from "../../components/ChannelList";
import DMList from "../../components/DMList";

export default function Workspace({ children }) {
  const router = useRouter();
  const { workspace } = router.query;

  const { data } = useSWR<IUser>("http://localhost:3095/api/users", fetcher);

  const [logoutError, setLogoutError] = useState<string>("");
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showWorkspaceCreationModal, setShowWorkspaceCreationModal] =
    useState<boolean>(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState<boolean>(false);
  const [showChannelCreationModal, setShowChannelCreationModal] =
    useState<boolean>(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] =
    useState<boolean>(false);
  const [showInviteChannelModal, setShowInviteChannelModal] =
    useState<boolean>(false);

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

  const handleToggleWorkspaceCreationModal = useCallback((e) => {
    e.stopPropagation();
    setShowWorkspaceCreationModal((prev) => !prev);
  }, []);

  const handleToggleWorkspaceModal = useCallback((e) => {
    e.stopPropagation();
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const handleToggleChannelCreationModal = useCallback((e) => {
    e.stopPropagation();
    setShowChannelCreationModal((prev) => !prev);
  }, []);

  const handleToggleInviteWorkspaceModal = useCallback((e) => {
    e.stopPropagation();
    setShowInviteWorkspaceModal((prev) => !prev);
  }, []);

  const handleToggleInviteChannelModal = useCallback((e) => {
    e.stopPropagation();
    setShowInviteChannelModal((prev) => !prev);
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
              <Link
                href={`/workspace/${ws.url}/channel/일반`}
                passHref
                key={ws.id}
              >
                <button type="button" className={styles.workspaceButton}>
                  {ws.name.slice(0, 1).toUpperCase()}
                </button>
              </Link>
            );
          })}
          <button
            type="button"
            className={styles.addButton}
            onClick={handleToggleWorkspaceCreationModal}
          >
            +
          </button>
          ;
        </div>
        <nav className={styles.channels}>
          <button
            className={styles.workspaceName}
            onClick={handleToggleWorkspaceModal}
          >
            Sleact
          </button>
          <div className={styles.menuScroll}>
            {showWorkspaceModal && (
              <Menu
                handleCloseModal={handleToggleWorkspaceModal}
                style={{ top: "110px", left: "70px", width: "150px" }}
              >
                <div className={styles.workspaceModal}>
                  <h2>Sleact</h2>
                  <button onClick={handleToggleInviteWorkspaceModal}>
                    워크 스페이스에 초대 하기
                  </button>
                  <button onClick={handleToggleInviteChannelModal}>
                    채널에 초대 하기
                  </button>
                  <button onClick={handleToggleChannelCreationModal}>
                    채널 만들기
                  </button>
                  <button onClick={logout} className={styles.logOutButton}>
                    로그아웃
                  </button>
                </div>
              </Menu>
            )}
            <ChannelList workspace={workspace} />
            <DMList workspace={workspace} />
          </div>
        </nav>
        <div className={styles.chats}>{children}</div>
      </div>
      <ToastContainer />
      {showWorkspaceCreationModal && (
        <NewWorkSpaceCreationModal
          handleToggleWorkspaceModal={handleToggleWorkspaceCreationModal}
          setShowWorkspaceModal={setShowWorkspaceCreationModal}
          setShowProfile={setShowProfile}
        />
      )}
      {showChannelCreationModal && (
        <NewChannelCreationModal
          handleToggleChannelCreationModal={handleToggleChannelCreationModal}
          setShowChannelCreationModal={setShowChannelCreationModal}
          setShowWorkspaceModal={setShowWorkspaceModal}
        />
      )}
      {showInviteWorkspaceModal && (
        <InviteWorkspaceModal
          handleToggleInviteWorkspaceModal={handleToggleInviteWorkspaceModal}
          setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
        />
      )}
      {showInviteChannelModal && (
        <InviteChannelModal
          handleToggleInviteChannelModal={handleToggleInviteChannelModal}
          setShowInviteChannelModal={setShowInviteChannelModal}
        />
      )}
    </>
  );
}
