import React from 'react';
import { Container, Table, Row, Col, Badge } from 'react-bootstrap';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';

// import MessageService from '../../../services/messages';
import Header from '../../../shared/header/index';
import { PageContent } from '../../../shared/styles';

function RenderEmptyRow() {
	return (
		<tr>
			<td colSpan="2">No messages have been added.</td>
		</tr>
	);
}

function RenderLine({ message: { id, subject } }) {
	const { url } = useRouteMatch;

	return (
		<tr>
			<td>
				<Link to={`${url}/${id}`}>{subject}</Link>
			</td>
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
				<RenderEmptyRow />
			</tbody>
		</Table>
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

	render() {
		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<h3>Messages</h3>
						<RenderTable />
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(MessagesList);
