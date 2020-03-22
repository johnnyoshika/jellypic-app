import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER } from 'schema/queries';
import { useMe } from 'context/user-context';
import Stats from './Stats';
import Logout from 'components/Logout';
import Error from 'components/Error';
import Loading from 'components/Loading';

const Profile = ({ id }) => {
  const me = useMe();

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: {
      id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  if (loading) return <Loading />;

  if (error)
    return (
      <Error error={error}>
        <button className="btn btn-primary" onClick={retry}>
          Try again!
        </button>
      </Error>
    );

  const { user } = data;

  return (
    <div className="profile-headline">
      <div className="profile-headline-photo">
        <img
          className="image-100"
          alt=""
          src={user.pictureUrl}
          crossOrigin="anonymous"
        />
      </div>
      <div className="profile-info">
        <div className="profile-info-username">
          {user.username} {me.id === user.id && <Logout />}
        </div>
        <Stats id={id} />
        <div className="profile-info-name">
          <strong>
            {user.firstName} {user.lastName}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default Profile;
