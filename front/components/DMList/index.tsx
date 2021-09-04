import React from 'react';
import { useCallback, useState } from 'react';
import { CollapseButton } from './styles';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import EachDM from '@components/EachDM';

const DMList = () => {
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData, error, revalidate, mutate } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);

  const { data: WorkspacememberData, revalidate: revalidateWorkspaceMember } = useSWR<IUser[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          ></i>
        </CollapseButton>
        <span>Direct Message</span>
      </h2>
      <div>
        {!channelCollapse &&
          WorkspacememberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;
