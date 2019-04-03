import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import HomePage from './routes/home-page';
import ProfilePage from './routes/profile-page';
import LandingPage from './routes/landing-page';
import ChannelPage from './routes/channel-page';
import TestPage from './routes/test-page';
import ManageChannelPage from './routes/manage-channel';
import ChannelDirectoryPage from './routes/channel-directory-page';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//Redux
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render((
	<BrowserRouter>
		<Provider store={store}>
			<App>
				<Switch>
	        		<Route path='/' exact component={LandingPage} />
	        		<Route path='/home' component={HomePage} />
					<Route path='/profile' component={ProfilePage} />
	        		<Route path='/directory' component={ChannelDirectoryPage} />
	        		<Route path='/channel/:channelid/manage' component={ManageChannelPage} />
	        		<Route path='/channel/:channelid' component={ChannelPage} />
	        		<Route path="/test" component={TestPage} />
	    		</Switch>
			</App>
		</Provider>
	</BrowserRouter>
), document.getElementById('root'));
