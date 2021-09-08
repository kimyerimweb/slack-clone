import { Container, Header } from './styles';
import React, { useCallback,useEffect,useRef } from 'react';
import gravatar from 'gravatar';
import useSWR, {useSWRInfinite} from 'swr';
import { IUser, IDM } from '@typings/db';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';

const DirectMessage = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: userData } = useSWR<IUser>(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR<IUser>('http://localhost:3095/api//users', fetcher);

  const placeholder = `${userData?.nickname}에게 메시지 보내기`;
  const scrollbarRef = useRef<Scrollbars>(null);

  const {
    data: chatData,
    mutate: mutateChat,
    revalidate: revalidateChat,
    setSize
  } = useSWRInfinite<IDM[]>(
    (index:number) => `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index+1}`,
    fetcher,
  );

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData?.length - 1]?.length < 20) || false;
  
  useEffect(()=>{
    if(chatData?.length === 1){
      scrollbarRef.current?.scrollToBottom()
    }
  },[chatData])

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim())
        axios
          .post(
            `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`,
            { content: chat },
            { withCredentials: true },
          )
          .then(() => {
            revalidateChat();
            setChat('');
            scrollbarRef.current?.scrollToBottom()
          })
          .catch((error) => console.dir(error));
    },
    [chat],
  );

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}/>
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} placeholder={placeholder} />
    </Container>
  );
};

export default DirectMessage;
