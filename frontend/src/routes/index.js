import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useRouteMatch,
} from 'react-router-dom';

import LoginPage from '../pages/public/Login';
import SignUpPage from '../pages/public/SignUp';
import ContactsListPage from '../pages/secure/ContactList';
import DashboardPage from '../pages/secure/Dashboard';
import RoutePrivate from './route-wrapper';

function ContactRoutes() {
	const { path } = useRouteMatch;

	return (
		<Switch>
			<Route exact path={path} component={ContactsListPage} />
		</Switch>
	);
}

function Routes() {
	return (
		<Router>
			<Switch>
				<RoutePrivate exact path="/" component={DashboardPage} />
				<RoutePrivate exact path="/contacts" component={ContactRoutes} />
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/signup" component={SignUpPage} />
			</Switch>
		</Router>
	);
}

export default Routes;
