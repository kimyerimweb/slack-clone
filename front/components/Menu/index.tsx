import { CSSProperties, ReactChild, useCallback } from "react";
import styles from "./menu.module.scss";

type MenuProp = {
  children: ReactChild;
  style?: CSSProperties;
  handleCloseModal: (e: any) => void;
};

export default function Menu({ children, style, handleCloseModal }: MenuProp) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className={styles.createMenu} onClick={handleCloseModal}>
      <div onClick={stopPropagation} style={style}>
        <button className={styles.closeModalButton} onClick={handleCloseModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
