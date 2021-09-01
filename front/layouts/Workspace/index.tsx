import React, { FC, useCallback, useState } from 'react';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import useSWR from 'swr';
import { Redirect, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Header,
  ProfileImg,
  RightMenu,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  WorkspaceName,
  Chats,
  MenuScroll,
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import { IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidate();
    });
  }, []);

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowWorkspaceModal(false);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      axios
        .post(
          'http://localhost:3095/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidate();
          setShowWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl(''); //생성 완료하면 비워두는게 좋음
        })
        .catch((error) => {
          console.dir(error.response);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>

      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Workspace;
