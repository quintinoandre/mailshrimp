import React from 'react';
import { Container, Table, Row, Col, Badge } from 'react-bootstrap';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';

// import MessageService from '../../../services/messages';
import Header from '../../../shared/header/index';
import { PageContent } from '../../../shared/styles';

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
						<p>Messages</p>
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(MessagesList);
