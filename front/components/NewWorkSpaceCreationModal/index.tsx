import { Dispatch, SetStateAction, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";
import { toast } from "react-toastify";

import Modal from "../../components/Modal";
import authStyles from "../../styles/auth.module.scss";

type NewWorkSpaceCreationModalProp = {
  handleToggleWorkspaceModal: (e: any) => void;
  setShowWorkspaceModal: Dispatch<SetStateAction<boolean>>;
  setShowProfile: Dispatch<SetStateAction<boolean>>;
};

export default function NewWorkSpaceCreationModal({
  handleToggleWorkspaceModal,
  setShowWorkspaceModal,
  setShowProfile,
}: NewWorkSpaceCreationModalProp) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      newWorkspace: "",
      newUrl: "",
    },
  });

  const handleCreateWorkspace = useCallback(
    (newWorkSpaceData) => {
      const { newWorkspace, newUrl } = newWorkSpaceData;

      axios
        .post(
          "http://localhost:3095/api/workspaces",
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          { withCredentials: true }
        )
        .then(() => {
          mutate("http://localhost:3095/api/users");
          setShowWorkspaceModal(false);
          setShowProfile(false);
          reset({
            newWorkspace: "",
            newUrl: "",
          });
        })
        .catch((error) => {
          toast(`${error.response.data}`, {
            position: "top-right",
            autoClose: 5000,
          });
        });
    },
    [reset, setShowProfile, setShowWorkspaceModal]
  );

  return (
    <Modal handleCloseModal={handleToggleWorkspaceModal}>
      <form onSubmit={handleSubmit(handleCreateWorkspace)}>
        <label htmlFor="workspace-label" className={authStyles.label}>
          <span>워크스페이스 이름</span>
          <input
            className={authStyles.input}
            type="text"
            id="workspace-label"
            {...register("newWorkspace", {
              required: "필수 응답 항목입니다.",
            })}
          />
          <p className={authStyles.error}>
            {errors.newWorkspace && errors.newWorkspace.message}
          </p>
        </label>
        <label htmlFor="workspace-url-label" className={authStyles.label}>
          <span>워크스페이스 주소</span>
          <input
            className={authStyles.input}
            type="text"
            id="workspace-label"
            {...register("newUrl", {
              required: "필수 응답 항목입니다.",
            })}
          />
          <p className={authStyles.error}>
            {errors.newUrl && errors.newUrl.message}
          </p>
        </label>
        <button type="submit" className={authStyles.button}>
          생성하기
        </button>
      </form>
    </Modal>
  );
}
