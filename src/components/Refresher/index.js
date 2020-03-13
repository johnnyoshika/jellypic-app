import React, { useState, useEffect } from 'react';

import './style.css';

const Refresher = () => {
  const [status, setStatus] = useState('fresh'); // fresh,stale,activating

  useEffect(() => {
    setUp();
  }, []);

  const setUp = () => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then(registration => {
      // The window client isn't currently controller so it's a new service worker that will activate immediately
      if (!navigator.serviceWorker.controller) return;

      let preventDevToolsReloadLoop;
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        e => {
          // New service worker's been activated.

          // Ensure refresh is only called once. Workaround for bug in dev tools "force update on reload".
          if (preventDevToolsReloadLoop) return;
          preventDevToolsReloadLoop = true;
          window.location.reload();
        },
      );

      // SW is waiting to activate. Can occur if multiple clients open and
      // one of the clients is refreshed
      if (registration.waiting) return setStatus('stale');

      const listenInstalledStateChange = () => {
        registration.installing.addEventListener('statechange', e => {
          if (e.target.state === 'installed') setStatus('stale');
        });
      };

      if (registration.installing)
        return listenInstalledStateChange();

      // We are currently controlled so a new SW may be found...
      // Add a listener in case a new SW is found,
      registration.addEventListener(
        'updatefound',
        listenInstalledStateChange,
      );
    });
  };

  const reload = () => {
    navigator.serviceWorker.ready.then(registration => {
      // double checking to make sure registration.waiting is available
      if (!registration.waiting) return;
      setStatus('activating');
      registration.waiting.postMessage('skipWaiting');
    });
  };

  return (
    <>
      {status !== 'fresh' && (
        <div className="refresher-container">
          <span>This site has updated!</span>
          <span>
            <button
              className="btn btn-primary"
              disabled={status === 'activating'}
              onClick={reload}
            >
              Reload
            </button>
          </span>
        </div>
      )}
    </>
  );
};

export default Refresher;
