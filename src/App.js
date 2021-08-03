import React, {Component} from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import {historyObj, userKey} from "./utils/axios-util";

import './scss/style.scss';
import 'primeflex/primeflex.css';
import "primereact/resources/themes/nova/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

class App extends Component {

  render() {
    return (
      <Router basename="/" history={historyObj}>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <PrivateRoute path="/" name="Home" component={TheLayout} />
              {/*<Route path="/" name="Home" render={props => <TheLayout {...props}/>} />*/}
            </Switch>
          </React.Suspense>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    const currentUser = localStorage.getItem(userKey);
    if (!currentUser) {
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
    }
    return <Component {...props} />;
  }} />
);

export default App;
