import { Dispatch, SetStateAction, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Modal from "../Modal";
import authStyles from "../../styles/auth.module.scss";

type InviteWorkspaceModalProp = {
  handleToggleInviteWorkspaceModal: (e: any) => void;
  setShowInviteWorkspaceModal: Dispatch<SetStateAction<boolean>>;
};

export default function InviteWorkspaceModal({
  handleToggleInviteWorkspaceModal,
  setShowInviteWorkspaceModal,
}: InviteWorkspaceModalProp) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();
  const { workspace } = router.query;

  const handleInviteWorkspaceModal = useCallback(
    (newChannelData) => {
      const { email } = newChannelData;

      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/members`,
          {
            email,
          },
          { withCredentials: true }
        )
        .then(() => {
          mutate(`http://localhost:3095/api/workspaces/${workspace}/members`);
          setShowInviteWorkspaceModal(false);
          reset({
            email: "",
          });
        })
        .catch((error) => {
          toast(`${error.response.data}`, {
            position: "top-right",
            autoClose: 5000,
          });
        });
    },
    [reset, setShowInviteWorkspaceModal, workspace]
  );

  return (
    <Modal handleCloseModal={handleToggleInviteWorkspaceModal}>
      <form onSubmit={handleSubmit(handleInviteWorkspaceModal)}>
        <label htmlFor="user-label" className={authStyles.label}>
          <span>유저 이메일</span>
          <input
            className={authStyles.input}
            type="email"
            id="user-label"
            {...register("email", {
              required: "필수 응답 항목입니다.",
            })}
          />
          <p className={authStyles.error}>
            {errors.email && errors.email.message}
          </p>
        </label>
        <button type="submit" className={authStyles.button}>
          초대하기
        </button>
      </form>
    </Modal>
  );
}
