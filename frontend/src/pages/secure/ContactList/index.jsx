import React from 'react';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';

import ContactsService from '../../../services/contacts';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

function RenderLine({ contact: { id, email, name } }) {
	const { url } = useRouteMatch();

	return (
		<tr key={id}>
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
				{contacts.map((item) => (
					<RenderLine key={item.id} contact={item} />
				))}
			</tbody>
		</Table>
	);
}

function RenderEmptyRow() {
	return (
		<Col>
			<p colSpan="2">No contact available.</p>
		</Col>
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
						<Row>
							<Col>
								<h3>Contacts</h3>
							</Col>
							<Col>
								<Link className="btn btn-success float-end" to="/contacts/add">
									Add Contact
								</Link>
							</Col>
						</Row>
						<p>List of registered contacts.</p>
						{!contacts.length ? (
							<RenderEmptyRow />
						) : isLoading ? (
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
