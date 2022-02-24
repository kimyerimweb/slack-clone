import React from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';

import {
  Header,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  WorkspaceName,
  MenuScroll,
  Chats,
  ProfileImg,
} from './style';

import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';

const url = 'http://localhost:3095';

const Workspace = () => {
  const { data, error, revalidate, mutate } = useSWR<IUser>(`${url}/api/users`, fetcher);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header>
        <ProfileImg
          src={gravatar.url(data?.email, { s: '28px', d: 'retro' })}
          alt={data.nickname}
        />
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          워크스페이스 추가
          {data.Workspaces.map((ws) => {
            return (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid white',
                  borderRadius: '4px',
                }}
              >
                {ws.name.substr(0, 1)}
              </div>
            );
          })}
          {/* // <AddButton></AddButton> */}
        </Workspaces>
        <Channels>
          <WorkspaceName>워크스페이스 이름</WorkspaceName>
          <MenuScroll>메뉴 스크롤</MenuScroll>
        </Channels>
        <Chats>채팅</Chats>
      </WorkspaceWrapper>
    </>
  );
};

export default Workspace;
