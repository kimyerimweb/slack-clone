// const { data: channelMemberData, revalidate: revalidateChannelMember } = useSWR<IUser[]>(
//   userData ? `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members` : null,
//   fetcher,
// );

// const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
import React, { useState, useCallback } from 'react';
import { CollapseButton } from '@components/DMList/styles';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import EachChannel from '@components/EachChannel';

const ChannelList = () => {
  const [channelCollapse, setChannelCollapse] = useState(false);
  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);
  const { data: channelList } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
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
        <span>Channel</span>
      </h2>
      <div>{!channelCollapse && channelList?.map((channel) => <EachChannel key={channel.id} channel={channel} />)}</div>
    </>
  );
};

export default ChannelList;
