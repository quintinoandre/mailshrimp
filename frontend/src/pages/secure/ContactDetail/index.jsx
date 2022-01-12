import React from 'react';
import { Container } from 'react-bootstrap';

import ContactsService from '../../../services/contacts';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

function RenderContact({ contact: { name, email, phone } }) {
	return (
		<>
			<p>Name: {name}</p>
			<p>E-mail: {email}</p>
			<p>Phone: {phone}</p>
		</>
	);
}

class ContactDetail extends React.Component {
	constructor(props) {
		super(props);

		this.state = { isLoading: true, contact: null };
	}

	async componentDidMount() {
		const {
			match: {
				params: { contactId },
			},
		} = this.props;

		await this.getContact(contactId);
	}

	getContact = async (contactId) => {
		const service = new ContactsService();

		const result = await service.getOne(contactId);

		this.setState({ contact: result, isLoading: false });
	};

	render() {
		const { isLoading, contact } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<h3>Contact Details</h3>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<RenderContact contact={contact} />
						)}
					</Container>
				</PageContent>
			</>
		);
	}
}

export default ContactDetail;
