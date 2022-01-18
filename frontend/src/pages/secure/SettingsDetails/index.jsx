import React from 'react';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import SettingsService from '../../../services/settings';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';

class SettingsDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = { isLoading: true, dnsSettings: null };
	}

	async componentDidMount() {
		const service = new SettingsService();

		const { DKIM, SPF, Domain, EmailAddress } = await service.get();

		this.setState({
			isLoading: false,
			dnsSettings: { DKIM, SPF, Domain, EmailAddress },
		});
	}

	render() {
		const { isLoading, dnsSettings } = this.state;

		return (
			<>
				<Header />
				<PageContent>
					<Container>
						<Row className="mb-3">
							<Col>
								<h3>Settings</h3>
							</Col>
						</Row>
						<p>
							To send messages through MailShrimp, you need to have a domain
							associated with your account.
						</p>
						<p>
							You need to update your DNS by adding the new entries below and
							add an email to be the sender.
						</p>

						<h4 className="mb-3">DNS Settings</h4>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<>
								<h5>TXT entry</h5>
								<p>Create a TXT entry with the following information:</p>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Type</th>
											<th>Name</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										{!isLoading ? (
											<RenderLines records={dnsSettings.Domain} />
										) : (
											<RenderLoaderRow />
										)}
									</tbody>
								</Table>

								<h5>DKIM</h5>
								<p>
									Add a DKIM entry in your provider with the following
									information:
								</p>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Type</th>
											<th>Name</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										{!isLoading ? (
											<RenderLines records={dnsSettings.DKIM} />
										) : (
											<RenderLoaderRow />
										)}
									</tbody>
								</Table>

								<h5>SPF</h5>
								<p>
									Create or update the SPF entry in your DNS. For MX
									configuration, add the given priority:
								</p>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Type</th>
											<th>Name</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										{!isLoading ? (
											<RenderLines records={dnsSettings.SPF} />
										) : (
											<RenderLoaderRow />
										)}
									</tbody>
								</Table>
							</>
						)}

						<h4>Email addresses</h4>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<>
								<p>List of email addresses configured as sender:</p>
								<Link className="btn btn-success mb-4" to="settings/email/add">
									Add Sender
								</Link>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>E-mail</th>
										</tr>
									</thead>
									<tbody>
										{!isLoading ? (
											<RenderEmails records={dnsSettings.EmailAddress} />
										) : (
											<RenderLoaderRow />
										)}
									</tbody>
								</Table>
							</>
						)}
					</Container>
				</PageContent>
			</>
		);
	}
}

function RenderEmails({ records }) {
	return (
		// eslint-disable-next-line react/jsx-no-useless-fragment
		<>
			{records.length < 1 ? (
				<RenderEmptyRow message="No registered email." />
			) : (
				records.map((item) => (
					<tr key={item.email}>
						{item.email}
						{item.verified ? (
							<Badge className="ms-2" bg="success" pill>
								verified email
							</Badge>
						) : (
							<Badge className="ms-2" bg="warning" pill>
								awaiting verification
							</Badge>
						)}
					</tr>
				))
			)}
		</>
	);
}

function RenderLines({ records }) {
	const { dnsRecords, verified } = records;

	return (
		<>
			{dnsRecords.length < 1 && (
				<RenderEmptyRow message="No DNS available for configuration." />
			)}
			{verified ? (
				<RenderVerifiedRow />
			) : (
				dnsRecords.map((item) => (
					<tr key={item.value}>
						<td>{item.type}</td>
						<td>{item.name}</td>
						<td>
							{item.priority
								? `${item.value} - Priority ${item.priority}`
								: item.value}
						</td>
					</tr>
				))
			)}
		</>
	);
}

function RenderEmptyRow({ message }) {
	return (
		<tr>
			<td colSpan="3">{message}</td>
		</tr>
	);
}

function RenderVerifiedRow() {
	return (
		<tr>
			<td colSpan="3">Configuration performed successfully.</td>
		</tr>
	);
}

function RenderLoaderRow() {
	return (
		<tr>
			<td colSpan="3">
				<Loader />
			</td>
		</tr>
	);
}

function Loader() {
	return <>Loading...</>;
}

export default SettingsDetails;
