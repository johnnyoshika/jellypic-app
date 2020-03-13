import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { SUBSCRIPTION_FRAGMENT } from 'schema/fragments';
import Loading from 'components/Loading';
import Endpoint from './Endpoint';

import './style.css';

const ADD_SUBSCRIPTION = gql`
  mutation addSubscription($input: AddSubscriptionInput!) {
    addSubscription(input: $input) {
      subscription {
        ...subscription
      }
    }
  }
  ${SUBSCRIPTION_FRAGMENT}
`;

const REMOVE_SUBSCRIPTION = gql`
  mutation removeSubscription($input: RemoveSubscriptionInput!) {
    removeSubscription(input: $input) {
      affectedRows
    }
  }
`;

// source: https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js
/*eslint-disable */
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
/*eslint-enable */

const Subscription = () => {
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [endpoint, setEndpoint] = useState();

  const [addSubscription] = useMutation(ADD_SUBSCRIPTION, {
    onError: error => {
      setErrorResult(error.message);
    },
    onCompleted: data => {
      setResult('subscribed');
    },
  });
  const [removeSubscription] = useMutation(REMOVE_SUBSCRIPTION, {
    onError: error => {
      setErrorResult(error.message);
    },
    onCompleted: data => {
      setResult('available');
    },
  });

  useEffect(() => {
    check();
    // disbable lint: https://github.com/facebook/react/issues/15865#issuecomment-530276309
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setResult = status => {
    setError(undefined);
    setStatus(status);
  };

  const setErrorResult = message => {
    setError(message);
    setStatus('error');
  };

  const setAvailable = () => setResult('available');

  const check = () => {
    setResult('loading');

    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window)
    ) {
      return setResult('unavailable');
    }

    if (!navigator.serviceWorker.controller)
      return setErrorResult(
        'Service worker is not controlling this app.',
      );

    if (Notification.permission === 'denied')
      return setErrorResult(
        'Oh oh! You blocked notifications. Please change your browser settings to enable it.',
      );

    navigator.serviceWorker.ready
      .then(registration =>
        registration.pushManager.getSubscription(),
      )
      .then(subscription => {
        if (subscription) {
          setEndpoint(subscription.endpoint);
          setResult('subscribed');
        } else setResult('available');
      })
      .catch(error =>
        setErrorResult(
          `Couldn't detect whether push notification is available on this device.`,
        ),
      );
  };

  const subscribe = () => {
    setResult('loading');
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(
            process.env.REACT_APP_WEB_PUSH_VAPID_PUBLIC_KEY,
          ),
        })
        .then(
          subscription => {
            const s = subscription.toJSON();
            addSubscription({
              variables: {
                input: {
                  endpoint: s.endpoint,
                  auth: s.keys.auth,
                  p256dh: s.keys.p256dh,
                },
              },
            });
          },
          error => setErrorResult(error.message),
        );
    });
  };

  const unsubscribe = () => {
    setResult('loading');
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager
        .getSubscription()
        .then(subscription => {
          removeSubscription({
            variables: {
              input: {
                endpoint: subscription.endpoint,
              },
            },
          });
        });
    });
  };

  const renderAvailable = () => (
    <div className="subscriber-state-alert subscriber-state-alert-blue mb-40">
      Your device supports push notifications. Subscribe now!{' '}
      <i className="fa fa-smile" aria-hidden="true" />
      <br />
      <br />
      <button className="btn btn-primary" onClick={subscribe}>
        Subscribe
      </button>
    </div>
  );

  const renderUnavailable = () => (
    <div className="subscriber-state-alert subscriber-state-alert-yellow mb-40">
      Unfortunately your device doesn't support push notifications
      yet. <i className="fa fa-frown" aria-hidden="true" />
    </div>
  );

  const renderError = () => (
    <div className="subscriber-state-alert subscriber-state-alert-red mb-40">
      {error}
      <br />
      <br />
      <button className="btn btn-primary" onClick={check}>
        Check again
      </button>
    </div>
  );

  return (
    <div className="subscriber-state">
      <div className="gutter" />
      <div className="subscriber-state-content">
        <div className="text-center">
          {(() => {
            switch (status) {
              case 'subscribed':
                return (
                  <Endpoint
                    endpoint={endpoint}
                    setAvailable={setAvailable}
                    unsubscribe={unsubscribe}
                  />
                );
              case 'available':
                return renderAvailable();
              case 'unavailable':
                return renderUnavailable();
              case 'loading':
                return <Loading />;
              case 'error':
                return renderError();
              default:
                return null;
            }
          })()}
        </div>
      </div>
      <div className="gutter" />
    </div>
  );
};

export default Subscription;
