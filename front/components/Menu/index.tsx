import { CSSProperties, FC, ReactChild, useCallback } from "react";
import styles from "./menu.module.scss";

type MenuProp = {
  children: string | FC | ReactChild;
  show?: boolean;
  handleCloseModal: () => void;
};

export default function Menu({ children, show, handleCloseModal }: MenuProp) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className={styles.createMenu} onClick={handleCloseModal}>
      <div onClick={stopPropagation}>
        <button className={styles.closeModalButton} onClick={handleCloseModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
