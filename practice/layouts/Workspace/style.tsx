import styled from '@emotion/styled';

//프레임
export const Header = styled.header`
  position: relative;
  width: 100%;
  height: 40px;
  background-color: lightgray;
`;

export const WorkspaceWrapper = styled.div`
  display: flex;
  background-color: skyblue;
`;

export const Workspaces = styled.div`
  background-color: green;
`;

export const Channels = styled.div`
  background-color: yellow-green;
`;

export const WorkspaceName = styled.div`
  border-bottom: 1px solid blue;
`;

export const MenuScroll = styled.div``;

export const Chats = styled.div`
  width: 100%;
  background-color: gray;
`;

//Header
export const ProfileImg = styled.img`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`;
