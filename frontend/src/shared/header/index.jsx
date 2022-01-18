import React from 'react';
import { Container, Navbar, Nav, NavbarBrand } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Icon from '../../assets/icon.png';
import { logout } from '../../services/auth';
import { Logo, Header } from './styles';

function MainMenu({ history }) {
	const handleLogout = async () => {
		await logout();

		history.push('/');
	};

	return (
		<Header>
			<Navbar>
				<Container>
					<NavbarBrand href="/">
						<Logo src={Icon} alt="MailShrimp" />
					</NavbarBrand>
					<Nav>
						<Nav.Link href="/contacts">Contacts</Nav.Link>
						<Nav.Link href="/messages">Messages</Nav.Link>
						<Nav.Link href="/settings">Settings</Nav.Link>
					</Nav>
					<Nav>
						<Nav.Link onClick={handleLogout}>Logout</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
		</Header>
	);
}

export default withRouter(MainMenu);
