import styles from "./workspace.module.scss";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Router from "next/router";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import fetcher from "../../utils/fetcher";
import gravatar from "gravatar";
import Link from "next/link";
import { useForm } from "react-hook-form";

import Menu from "../../components/Menu";
import Modal from "../../components/Modal";
import authStyles from "../../styles/auth.module.scss";
import { IUser } from "../../typings/db";

export default function Workspace({ children }) {
  const { data } = useSWR<IUser | false>(
    "http://localhost:3095/api/users",
    fetcher
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newWorkspace: "",
      newUrl: "",
    },
  });

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

  const handleToggleProfile = useCallback(() => {
    setShowProfile((prev) => !prev);
  }, []);

  const handleToggleWorkspaceModal = useCallback((e) => {
    e.stopPropagation();
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const handleCreateWorkspace = useCallback((newWorkSpaceData) => {
    console.log(newWorkSpaceData);
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
      {showWorkspaceModal && (
        <Modal handleCloseModal={handleToggleWorkspaceModal}>
          <form onSubmit={handleSubmit(handleCreateWorkspace)}>
            <label htmlFor="workspace-label" className={authStyles.label}>
              <span>워크스페이스 이름</span>
              <input
                className={authStyles.input}
                type="text"
                id="workspace-label"
                {...register("newWorkspace", {
                  required: "필수 응답 항목입니다.",
                })}
              />
              <p className={authStyles.error}>
                {errors.newWorkspace && errors.newWorkspace.message}
              </p>
            </label>
            <label htmlFor="workspace-url-label" className={authStyles.label}>
              <span>워크스페이스 주소</span>
              <input
                className={authStyles.input}
                type="text"
                id="workspace-label"
                {...register("newUrl", {
                  required: "필수 응답 항목입니다.",
                })}
              />
              <p className={authStyles.error}>
                {errors.newUrl && errors.newUrl.message}
              </p>
            </label>
            <button type="submit" className={authStyles.button}>
              생성하기
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
