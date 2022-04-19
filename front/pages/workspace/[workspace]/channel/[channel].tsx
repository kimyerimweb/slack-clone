import Link from "next/link";
import Workspace from "../../../../layouts/Workspace";
import styles from "../../../../styles/workspaceChild.module.scss";

export default function Channel() {
  return (
    <Workspace>
      <div className={styles.container}>
        <header className={styles.header}>채널</header>
      </div>
    </Workspace>
  );
}
