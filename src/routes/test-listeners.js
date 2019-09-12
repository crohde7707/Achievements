import React from 'react';
import axios from 'axios';

import './home-page.css';

import Template from '../components/template';

export default class TestListeners extends React.Component {

	constructor() {
		super();

		this.state = {
			channel: '',
			message: '',
			username: ''
		}
	}

	fixListeners = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/achievement/fixit', {},{
			withCredentials: true
		});
	}

	flushQueue = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/admin/flush', {}, {
			withCredentials: true
		});
	}

	fixSync = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/admin/fixpreferences', {}, {
			withCredentials: true
		});
	}

	testOverlay = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/admin/overlay', {}, {
			withCredentials: true
		})
	}

	addNotice = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/admin/notice', {}, {
			withCredentials: true
		});
	}

	sendTier2 = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/achievement/listeners', [{
				'channel': 'phirehero',
				'achievementID': '5d7667959823a97534d3b419',
				'tier': '3000',
				'userID': '70967393'
			}]);
	}

	sendTier3 = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/achievement/listeners', [{
			channel: 'phirehero',
			achievementID: '5d7667959823a97534d3b419',
			tier: "3000",
			user: 'phirehero' 
		}]);

	}

	sendData = () => {
		axios.post(process.env.REACT_APP_API_DOMAIN + 'api/test', {
			channel: this.state.channel,
			message: this.state.message,
			username: this.state.username
		}, {
			withCredentials: true
		}).then(res => {
			this.setState({
				channel: '',
				message: '',
				username: ''
			});
		});
	}

	handleDataChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;
		
		let stateUpdate = {};
		stateUpdate[name] = value

		this.setState(stateUpdate);
	}

	render() {

		return (
			<Template>
				<div className="main-content">
					<div>
						<label htmlFor="channel">Channel: </label>
						<input name="channel" value={this.state.channel} onChange={this.handleDataChange} type="text" />
					</div>
					<div>
						<label htmlFor="message">Message: </label>
						<input name="message" value={this.state.message} onChange={this.handleDataChange} type="text" />
					</div>
					<div>
						<label htmlFor="username">Username: </label>
						<input name="username" value={this.state.username} onChange={this.handleDataChange} type="text" />
					</div>
					<button onClick={this.sendData} type="button">Test</button>
					<div>
						<button onClick={this.fixListeners} type="button">Test IRC endpoint</button>
					</div>
					<div>
						<button onClick={this.flushQueue} type="button">Flush Queue</button>
					</div>
					<div>
						<button onClick={this.fixSync} type="button">Fix Sync</button>
					</div>
					<div>
						<button onClick={this.testOverlay} type="button">Test Overlay</button>
					</div>
					<div>
						<button onClick={this.addNotice} type="button">Add Notice</button>
					</div>
					<div>
						<h2>Test Achievement Types</h2>
						<button onClick={this.sendTier2} type="button">Send Tier 2</button>
						<button onClick={this.sendTier3} type="button">Send Tier 3</button>
					</div>
				</div>
			</Template>
		);
	}
}