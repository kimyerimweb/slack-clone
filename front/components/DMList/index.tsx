import { useCallback, useState } from "react";
import { IUser } from "../../typings/db";
import useSWR from "swr";

import styles from "../../styles/collapse.module.scss";
import fetcher from "../../utils/fetcher";

export default function DMList({ workspace }) {
  const [collapse, setCollapse] = useState(false);

  const { data: memberData } = useSWR<IUser[]>(
    `http://localhost:3095/api/workspaces/${workspace}/members`,
    fetcher
  );
  const { data } = useSWR<IUser>("http://localhost:3095/api/users", fetcher);

  const handleToggleCollapse = useCallback(() => {
    setCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <h2>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={handleToggleCollapse}
        >
          <i className={collapse ? styles.open : null}>▲</i>
        </button>
        <span>Direct Messages</span>
      </h2>
      {collapse &&
        memberData?.map((member) => (
          <div key={member.id}>
            {data.id === member.id ? member.nickname + "(나)" : member.nickname}
          </div>
        ))}
    </>
  );
}
