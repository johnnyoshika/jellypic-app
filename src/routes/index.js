import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
} from 'react-router-dom';
import { useMe } from 'context/user-context';
import Uploader from 'components/Uploader';
import Home from './Home';
import Post from './Post';
import Subscription from './Subscription';
import User from './User';

import './style.css';

const Dashboard = ({ history }) => {
  const me = useMe();

  return (
    <Router>
      <div className="page">
        <div className="header">
          <div className="gutter" />
          <div className="header-content">
            <div className="font-lobster">
              <Link to="/">Jellypic</Link>
            </div>
            <div className="header-content-icons text-right">
              <div />
              <div>
                <NavLink to="/" exact activeClassName="nav-active">
                  <i
                    className="fa fa-home fa-2x"
                    aria-hidden="true"
                  />
                </NavLink>
              </div>
              <div>
                <Uploader history={history}>
                  <i
                    className="fa fa-cloud-upload fa-2x"
                    aria-hidden="true"
                  />
                </Uploader>
              </div>
              <div>
                <NavLink
                  to="/subscription"
                  activeClassName="nav-active"
                >
                  <i
                    className="fa fa-bell fa-2x"
                    aria-hidden="true"
                  />
                </NavLink>
              </div>
              <div>
                <NavLink
                  to={'/users/' + me.id}
                  activeClassName="nav-active"
                >
                  <i
                    className="fa fa-user fa-2x"
                    aria-hidden="true"
                  />
                </NavLink>
              </div>
            </div>
          </div>
          <div className="gutter" />
        </div>
        <>
          <Route exact path="/" component={Home} />
          <Route path="/posts/:id" component={Post} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/users/:id" component={User} />
        </>
      </div>
    </Router>
  );
};

export default Dashboard;
