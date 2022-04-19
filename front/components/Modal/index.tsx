import styles from "./modal.module.scss";
import { ReactChild, useCallback } from "react";

type ModalProp = {
  children?: ReactChild;
  handleCloseModal: (e: any) => void;
};

export default function Modal({ children, handleCloseModal }: ModalProp) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className={styles.createModal} onClick={handleCloseModal}>
      <div onClick={stopPropagation}>
        <button className={styles.closeModalButton} onClick={handleCloseModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
