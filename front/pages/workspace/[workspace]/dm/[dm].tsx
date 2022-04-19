import Workspace from "../../../../layouts/Workspace";
import styles from "../../../../styles/workspaceChild.module.scss";

export default function DirectMessage() {
  return (
    <Workspace>
      <div className={styles.container}>
        <header className={styles.header}>디엠</header>
      </div>
    </Workspace>
  );
}
