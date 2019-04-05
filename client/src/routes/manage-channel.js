import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import connector from '../redux/connector';

import Notice from '../components/notice';
import Template from '../components/template';
import Achievement from '../components/achievement';
import AchievementEditModal from '../components/achievement-edit-modal';

import './manage-channel.css';

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

		axios.get('/api/channel/retrieve').then((res) => {
			console.log(res.data);

			if(res.data.error) {
				//redirect to home
			} else {
				this.setState({
					channel: res.data.channel,
					achievements: res.data.achievements
				});	
			}
		});
	}

	clearNotice = () => {
		this.setState({
			notice: ''
		});
	}

	filterList = (event) => {
	    var updatedList = this.state.achievements;

	    if(event.target.value === '') {
	    	//nothing in text box
	    	this.setState({filteredAchievements: false});
	    } else {
	    	updatedList = updatedList.filter(function(achievement){
		      return (achievement.title).toLowerCase().search(
		        event.target.value.toLowerCase()) !== -1;
		    });
		    
		    this.setState({filteredAchievements: updatedList});
	    }	    
  	}

  	showAchievementModal = (achievement) => {
  		
  		if(achievement) {
  			console.log(achievement);
  			this.setState({
  				isModalActive: true,
				editing: achievement,
				modalTitle: "Edit Achievement"
  			});
  		} else {
  			this.setState({
				isModalActive: true,
				editing: null,
				modalTitle: "Add New Achievement"
			});	
  		}
		
	}

	hideAchievementModal = () => {
		this.setState({
			isModalActive: false,
			edition: null
		});
	}

	updateAchievements = (data) => {
		if(data.notice) {
			this.setState({
				notice: data.notice
			});
		}
		if(data.delete) {
			//Achievement deleted, remove from list
			let currentAchievements = this.state.achievements;

			let updatedAchievements = currentAchievements.filter(achievement => {
				return achievement._id !== data.delete
			});

			this.setState({
				achievements: updatedAchievements
			});
		} else if(data.achievement) {

			let newAchievement = data.achievement;
			let currentAchievements = this.state.achievements;
			let found = false;

			currentAchievements.forEach((currentAchievement, index, arr) => {
				if(currentAchievement._id === newAchievement._id) {
					found = true;
					arr[index] = newAchievement;
				}
			});

			if(!found) {
				currentAchievements.push(newAchievement);	
			}
			
			this.setState({
				achievements: currentAchievements
			});
		}

	}

	render() {

		if(this.props.profile && !this.props.profile.owner) {
			return (<Redirect to='/home' />);
		}

		let generalContent, achievementContent, memberContent;

		if(this.state.channel) {

			let {logo, owner} = this.state.channel;
			let achievements = this.state.achievements;

			if(Array.isArray(this.state.filteredAchievements)) {

				achievements = this.state.filteredAchievements;
			}

			generalContent = (
				<div className="general-configuration">
					<h4>Basic Info</h4>
					<div class="section-wrapper">
						<div class="section-label">
					        <label for="name">Twitch Name</label>
					    </div>
					    <div class="section-value">
					        <span name="name">phirehero</span>
					    </div>
					</div>
					<div class="section-wrapper">
						<div class="section-label">
					        <label for="logo">Channel Logo</label>
					    </div>
					    <div class="section-value">
					        <span name="logo"><img src={logo} /></span>
					    </div>
					</div>
					<h4>Channel Customization</h4>
					<div class="section-wrapper">
						<div class="section-label">
					        <label for="theme">Default Achievement Icon</label>
					    </div>
					    <div class="section-value default-icons">
					        <button type="button" class="gallery-wrapper">
						        <img src="https://res.cloudinary.com/phirehero/image/upload/v1552923648/unearned.png" />
							</button>
							<button type="button" class="gallery-wrapper">
						        <img src="https://res.cloudinary.com/phirehero/image/upload/v1552923648/unearned.png" />
							</button>
							<button type="button" class="gallery-wrapper">
						        <img src="https://res.cloudinary.com/phirehero/image/upload/v1552923648/unearned.png" />
							</button>
					    </div>
					</div>
					<div class="section-wrapper">
						<div class="section-label">
					        <label for="theme">Theme</label>
					    </div>
					    <div class="section-value">
					        <select name="name">
					        	<option disabled selected>default (coming soon!!!)</option>
					        </select>
					    </div>
					</div>
				</div>
			);

			let modal;

			if(this.state.isModalActive) {
				modal = (
					<AchievementEditModal 
						active={this.state.isModalActive}
						onClose={this.hideAchievementModal}
						onSubmit={this.updateAchievements}
						achievement={this.state.editing}
						title={this.state.modalTitle}
					/>
				);
			} else {
				modal = undefined;
			}

			achievementContent = (
				<div>
					<div className="achievementsHeader">
						<h3>Showing {achievements.length} Achievements</h3>
						<div className="achievement-search">
							<input placeholder="Search for achievement..." type="text" onChange={this.filterList} />
						</div>
						<div className="achievementsHeader--add">
							<a onClick={() => (this.showAchievementModal())} href="javascript:;">Add New...</a>
							<div className="achievementHeader--plus">
								<img src={require('../img/plus.png')} />
							</div>
						</div>
					</div>
					{achievements.map((achievement, index) => (
						<Achievement 
							key={'achievement-' + index}
							editable={true}
							achievement={achievement}
							onClick={this.showAchievementModal}
						/>
					))}
					{modal}
				</div>
			);

			memberContent = (
				this.state.channel.members.map((member, index) => (
					<div key={'member-' + index} className={"channelMember" + ((index % 2 === 1) ? " channelMember--stripe" : "")}>
						<div className="member-logo">
							<img src={member.logo} />
						</div>
						<div className="member-info">
							{member.name}
						</div>
					</div>
				))
			);
		} else {
			generalContent = (<div>Fetching General Information...</div>);
			achievementContent = (<div>Fetching Achievements</div>);
			memberContent = (<div> Fetching Members...</div>);
		}

		return (
			<Template>
				<div className="manage-container">
					<h2>Manage Channel</h2>
					<Notice message={this.state.notice} onClear={this.clearNotice} />
					<Tabs>
						<TabList className="manage-tabs">
							<Tab className="manage-tab">General</Tab>
							<Tab className="manage-tab">Achievements</Tab>
							<Tab title="Coming Soon!" className="manage-tab" disabled={true}>Images</Tab>
							<Tab className="manage-tab">Members</Tab>
						</TabList>
						<TabPanel>
							{generalContent}
						</TabPanel>
						<TabPanel>
							{achievementContent}
						</TabPanel>
						<TabPanel>
							{generalContent}
						</TabPanel>
						<TabPanel>
							<h3>Members</h3>
							{memberContent}
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