import { useCallback, useState } from "react";
import useSWR from "swr";

import styles from "../../styles/collapse.module.scss";
import { IChannel } from "../../typings/db";
import fetcher from "../../utils/fetcher";

export default function ChannelList({ workspace }) {
  const [collapse, setCollapse] = useState(false);

  const { data: channelData } = useSWR<IChannel[]>(
    `http://localhost:3095/api/workspaces/${workspace}/channels`,
    fetcher
  );

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
        <span>Channels</span>
      </h2>
      {collapse && channelData?.map((ch) => <div key={ch.id}>{ch.name}</div>)}
    </>
  );
}
