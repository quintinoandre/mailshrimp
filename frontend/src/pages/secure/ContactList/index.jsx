import React from 'react';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';

import ContactsService from '../../../services/contacts';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

function RenderEmptyRow({ message }) {
	return (
		<tr>
			<td colSpan="2">{message}</td>
		</tr>
	);
}

function RenderLine({ contact: { id, email, name } }) {
	const { url } = useRouteMatch();

	return (
		<tr>
			<td>
				<Link to={`${url}/${id}`}>{email}</Link>
			</td>
			<td>{name}</td>
		</tr>
	);
}

function RenderTable({ contacts }) {
	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>E-mail</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				{!contacts.length ? (
					<RenderEmptyRow message="No contact available." />
				) : (
					contacts.map((contact) => (
						<RenderLine key={contact.id} contact={contact} />
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
			Add Contact
		</Link>
	);
}

class Contacts extends React.Component {
	constructor(props) {
		super(props);

		this.state = { isLoading: true, contacts: [] };
	}

	async componentDidMount() {
		const service = new ContactsService();

		const result = await service.getAll();

		this.setState({ isLoading: false, contacts: result });
	}

	render() {
		const { isLoading, contacts } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<Row className="mb-3">
							<Col>
								<h3>Contacts</h3>
							</Col>
							<Col>
								<RenderButtonAdd />
							</Col>
						</Row>
						<p>List of registered contacts:</p>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<RenderTable contacts={contacts} />
						)}
					</Container>
				</PageContent>
			</>
		);
	}
}

export default Contacts;
