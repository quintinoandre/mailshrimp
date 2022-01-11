import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from '../../../assets/logo.png';
import { BoxContent, BoxForm } from './styles';

class Login extends React.Component {
	handleLogin = async (event) => {
		event.preventDefault();
	};

	render() {
		return (
			<Container>
				<Row className="justify-content-md-center">
					<Col xs={12} md={6}>
						<BoxContent>
							<img src={Logo} alt="MailShrimp" />
						</BoxContent>
						<BoxForm>
							<h2>Login</h2>
							<p>Enter your data to authenticate:</p>
							<Form onSubmit={this.handleLogin}>
								<Form.Group controlId="emailGroup" className="mb-3">
									<Form.Label>E-mail</Form.Label>
									<Form.Control type="email" placeholder="Enter your e-mail" />
								</Form.Group>
								<Form.Group controlId="passwordGroup" className="mb-3">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Enter your password"
									/>
								</Form.Group>
								<div className="d-grid gap-2">
									<Button variant="secondary" type="submit">
										Login
									</Button>
								</div>
							</Form>
						</BoxForm>
						<BoxContent>
							<p>New to the platform?</p>
							<Link className="button" to="/signup">
								Create your account now
							</Link>
						</BoxContent>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Login;
