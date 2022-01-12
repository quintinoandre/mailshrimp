import React from 'react';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Header from '../../../shared/header/index';
import { PageContent } from '../../../shared/styles';

class Dashboard extends React.Component {
	render() {
		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<h2>Dashboard</h2>
						<p>
							Here we can list the latest submissions, added contacts or
							statistics
						</p>
					</Container>
				</PageContent>
			</>
		);
	}
}

export default withRouter(Dashboard);
