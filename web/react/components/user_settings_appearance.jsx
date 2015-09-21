// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var UserStore = require('../stores/user_store.jsx');
var SettingItemMin = require('./setting_item_min.jsx');
var SettingItemMax = require('./setting_item_max.jsx');
var Client = require('../utils/client.jsx');
var Utils = require('../utils/utils.jsx');

var Themes = [];

var DefaultTheme = {};
DefaultTheme.type = 'default';
DefaultTheme.sidebarBg = '#fafafa';
Themes.push(DefaultTheme);

var SlackTheme = {};
SlackTheme.type = 'slack';
SlackTheme.sidebarBg = '#4D394B';
Themes.push(SlackTheme);

export default class UserSettingsAppearance extends React.Component {
    constructor(props) {
        super(props);

        this.submitTheme = this.submitTheme.bind(this);
        this.updateTheme = this.updateTheme.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        let user = UserStore.getCurrentUser();
        let theme = null;

        if (user.props && user.props.theme) {
            theme = user.props.theme;
        }

        return {theme};
    }
    submitTheme(e) {
        e.preventDefault();
        var user = UserStore.getCurrentUser();
        if (!user.props) {
            user.props = {};
        }
        user.props.theme = this.state.theme;

        Client.updateUser(user,
            function success() {
                this.props.updateSection('');
                window.location.reload();
            }.bind(this),
            function fail(err) {
                var state = this.getStateFromStores();
                state.serverError = err;
                this.setState(state);
            }.bind(this)
        );
    }
    updateTheme(e, type) {
        console.log(e);
        console.log(type);
        const theme = this.state.theme;
        theme[type] = e.target.value;
        this.setState({theme});
    }
    updateRadio(e, section) {
        console.log(e);
        console.log(section);
        const theme = this.state.theme;

        if (section === 'premade') {
            const user = UserStore.getCurrentUser();
            if (user.props.theme && user.props.theme.type) {
                theme.type = user.props.theme.type;
            } else {
                theme.type = 'default';
            }
        } else {
            theme.type = 'custom';
        }

        this.setState({theme});
    }
    handleClose() {
        this.setState({serverError: null});
        this.props.updateTab('general');
    }
    componentDidMount() {
        if (this.props.activeSection === 'theme') {
            $(React.findDOMNode(this.refs[this.state.theme])).addClass('active-border');
        }
        $('#user_settings').on('hidden.bs.modal', this.handleClose);
    }
    componentDidUpdate() {
        if (this.props.activeSection === 'theme') {
            $('.color-btn').removeClass('active-border');
            $(React.findDOMNode(this.refs[this.state.theme])).addClass('active-border');
        }
    }
    componentWillUnmount() {
        $('#user_settings').off('hidden.bs.modal', this.handleClose);
        this.props.updateSection('');
    }
    render() {
        var serverError;
        if (this.state.serverError) {
            serverError = this.state.serverError;
        }

        const theme = this.state.theme;
        console.log(theme);

        let customSection;
        let premadeSection;
        if (theme.type === 'custom') {
            customSection = (
                <input
                    type='text'
                    value={theme.sidebarBg}
                    onChange={this.updateTheme.bind(this, 'sidebarBg')}
                />
            );
        } else {
        }

        const themeUI = (
            <div className='section-max'>
                <div className='radio'>
                    <label>
                        <input type='radio'
                            checked={this.theme !== 'custom'}
                            onChange={this.updateRadio.bind(this, 'premade')}
                        >
                            {'Theme Colors'}
                        </input>
                    </label>
                    <br/>
                </div>
                {premadeSection}
                <div className='radio'>
                    <label>
                        <input type='radio'
                            checked={this.theme === 'custom'}
                            onChange={this.updateRadio.bind(this, 'custom')}
                        >
                            {'Custom Theme'}
                        </input>
                    </label>
                    <br/>
                </div>
                {customSection}
            </div>
        );

        return (
            <div>
                <div className='modal-header'>
                    <button
                        type='button'
                        className='close'
                        data-dismiss='modal'
                        aria-label='Close'
                    >
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    <h4
                        className='modal-title'
                        ref='title'
                    >
                        <i className='modal-back'></i>Appearance Settings
                    </h4>
                </div>
                <div className='user-settings'>
                    <h3 className='tab-header'>Appearance Settings</h3>
                    <div className='divider-dark first'/>
                    {themeUI}
                    <div className='divider-dark'/>
                </div>
            </div>
        );
    }
}

UserSettingsAppearance.defaultProps = {
    activeSection: ''
};
UserSettingsAppearance.propTypes = {
    activeSection: React.PropTypes.string,
    updateSection: React.PropTypes.func,
    updateTab: React.PropTypes.func
};
