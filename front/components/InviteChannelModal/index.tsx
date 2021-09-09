import Modal from '@components/Modal';
import React, { useCallback, VFC } from 'react';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { toast } from 'react-toastify';
import { IUser } from '@typings/db';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);

  const { data: memberData, revalidate: revalidateMember } = useSWR<IUser[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channel/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }

      axios
        .post(`http://localhost:3095/api/workspaces/${workspace}/channel/${channel}/members`, {
          email: newMember,
        })
        .then(() => {
          revalidateMember();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="channel-label">
          <span>이메일</span>
          <Input id="channel" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">채널 초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
