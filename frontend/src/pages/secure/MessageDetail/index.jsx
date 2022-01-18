import React from 'react';
import { Container, Badge, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import MessageService from '../../../services/messages';
import SettingsService from '../../../services/settings';
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

function RenderMessage({
	message: { subject, body, status, fromName, fromEmail },
}) {
	return (
		<>
			<RenderMessageStatus status={status} />
			<p className="mt-3">
				<b>Subject:</b>
				<br />
				{subject}
			</p>
			<p className="mt-3">
				<b>Sender e-mail:</b>
				<br />
				{fromName} ({fromEmail})
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

		const messageService = new MessageService();

		const settingsService = new SettingsService();

		const message = await messageService.getOne(messageId);

		const { name: fromName, email: fromEmail } =
			await settingsService.getOneAccountEmail(message.accountEmailId);

		this.setState({
			message: { ...message, fromName, fromEmail },
			isLoading: false,
		});
	}

	handleSendMessage = async (messageId) => {
		this.setState({ isSending: true });

		const service = new MessageService();

		await service.send(messageId);

		this.setState({ isSending: false });

		const { history } = this.props;

		history.push('messages');
	};

	render() {
		const { message, isLoading, isSending } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<h3 className="mb-3">Message details</h3>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<>
								<RenderMessage message={message} />
								<Button
									className="mt-3"
									disabled={isSending}
									variant="primary"
									onClick={() => this.handleSendMessage(message.id)}
								>
									{isSending ? 'Sending...' : 'Send Message'}
								</Button>
							</>
						)}
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(MessageDetail);
