import React from 'react';
import { Container, Form, Alert, Button, Row, Col } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

import SettinsgService from '../../../services/settings';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

class SettingsEmailAdd extends React.Component {
	constructor(props) {
		super(props);

		this.state = { isLoading: false, name: '', email: '', error: '' };

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit = async (event) => {
		event.preventDefault();

		const { history } = this.props;

		const { name, email } = this.state;

		if (!name || !email)
			this.setState({ error: 'Enter all fields to add the sender' });
		else {
			try {
				this.setState({ isLoading: true });

				const service = new SettinsgService();

				await service.addAccountEmail({ name, email });

				this.setState({ isLoading: false });

				history.push('/settings');
			} catch (error) {
				console.error(error);

				this.setState({
					error: 'An error occurred while creating the sender.',
				});
			}
		}
	};

	renderError() {
		const { error } = this.state;

		return <Alert variant="danger">{error}</Alert>;
	}

	render() {
		const { error, isLoading } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<Row>
							<Col>
								<h3>Add Sender</h3>
								<p>Enter all fields to add the sender.</p>
								<p>
									You will receive an email from AWS with the link to confirm
									the email, click the link to activate.
								</p>
							</Col>
						</Row>
						<Row>
							<Col lg={6} sm={12}>
								<Form onSubmit={this.handleSubmit}>
									{error && this.renderError()}
									<Form.Group className="mb-3">
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											placeholder="Inform the name"
											onChange={(event) =>
												this.setState({ name: event.target.value })
											}
										/>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>E-mail</Form.Label>
										<Form.Control
											type="text"
											placeholder="email@yourdomain.com"
											onChange={(event) =>
												this.setState({ email: event.target.value })
											}
										/>
									</Form.Group>
									<Button className="mb-3" variant="primary" type="submit">
										Add Sender
									</Button>
									<Link className="btn btn-default mb-3" to="/settings">
										Go back
									</Link>
								</Form>
								{isLoading && <p>Loading...</p>}
							</Col>
						</Row>
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(SettingsEmailAdd);
