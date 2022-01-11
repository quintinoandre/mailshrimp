import React from 'react';
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
	Link,
} from 'react-router-dom';

import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';

function Home() {
	return (
		<div>
			<Menu />
			<h2>Inicio</h2>
		</div>
	);
}

function Contacts() {
	return (
		<div>
			<Menu />
			<h2>List of Contacts</h2>
			<ul>
				<li>
					<Link to="/contacts">Contact A</Link>
				</li>
				<li>
					<Link to="/contacts">Contact B</Link>
				</li>
				<li>
					<Link to="/contacts">Contact C</Link>
				</li>
			</ul>
		</div>
	);
}

function Messages() {
	return (
		<div>
			<Menu />
			<h2>List of Messages</h2>
		</div>
	);
}

function Menu() {
	return (
		<ul>
			<li>
				<Link to="/contacts">Contacts</Link>
			</li>
			<li>
				<Link to="/messages">Messages</Link>
			</li>
			<li>
				<Link to="/login">SignIn</Link>
			</li>
		</ul>
	);
}

export default function Routes() {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/" element={<Home />} />
					<Route path="/contacts" element={<Contacts />} />
					<Route path="/messages" element={<Messages />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
				</Switch>
			</div>
		</Router>
	);
}
