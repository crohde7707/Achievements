import React from 'react';
import connector from '../redux/connector';
import axios from 'axios';
import ConfirmPanel from './confirm-panel';
import AdditionalIntegrationsPanel from './additional-integrations-panel';

//integration panels
import StreamLabsPanel from './streamlabs-panel';
import StreamElementsPanel from './streamelements-panel';

import './channel-integrations-panel.css';

class ChannelIntegrationsPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		let integrations = this.props.channel.integration;
		let connectedContent = [<h4 key="integration-header" className="my-integrations-header">My Integrations</h4>];
		
		if(!integrations || Object.keys(integrations).length === 0) {
			connectedContent.push([
				<p key="integration-notice">No integrations have been connected</p>
			])
		}

		return (
			<div>
				<div>
					<AdditionalIntegrationsPanel channel={this.props.channel} />
					{connectedContent}
					<StreamLabsPanel channel={this.props.channel} update={this.props.updateChannel} />
					<StreamElementsPanel channel={this.props.channel} update={this.props.updateChannel} />
				</div>
			</div>
		)
	}
}

function headerMapStateToProps(state) {
	return {
		profile: state.profile
	};
}

export default connector(headerMapStateToProps)(ChannelIntegrationsPanel);