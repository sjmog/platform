// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var UserStore = require('../stores/user_store.jsx');
var Client = require('../utils/client.jsx');
var Constants = require('../utils/constants.jsx');
var Utils = require('../utils/utils.jsx');
var CustomThemeChooser = require('./custom_theme_chooser.jsx');
var PremadeThemeChooser = require('./premade_theme_chooser.jsx');
var ImportThemeModal = require('./import_theme_modal.jsx');

export default class UserSettingsAppearance extends React.Component {
    constructor(props) {
        super(props);

        this.submitTheme = this.submitTheme.bind(this);
        this.updateTheme = this.updateTheme.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleImportModal = this.handleImportModal.bind(this);

        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        const user = UserStore.getCurrentUser();
        let theme = null;

        if ($.isPlainObject(user.theme_props)) {
            theme = user.theme_props;
        } else {
            theme = $.extend(true, {}, Constants.THEMES.default);
        }

        let type = 'premade';
        if (theme.type === 'custom') {
            type = 'custom';
        }

        return {theme, type, showImportModal: false};
    }
    submitTheme(e) {
        e.preventDefault();
        var user = UserStore.getCurrentUser();
        user.theme_props = this.state.theme;

        Client.updateUser(user,
            () => {
                $('#user_settings').off('hidden.bs.modal', this.handleClose);
                this.props.updateTab('general');
                $('#user_settings').modal('hide');
            },
            (err) => {
                var state = this.getStateFromStores();
                state.serverError = err;
                this.setState(state);
            }
        );
    }
    updateTheme(theme) {
        this.setState({theme});
        Utils.applyTheme(theme);
    }
    updateType(type) {
        this.setState({type});
    }
    handleClose() {
        const state = this.getStateFromStores();
        state.serverError = null;

        Utils.applyTheme(state.theme);

        this.setState(state);
        this.props.updateTab('general');
        $('#user_settings').modal('hide');
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
    }
    handleImportModal() {
        this.setState({showImportModal: true});
    }
    render() {
        // asaad this control needs UI work
        var serverError;
        if (this.state.serverError) {
            serverError = this.state.serverError;
        }

        const displayCustom = this.state.type === 'custom';

        let custom;
        let premade;
        if (displayCustom) {
            custom = (
                <CustomThemeChooser
                    theme={this.state.theme}
                    updateTheme={this.updateTheme}
                />
            );
        } else {
            premade = (
                <PremadeThemeChooser
                    theme={this.state.theme}
                    updateTheme={this.updateTheme}
                />
            );
        }

        const themeUI = (
            <div className='section-max'>
                <div className='radio'>
                    <label>
                        <input type='radio'
                            checked={!displayCustom}
                            onChange={this.updateType.bind(this, 'premade')}
                        >
                            {'Theme Colors'}
                        </input>
                    </label>
                    <br/>
                </div>
                {premade}
                <div className='radio'>
                    <label>
                        <input type='radio'
                            checked={displayCustom}
                            onChange={this.updateType.bind(this, 'custom')}
                        >
                            {'Custom Theme'}
                        </input>
                    </label>
                    <br/>
                </div>
                {custom}
                <hr />
                            {serverError}
                <a
                    className='btn btn-sm btn-primary'
                    href='#'
                    onClick={this.submitTheme}
                >
                    {'Submit'}
                </a>
                <a
                    className='btn btn-sm theme'
                    href='#'
                    onClick={this.handleClose}
                >
                    {'Cancel'}
                </a>
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
                        <span aria-hidden='true'>{'x'}</span>
                    </button>
                    <h4
                        className='modal-title'
                        ref='title'
                    >
                        <i className='modal-back'></i>{'Appearance Settings'}
                    </h4>
                </div>
                <div className='user-settings'>
                    <h3 className='tab-header'>{'Appearance Settings'}</h3>
                    <div className='divider-dark first'/>
                    {themeUI}
                    <div className='divider-dark'/>
                </div>
                <br/>
                <a
                    className='theme'
                    onClick={this.handleImportModal}
                >
                    {'Import from Slack'}
                </a>
                <ImportThemeModal
                    show={this.state.showImportModal}
                    updateTheme={this.updateTheme}
                    onModalDismissed={() => this.setState({showImportModal: false})}
                />
            </div>
        );
    }
}

UserSettingsAppearance.defaultProps = {
    activeSection: ''
};
UserSettingsAppearance.propTypes = {
    activeSection: React.PropTypes.string,
    updateTab: React.PropTypes.func
};
