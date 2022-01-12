import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useRouteMatch,
} from 'react-router-dom';

import LoginPage from '../pages/public/Login';
import SignUpPage from '../pages/public/SignUp';
import ContactsAddPage from '../pages/secure/ContactAdd';
import ContactsListPage from '../pages/secure/ContactList';
import DashboardPage from '../pages/secure/Dashboard';
import RoutePrivate from './route-wrapper';

function Routes() {
	return (
		<Router>
			<Switch>
				<RoutePrivate exact path="/" component={DashboardPage} />
				<RoutePrivate exact path="/contacts" component={ContactsListPage} />
				<RoutePrivate exact path="/contacts/add" component={ContactsAddPage} />
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/signup" component={SignUpPage} />
			</Switch>
		</Router>
	);
}

export default Routes;
