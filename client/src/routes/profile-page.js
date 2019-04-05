import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import connector from '../redux/connector';

import Notice from '../components/notice';
import Template from '../components/template';

import './profile-page.css';

class ManageChannel extends React.Component {

	constructor() {
		super();

		this.state = {
			channel: '',
			achievements: '',
			notice: ''
		};
	}

	componentDidMount() {

		axios.get('/api/profile').then((res) => {
			console.log(res.data);

			this.setState({
				channels: res.data
			});	
		});
	}

	clearNotice = () => {
		this.setState({
			notice: ''
		});
	}

	filterList = (event) => {
	    var updatedList = this.state.channels;

	    if(event.target.value === '') {
	    	//nothing in text box
	    	this.setState({filteredChannels: false});
	    } else {
	    	updatedList = updatedList.filter(function(channel){
		      return (channel.owner).toLowerCase().search(
		        event.target.value.toLowerCase()) !== -1;
		    });
		    
		    this.setState({filteredChannels: updatedList});
	    }	    
  	}

	render() {

		let integrationContent, channelContent, patreonContent;

		if(this.state.channels && this.props.profile) {

			let {logo, username, patreon} = this.props.profile;
			let channels = this.state.channels;

			if(Array.isArray(this.state.filteredChannels)) {

				channels = this.state.filteredChannels;
			}

			console.log(channels);

			if(patreon) {
				patreonContent = (
					<div className="integration integration--patreon">
						<div className="integration-header">
							<img src={require('../img/patreon-icon.png')} />
							<h3>Patreon</h3>
							<div className="integration-sync">
								<a href="javascript:;"><img src={require('../img/sync-white.png')} /></a>
							</div>
						</div>
						<div className="integration-content">
							<div className="channelInfo--logo">
								<img src={logo} />
							</div>
							<div className="channelInfo--data">
								<div className="channelInfo--name">{username}</div>
								<div className="channelInfo--link">{'twitch.tv/' + username}</div>
							</div>
						</div>
					</div>
				);
			} else {
				patreonContent = (
					<div className="integration integration--patreon not-linked">
						<a className="patreonLink" href="javascript:;">
							<img src={require('../img/patreon-badge.png')} />
						    <span>Link Your Patreon</span>
					    </a>
				    </div>
				);
			}

			integrationContent = (
				<div>
					<div className="integration integration--twitch">
						<div className="integration-header">
							<img src={require('../img/twitch-glitch.png')} />
							<h3>Twitch</h3>
							<div className="integration-sync">
								<a href="javascript:;"><img src={require('../img/sync-white.png')} /></a>
							</div>
						</div>
						<div className="integration-content">
							<div className="channelInfo--logo">
								<img src={logo} />
							</div>
							<div className="channelInfo--data">
								<div className="channelInfo--name">{username}</div>
								<div className="channelInfo--link">{'twitch.tv/' + username}</div>
							</div>
						</div>
					</div>
					{patreonContent}
				</div>
			);

			channelContent = (
				<div className="profile--channels">
					<div className="achievementsHeader">
						<h3>Showing {channels.length} Channels</h3>
						<div className="achievement-search">
							<input placeholder="Search for channel..." type="text" onChange={this.filterList} />
						</div>
					</div>
					{channels.map((channel, index) => (
						<div key={"channel." + index} className="channel-item">
							<div className="channel-item--logo"><img src={channel.logo} /></div>
							<div className="channel-item--name">{channel.owner}</div>
							
						</div>
					))}
				</div>
			);

		} else {
			integrationContent = (<div>Fetching Integration...</div>);
			channelContent = (<div>Fetching Channels...</div>);
		}

		return (
			<Template>
				<div className="manage-container">
					<h2>Profile</h2>
					<Notice message={this.state.notice} onClear={this.clearNotice} />
					<Tabs>
						<TabList className="manage-tabs">
							<Tab className="manage-tab">Integration</Tab>
							<Tab className="manage-tab">Channels</Tab>
						</TabList>
						<TabPanel>
							{integrationContent}
						</TabPanel>
						<TabPanel>
							{channelContent}
						</TabPanel>
					</Tabs>
				</div>
			</Template>
		);
	}
}

function headerMapStateToProps(state) {
	return {
		profile: state.profile
	};
}

export default connector(headerMapStateToProps)(ManageChannel);

//export default ManageChannel;