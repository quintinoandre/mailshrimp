import React from 'react';
import { Container, Badge } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import MessageService from '../../../services/messages';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

function RenderMessageStatus({ status }) {
	let statusName = {};

	switch (status) {
		case 100:
			statusName = { title: 'CREATED', css: 'primary' };
			break;

		case 200:
			statusName = { title: 'SENT', css: 'success' };
			break;

		case 300:
			statusName = { title: 'REMOVED', css: 'danger' };
			break;

		default:
			statusName = { title: 'UNDEFINED', css: 'secondary' };
			break;
	}

	return (
		<Badge pill bg={statusName.css}>
			{statusName.title}
		</Badge>
	);
}

function RenderMessage({ message: { subject, body, status } }) {
	return (
		<>
			<RenderMessageStatus status={status} />
			<p>
				<b>Subject:</b>
				<br />
				{subject}
			</p>
			<p>
				<b>Content:</b>
				<br />
				{body}
			</p>
		</>
	);
}

class MessageDetail extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isSending: false,
			isLoading: true,
			message: null,
		};
	}

	async componentDidMount() {
		const {
			match: {
				params: { messageId },
			},
		} = this.props;

		const service = new MessageService();

		const result = await service.getOne(messageId);

		this.setState({ message: result, isLoading: false });
	}

	render() {
		const { message, isLoading, isSending } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<h3>Message details</h3>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<RenderMessage message={message} />
						)}
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(MessageDetail);
