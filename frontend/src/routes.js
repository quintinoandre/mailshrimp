import React from 'react';
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
	Link,
} from 'react-router-dom';

import SignIn from './pages/public/SignIn';

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

function SignUp() {
	return (
		<div>
			<h2>SignUp</h2>
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
				<Link to="/signin">SignIn</Link>
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
					<Route path="/signin" element={<SignIn />} />
					<Route path="/signup" element={<SignUp />} />
				</Switch>
			</div>
		</Router>
	);
}
