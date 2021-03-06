import React from 'react';
import { Container, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

import ContactService from '../../../services/contacts';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

class ContactAdd extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			phone: '',
			error: '',
			isLoading: false,
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit = async (event) => {
		event.preventDefault();

		const { history } = this.props;

		const { name, email, phone } = this.state;

		if (!name || !email || !phone)
			this.setState({ error: 'Enter all fields to add the contact.' });
		else {
			try {
				this.setState({ isLoading: true });

				const service = new ContactService();

				await service.add({ name, email, phone });

				this.setState({ isLoading: false });

				history.push('/contacts');
			} catch (error) {
				console.error(error);

				this.setState({
					error: 'An error occurred while creating the contact.',
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
								<h3>Add Contact</h3>
								<p>Enter all fields to add the contact.</p>
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
											placeholder="Enter a name"
											onChange={(event) =>
												this.setState({ name: event.target.value })
											}
										/>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>E-mail</Form.Label>
										<Form.Control
											type="email"
											placeholder="email@yourdomain.com"
											onChange={(event) =>
												this.setState({ email: event.target.value })
											}
										/>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Phone</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter a phone number"
											onChange={(event) =>
												this.setState({ phone: event.target.value })
											}
										/>
									</Form.Group>
									<Button className="mb-3" variant="primary" type="submit">
										Add Contact
									</Button>
									<Link className="btn btn-default mb-3" to="/contacts">
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

export default withRouter(ContactAdd);
