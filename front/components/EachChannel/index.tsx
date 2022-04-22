import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";

import { IUser } from "../../typings/db";
import fetcher from "../../utils/fetcher";
import styles from "./eachChannel.module.scss";

export default function EachChannel({ channelData }) {
  const router = useRouter();
  const { workspace, channel } = router.query;

  const { data: userData } = useSWR<IUser>("/api/users", fetcher);
  const date = localStorage.getItem(`${workspace}-${channelData.name}`) || 0;
  const { data: count } = useSWR<number>(
    userData
      ? `http://localhost:3095/api/workspaces/${workspace}/channels/${channelData.name}/unreads?after=${date}`
      : null,
    fetcher
  );

  return (
    <Link
      key={channelData.name}
      href={`http://localhost:3000/workspace/${workspace}/channel/${channelData.name}`}
      passHref
    >
      <div
        className={
          channelData.name === channel
            ? styles.focusContainer
            : styles.container
        }
      >
        <span
          className={count !== undefined && count > 0 ? styles.bold : undefined}
        >
          # {channelData.name}
        </span>
        {count !== undefined && count > 0 && (
          <span className={styles.count}>{count}</span>
        )}
      </div>
    </Link>
  );
}
