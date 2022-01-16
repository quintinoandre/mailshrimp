import React from 'react';
import { Container, Table, Row, Col, Badge } from 'react-bootstrap';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';

import MessageService from '../../../services/messages';
import Header from '../../../shared/header/index';
import { PageContent } from '../../../shared/styles';

function RenderEmptyRow({ message }) {
	return (
		<tr>
			<td colSpan="2">{message}</td>
		</tr>
	);
}

function RenderLine({ message: { id, subject, status } }) {
	const { url } = useRouteMatch();

	return (
		<tr>
			<td>
				<Link to={`${url}/${id}`}>{subject}</Link>
			</td>
			<td>{status}</td>
		</tr>
	);
}

function RenderTable({ messages }) {
	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>Subject</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{!messages.length ? (
					<RenderEmptyRow message="No messages have been added." />
				) : (
					messages.map((message) => (
						<RenderLine key={message.id} message={message} />
					))
				)}
			</tbody>
		</Table>
	);
}

function RenderButtonAdd() {
	const { url } = useRouteMatch();

	return (
		<Link className="btn btn-success float-end" to={`${url}/add`}>
			Add Message
		</Link>
	);
}

class MessagesList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			messages: [],
		};
	}

	async componentDidMount() {
		const service = new MessageService();

		const result = await service.getAll();

		this.setState({ isLoading: false, messages: result });
	}

	render() {
		const { isLoading, messages } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<Row className="mb-3">
							<Col>
								<h3>Messages</h3>
							</Col>
							<Col>
								<RenderButtonAdd />
							</Col>
						</Row>
						<p>List of messages sent by the tool:</p>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<RenderTable messages={messages} />
						)}
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(MessagesList);
