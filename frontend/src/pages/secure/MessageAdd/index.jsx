import React from 'react';
import { Container, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

import MessageService from '../../../services/messages';
import SettingsService from '../../../services/settings';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

class MessageAdd extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			subject: '',
			body: '',
			error: '',
			accountEmailId: '',
			emailsFrom: [],
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		const service = new SettingsService();

		this.setState({ isLoading: true });

		const result = await service.getAllAccountEmail();

		this.setState({ isLoading: false, emailsFrom: result });
	}

	handleSubmit = async (event) => {
		event.preventDefault();

		const { history } = this.props;

		const { subject, body, accountEmailId } = this.state;

		if (!subject || !body || !accountEmailId) {
			this.setState({ error: 'Enter all fields to add the message.' });
		} else {
			try {
				const service = new MessageService();

				await service.add({ subject, body, accountEmailId });

				history.push('/messages');
			} catch (error) {
				console.error(error);

				this.setState({
					error: 'An error occurred while creating the message.',
				});
			}
		}
	};

	renderError = () => {
		const { error } = this.state;

		return <Alert variant="danger">{error}</Alert>;
	};

	render() {
		const { isLoading, emailsFrom, accountEmailId, error } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<Row>
							<Col>
								<h3 className="mb-3">Add Message</h3>
							</Col>
						</Row>
						<Row>
							<Col lg={6} sm={12}>
								<Form onSubmit={this.handleSubmit}>
									{error && this.renderError()}
									<Form.Group className="mb-3">
										<Form.Label>Subject</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter the message subject"
											onChange={(event) =>
												this.setState({ subject: event.target.value })
											}
										/>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Sender</Form.Label>
										<Form.Select
											value={!isLoading && accountEmailId}
											onChange={(event) =>
												this.setState({ accountEmailId: event.target.value })
											}
											disabled={isLoading}
										>
											<option key="0" value="">
												Select
											</option>
											{!isLoading &&
												emailsFrom.map((item) => (
													<option key={item.id} value={item.id}>
														{item.email}
													</option>
												))}
										</Form.Select>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Message body</Form.Label>
										<Form.Control
											as="textarea"
											rows={3}
											placeholder="Enter message content"
											onChange={(event) =>
												this.setState({ body: event.target.value })
											}
										/>
									</Form.Group>
									<Button className="mb-3" variant="primary" type="submit">
										Save Message
									</Button>
									<Link className="btn btn-light mb-3" to="/messages">
										Go back
									</Link>
								</Form>
							</Col>
						</Row>
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(MessageAdd);
