import { Dispatch, SetStateAction, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Modal from "../Modal";
import authStyles from "../../styles/auth.module.scss";

type InviteChannelModalProp = {
  handleToggleInviteChannelModal: (e: any) => void;
  setShowInviteChannelModal: Dispatch<SetStateAction<boolean>>;
};

export default function InviteChannelModal({
  handleToggleInviteChannelModal,
  setShowInviteChannelModal,
}: InviteChannelModalProp) {
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
  const { workspace, channel } = router.query;

  const handleInviteChannelModal = useCallback(
    (newChannelData) => {
      const { email } = newChannelData;

      axios
        .post(
          `http://localhost:3095/api/workspace/${workspace}/channels/${channel}/members`,
          {
            email,
          },
          { withCredentials: true }
        )
        .then(() => {
          mutate(
            `http://localhost:3095/api/workspace/${workspace}/channels/${channel}/members`
          );
          setShowInviteChannelModal(false);
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
    [reset, setShowInviteChannelModal, channel, workspace]
  );

  return (
    <Modal handleCloseModal={handleToggleInviteChannelModal}>
      <form onSubmit={handleSubmit(handleInviteChannelModal)}>
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
