import { Dispatch, SetStateAction, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Modal from "../../components/Modal";
import authStyles from "../../styles/auth.module.scss";

type NewChannelCreationModalProp = {
  handleToggleChannelCreationModal: (e: any) => void;
  setShowChannelCreationModal: Dispatch<SetStateAction<boolean>>;
  setShowWorkspaceModal: Dispatch<SetStateAction<boolean>>;
};

export default function NewChannelCreationModal({
  handleToggleChannelCreationModal,
  setShowChannelCreationModal,
  setShowWorkspaceModal,
}: NewChannelCreationModalProp) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();
  const { workspace } = router.query;

  const handleCreateChannel = useCallback(
    (newChannelData) => {
      const { name } = newChannelData;

      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          {
            name,
          },
          { withCredentials: true }
        )
        .then(() => {
          mutate(`http://localhost:3095/api/workspaces/${workspace}/channels`);
          setShowWorkspaceModal(false);
          setShowChannelCreationModal(false);
          reset({
            name: "",
          });
        })
        .catch((error) => {
          toast(`${error.response.data}`, {
            position: "top-right",
            autoClose: 5000,
          });
        });
    },
    [reset, setShowWorkspaceModal, setShowChannelCreationModal, workspace]
  );

  return (
    <Modal handleCloseModal={handleToggleChannelCreationModal}>
      <form onSubmit={handleSubmit(handleCreateChannel)}>
        <label htmlFor="workspace-label" className={authStyles.label}>
          <span>채널 이름</span>
          <input
            className={authStyles.input}
            type="text"
            id="workspace-label"
            {...register("name", {
              required: "필수 응답 항목입니다.",
            })}
          />
          <p className={authStyles.error}>
            {errors.name && errors.name.message}
          </p>
        </label>
        <button type="submit" className={authStyles.button}>
          생성하기
        </button>
      </form>
    </Modal>
  );
}
