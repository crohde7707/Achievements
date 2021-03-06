import React from 'react';
import axios from 'axios';
import io from "socket.io-client";
import Achievement from '../components/achievement';
import {Animated} from "react-animated-css";
import {Helmet} from 'react-helmet';

import './overlay-panel.css';

class OverlayPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			uid: props.match.params.uid,
			settings: {},
			alert: undefined
		}

		this._queue = [];
		this._alert = new Audio();
	}

	componentDidMount() {
		document.body.classList.add('no-background');
		document.getElementsByTagName('html')[0].classList.add('no-background');
		if(this.state.uid) {

			axios.get(process.env.REACT_APP_API_DOMAIN + 'api/channel/overlay', {
				params: {
					id: this.props.match.params.uid
				}
			}).then((res) => {
				this._alert.src = res.data.overlay.sfx;
				this._alert.volume = parseFloat(res.data.overlay.volume) / 100;
				this.setState({
					settings: res.data.overlay,
					icons: res.data.icons
				});
			});

			this._socket = io.connect(`${process.env.REACT_APP_SOCKET_DOMAIN}?uid=${this.state.uid}`, {
				reconnection: true,
				transports: ['websocket']
			});

			this._socket.on('alert-recieved', (alert) => {
				if(this._queue.length === 0) {
					this.queueAlert(alert);
					this.showAlert();
				} else {
					this.queueAlert(alert);	
				}
			});

			this._socket.on('update-settings', (settings) => {
				this._alert.src = settings.sfx;
				this._alert.volume = parseFloat(settings.volume) / 100;
				this.setState({
					settings
				});
			})
		} else {
			this.props.history.push('/home');
		}

		this.showAlert = () => {

			setTimeout(() => {
				if(this._queue.length > 0) {
					let alert = this._queue.shift();

					let achievement = {
						title: alert.title,
						description: alert.user,
						icon: alert.icon,
						unlocked: alert.unlocked
					}

					this.setState({
						alert: achievement,
						showAlert: true
					}, () => {
						this._alert.play();
						setTimeout(() => {
							this.setState({
								showAlert: false
							});
							
						}, (this.state.settings.duration * 1000) - 500);

						setTimeout(() => {
							this.setState({
								alert: undefined
							}, () => {
								if(this._queue.length > 0) {
									this.showAlert();
								}
							});
						}, this.state.settings.duration * 1000);
					});
				}
			}, this.state.settings.delay * 1000);
		}
	}

	queueAlert = (alert) => {
		this._queue.push(alert);
	}

	componentWillUnmount() {
		if(this._socket) {
			this._socket.close();
		}
	}

	render() {

		let alertContent, audioVolume, backgroundImage, styleSettings;

		if(this.state.settings.custom) {
			if(this.state.settings.graphic) {
				backgroundImage = (<img className="background" alt="" src={this.state.settings.graphic} />);
			}

			let {layout, textColor, titleFontSize, showDescription, descFontSize} = this.state.settings;

			styleSettings = {
				layout,
				textColor,
				titleFontSize,
				showDescription,
				descFontSize
			};
		}

		if(this.state.alert) {
			alertContent = (
				<div className="overlay-container achievement-theme">
						<Animated
							animationIn={this.state.settings.enterEffect}
							animationOut={this.state.settings.exitEffect}
							animationInDuration={400}
							animationOutDuration={400}
							isVisible={this.state.showAlert}
							className="alert-overlay"
							animateOnMount={true}
						>
							<div className="overlay--content" style={styleSettings}>
								{backgroundImage}
								<Achievement 
									achievement={this.state.alert}
									defaultIcons={this.state.icons}
									unlocked={this.state.alert.unlocked}
									earned={true}
									noDrag={true}
									noBackground={this.state.settings.custom}
									styles={styleSettings}
								/>
							</div>
						</Animated>
				</div>
			)
		}

		return (
			<React.Fragment>
				<Helmet>
      				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css" />
      			</Helmet>
				<div id={this.state.uid} className="overlay-wrapper">
					{alertContent}
				</div>
			</React.Fragment>
		);
	}
}

export default OverlayPanel;