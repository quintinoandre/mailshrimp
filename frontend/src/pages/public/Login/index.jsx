import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import Logo from '../../../assets/logo.png';
import AccountService from '../../../services/accounts';
import { login } from '../../../services/auth';
import { BoxContent, BoxForm } from '../../../shared/styles';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = { email: '', password: '', error: '' };
	}

	handleLogin = async (event) => {
		event.preventDefault();

		const { email, password } = this.state;

		if (!email || !password)
			this.setState({ error: 'Enter all the fields to access' });
		else {
			try {
				const service = new AccountService();

				const {
					data: { token },
				} = await service.login(email, password);

				login(token);

				const { history } = this.props;

				history.push('/');
			} catch (error) {
				console.error(error);

				this.setState({
					error: 'An error occurred while trying to login.',
				});
			}
		}
	};

	render() {
		const { error } = this.state;

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
								{error && this.renderError()}
								<Form.Group controlId="emailGroup" className="mb-3">
									<Form.Label>E-mail</Form.Label>
									<Form.Control
										type="email"
										placeholder="Enter your e-mail"
										onChange={(event) =>
											this.setState({ email: event.target.value })
										}
									/>
								</Form.Group>
								<Form.Group controlId="passwordGroup" className="mb-3">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Enter your password"
										onChange={(event) =>
											this.setState({ password: event.target.value })
										}
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

export default withRouter(Login);
