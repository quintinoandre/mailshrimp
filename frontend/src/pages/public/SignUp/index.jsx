import React from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import Logo from '../../../assets/logo.png';
import AccountService from '../../../services/accounts';
import { BoxContent, BoxForm } from '../../../shared/styles';

class SignUp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			password: '',
			domain: '',
			error: '',
			isLoading: false,
		};
	}

	handleSignUp = async (event) => {
		event.preventDefault();

		const { name, email, password, domain, isLoading } = this.state;

		if (!name || !email || !domain || !password)
			this.setState({ error: 'Enter all the fields to register' });
		else {
			try {
				const service = new AccountService();

				await service.signup({ name, email, password, domain });

				const { history } = this.props;

				history.push('/login');
			} catch (error) {
				console.error(error);

				this.setState({
					error: 'An error occurred while creating the account.',
				});
			}
		}
	};

	renderError() {
		const { error } = this.state;

		return <Alert variant="danger">{error}</Alert>;
	}

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
							<h2>Sign Up</h2>
							<p>Enter all fields to register.</p>
							<Form onSubmit={this.handleSignUp}>
								{error && this.renderError()}
								<Form.Group controlId="nameGroup" className="mb-3">
									<Form.Label>Name</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter your name"
										onChange={(event) =>
											this.setState({ name: event.target.value })
										}
									/>
								</Form.Group>
								<Form.Group controlId="emailGroup" className="mb-3">
									<Form.Label>E-mail</Form.Label>
									<Form.Control
										type="email"
										placeholder="Enter your e-email"
										onChange={(event) =>
											this.setState({ email: event.target.value })
										}
									/>
								</Form.Group>
								<Form.Group controlId="domainGroup" className="mb-3">
									<Form.Label>Domain</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter your domain"
										onChange={(event) =>
											this.setState({ domain: event.target.value })
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
									<Button variant="primary" type="submit">
										Sign Up
									</Button>
								</div>
							</Form>
						</BoxForm>
						<BoxContent>
							<Link className="button" to="/login">
								Back to login
							</Link>
						</BoxContent>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default withRouter(SignUp);
