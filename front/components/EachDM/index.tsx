import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

import { IUser } from "../../typings/db";
import styles from "../EachChannel/eachChannel.module.scss";
import fetcher from "../../utils/fetcher";

export default function EachDM({ memberData }) {
  const router = useRouter();
  const { workspace, dm } = router.query;

  const date = localStorage.getItem(`${workspace}-${memberData.id}`) || 0;
  const { data: userData } = useSWR<IUser>(
    "http://localhost:3095/api/users",
    fetcher
  );
  const { data: count } = useSWR<number>(
    userData
      ? `http://localhost:3095/api/workspaces/${workspace}/dms/${memberData.id}/unreads?after=${date}`
      : null,
    fetcher
  );

  return (
    <Link
      key={memberData.id}
      href={`http://localhost:3000/workspace/${workspace}/dm/${memberData.id}`}
      passHref
    >
      <div
        className={
          memberData.id === Number(dm)
            ? styles.focusContainer
            : styles.container
        }
      >
        {/* <div className={isOnline ? styles.on : styles.off}></div> */}
        <span
          className={count !== undefined && count > 0 ? styles.bold : undefined}
        >
          {memberData.nickname}
        </span>
        {memberData.id === userData?.id && <span> (나)</span>}
        {(count && count > 0 && (
          <span className={styles.count}>{count}</span>
        )) ||
          null}
      </div>
    </Link>
  );
}
