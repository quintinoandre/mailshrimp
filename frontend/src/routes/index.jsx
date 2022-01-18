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
import ContactsDetailPage from '../pages/secure/ContactDetail';
import ContactsListPage from '../pages/secure/ContactList';
import DashboardPage from '../pages/secure/Dashboard';
import MessageAddPage from '../pages/secure/MessageAdd';
import MessageDetailPage from '../pages/secure/MessageDetail';
import MessageListPage from '../pages/secure/MessageList';
import SettingsDetailPage from '../pages/secure/SettingsDetails';
import SettingsEmailAddPage from '../pages/secure/SettingsEmailAdd';
import RoutePrivate from './route-wrapper';

function Routes() {
	return (
		<Router>
			<Switch>
				<RoutePrivate exact path="/" component={DashboardPage} />
				<RoutePrivate exact path="/contacts" component={ContactsListPage} />
				<RoutePrivate exact path="/contacts/add" component={ContactsAddPage} />
				<RoutePrivate
					exact
					path="/contacts/:contactId"
					component={ContactsDetailPage}
				/>
				<RoutePrivate exact path="/messages" component={MessageListPage} />
				<RoutePrivate exact path="/messages/add" component={MessageAddPage} />
				<RoutePrivate
					exact
					path="/messages/:messageId"
					component={MessageDetailPage}
				/>
				<RoutePrivate exact path="/settings" component={SettingsDetailPage} />
				<RoutePrivate
					exact
					path="/settings/add"
					component={SettingsEmailAddPage}
				/>
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/signup" component={SignUpPage} />
			</Switch>
		</Router>
	);
}

export default Routes;
