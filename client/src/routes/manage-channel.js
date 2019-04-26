import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import connector from '../redux/connector';
import {Link} from 'react-router-dom';

import Notice from '../components/notice';
import Template from '../components/template';
import Achievement from '../components/achievement';
import GiftAchievementModal from '../components/gift-achievement';


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

				let stateUpdate = {
					channel: res.data.channel,
					achievements: res.data.achievements,
					images: res.data.images,
					members: res.data.members
				};

				if(res.data.images.defaultIcon) {
					stateUpdate.iconPreview = res.data.images.defaultIcon;
				}

				this.setState(stateUpdate);
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

  	showGiftModal = () => {
  		
  		this.setState({
			isModalActive: true
		});	
		
	}

	hideGiftModal = () => {
		this.setState({
			isModalActive: false
		});
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

	handleIconChange = (event) => {
		let touched = this.state.touched || {};
		touched['icon'] = true;

		if(event.target.files[0]) {
			
			this.setState({
				iconPreview: URL.createObjectURL(event.target.files[0]),
				file: event.target.files[0],
				touched: touched
			});	
		} else {
			this.setState({
				iconPreview: '',
				file: '',
				touched: touched
			});
		}
		
	}

	handleSubmit = () => {

	}

	render() {

		if(this.props.profile && !this.props.profile.owner) {
			return (<Redirect to='/home' />);
		}

		let generalContent, achievementTab, imageContent, memberContent;

		if(this.state.channel) {

			let {logo, owner} = this.state.channel;
			let achievements = this.state.achievements;

			if(Array.isArray(this.state.filteredAchievements)) {

				achievements = this.state.filteredAchievements;
			}

			let customDefaultIcon;

			if(this.state.iconPreview) {
				customDefaultIcon = (
					<div className="customDefaultImg">
						<img alt="Default Icon" src={this.state.iconPreview} />
					</div>
				);
			} else {
				customDefaultIcon = (
					<div className="customDefaultImg no-default" onClick={() => { this.defaultIconInput.click() }}>
						<span>Click to Upload</span>
						<input
			                type="file"
			                name="defaultIcon"
			                id="default-icon"
			                accept="image/*"
			                className="default-icon--input"
			                ref={defaultIconInput =>
			                    (this.defaultIconInput = defaultIconInput)
			                }
			                onChange={this.handleIconChange}
			            />
					</div>
				);
			}

			generalContent = (
				<div className="general-configuration">
					<h4>Basic Info</h4>
					<div className="section-wrapper">
						<div className="section-label">
					        <label htmlFor="name">Twitch Name</label>
					    </div>
					    <div className="section-value">
					        <span name="name">{owner}</span>
					    </div>
					</div>
					<div className="section-wrapper">
						<div className="section-label">
					        <label htmlFor="logo">Channel Logo</label>
					    </div>
					    <div className="section-value">
					        <span name="logo"><img alt="" src={logo} /></span>
					    </div>
					</div>
					<h4>Channel Customization</h4>
					<form onSubmit={this.handleSubmit}>
						<div className="section-wrapper">
							<div className="section-label">
						        <label htmlFor="defaultIcon">Default Achievement Icon</label>
						    </div>
						    <div className="section-value default-icons">
						    	{customDefaultIcon}
						        <button type="button" className="default-icon--wrapper">
							        <img alt="" src="https://res.cloudinary.com/phirehero/image/upload/v1552923648/unearned.png" />
								</button>
								<button type="button" className="default-icon--wrapper">
							        <img alt="" src="https://res.cloudinary.com/phirehero/image/upload/v1552923648/unearned.png" />
								</button>
						    </div>
						</div>
						<div className="section-wrapper--end">
							 <input type="submit" value="Save" />
						</div>
					</form>
				</div>
			);

			let modal;

			if(this.state.isModalActive) {
				modal = (
					<GiftAchievementModal 
						active={this.state.isModalActive}
						onClose={this.hideGiftModal}
						onSubmit={this.hideGiftModal}
						members={this.state.members}
					/>
				);
			} else {
				modal = undefined;
			}

			if(achievements.length === 0 && !this.state.filteredAchievements) {
				achievementTab = (
					<div>
						<div onClick={() => {
							this.props.history.push('/manage/' + this.props.profile.username + '/achievement');
						}} className="add-achievement">
							<div>Add your first achievement!</div>
							<div><img alt="plus icon" src={require('../img/plus.png')} /></div>
						</div>
					</div>
				);
			} else {
				achievementTab = (
					<div>
						<div className="achievementsHeader">
							<h3>Showing {achievements.length} Achievements</h3>
							<div className="achievement-search">
								<input placeholder="Search for achievement..." type="text" onChange={this.filterList} />
							</div>
							<div className="achievementsHeader--add">
								<Link to={"/manage/" + this.props.profile.username + "/achievement"}>Add New...<div className="achievementsHeader--plus">
									<img alt="" src={require('../img/plus.png')} />
								</div></Link>
								
							</div>
						</div>
						{achievements.map((achievement, index) => (
							<Achievement 
								key={'achievement-' + index}
								editable={true}
								achievement={achievement}
								onGift={this.showGiftModal}
								onClick={() => {this.props.history.push('/manage/' + this.props.profile.username + '/achievement/' + achievement.uid)}}
							/>
						))}
						{modal}
					</div>
				);
			}

			imageContent = (
				<div>
					<div className="imageGallery">
						{this.state.images.gallery.map((image, index) => (
							<div key={'image-' + index} className="image--wrapper">
								<img alt="" src={image.url} />
								<div className="image--delete"></div>
							</div>
						))}
					</div>
				</div>
			);

			memberContent = (
				this.state.members.map((member, index) => (
					<div key={'member-' + index} className={"channelMember" + ((index % 2 === 1) ? " channelMember--stripe" : "")}>
						<div className="member-logo">
							<img alt="" src={member.logo} />
						</div>
						<div className="member-info">
							{member.name}
						</div>
					</div>
				))
			);
		} else {
			generalContent = (<div>Fetching General Information...</div>);
			achievementTab = (<div>Fetching Achievements...</div>);
			imageContent = (<div>Fetching Images...</div>);
			memberContent = (<div>Fetching Members...</div>);
		}

		const params = new URLSearchParams(this.props.location.search);
		const tab = params.get('tab');
		let tabIndex = 0;

		switch(tab) {
			case 'achievements':
				tabIndex = 1;
				break;
			case 'images':
				tabIndex = 2;
				break;
			case 'members':
				tabIndex = 3;
				break;
			default:
				break;
		}

		return (
			<Template>
				<div className="manage-container">
					<h2>Manage Channel</h2>
					<Notice message={this.state.notice} onClear={this.clearNotice} />
					<Tabs defaultIndex={tabIndex}>
						<TabList className="manage-tabs">
							<Tab className="manage-tab">General</Tab>
							<Tab className="manage-tab">Achievements</Tab>
							<Tab className="manage-tab">Images</Tab>
							<Tab className="manage-tab">Members</Tab>
						</TabList>
						<TabPanel>
							{generalContent}
						</TabPanel>
						<TabPanel>
							{achievementTab}
						</TabPanel>
						<TabPanel>
							{imageContent}
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