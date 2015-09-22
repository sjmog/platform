// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

const UserStore = require('../stores/user_store.jsx');
const Utils = require('../utils/utils.jsx');
const Client = require('../utils/client.jsx');
const Modal = ReactBootstrap.Modal;

const AppDispatcher = require('../dispatcher/app_dispatcher.jsx');
const Constants = require('../utils/constants.jsx');
const ActionTypes = Constants.ActionTypes;

export default class ImportThemeModal extends React.Component {
    constructor(props) {
        super(props);

        this.updateShow = this.updateShow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            inputError: '',
            show: false
        };
    }
    componentDidMount() {
        UserStore.addImportModalListener(this.updateShow);
    }
    componentWillUnmount() {
        UserStore.removeImportModalListener(this.updateShow);
    }
    updateShow(show) {
        this.setState({show});
    }
    handleSubmit(e) {
        e.preventDefault();

        const text = React.findDOMNode(this.refs.input).value;

        if (!this.isInputValid(text)) {
            console.log(text);
            this.setState({inputError: 'Invalid format, please try copying and pasting in again.'});
            return;
        }

        const colors = text.split(',');
        const theme = {type: 'custom'};

        theme.sidebarBg = colors[0];
        theme.linkColor = colors[7];
        // asaad add the rest of the slack to mattermost color conversions here

        let user = UserStore.getCurrentUser();
        user.theme_props = theme;

        Client.updateUser(user,
            (data) => {
                AppDispatcher.handleServerAction({
                    type: ActionTypes.RECIEVED_ME,
                    me: data
                });

                this.setState({show: false});
                Utils.applyTheme(theme);
                $('#user_settings').modal('show');
            },
            (err) => {
                var state = this.getStateFromStores();
                state.serverError = err;
                this.setState(state);
            }
        );
    }
    isInputValid(text) {
        if (text.length === 0) {
            return false;
        }

        if (text.indexOf(' ') !== -1) {
            return false;
        }

        if (text.length > 0 && text.indexOf(',') === -1) {
            return false;
        }

        if (text.length > 0) {
            const colors = text.split(',');

            if (colors.length !== 8) {
                return false;
            }

            for (let i = 0; i < colors.length; i++) {
                if (colors[i].length !== 7 && colors[i].length !== 4) {
                    return false;
                }

                if (colors[i].charAt(0) !== '#') {
                    return false;
                }
            }
        }

        return true;
    }
    handleChange(e) {
        if (this.isInputValid(e.target.value)) {
            this.setState({inputError: null});
        } else {
            this.setState({inputError: 'Invalid format, please try copying and pasting in again.'});
        }
    }
    render() {
        // asaad this control needs UI work
        return (
            <span>
                <Modal
                    show={this.state.show}
                    onHide={() => this.setState({show: false})}
                >
                    <Modal.Header closeButton={true}>
                        <Modal.Title>{'Import Slack Theme'}</Modal.Title>
                    </Modal.Header>
                    <form
                        role='form'
                        className='form-horizontal'
                    >
                        <Modal.Body>
                            <div>
                                {'To import a theme, go to a Slack team and look for “”Preferences” -> Sidebar Theme”. Open the custom theme option, copy the theme color values and paste them here:'}
                                <br/>
                                <input
                                    ref='input'
                                    type='text'
                                    onChange={this.handleChange}
                                />
                                {this.state.inputError}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                type='button'
                                className='btn btn-default'
                                onClick={() => this.setState({show: false})}
                            >
                                {'Cancel'}
                            </button>
                            <button
                                onClick={this.handleSubmit}
                                type='submit'
                                className='btn btn-primary'
                                tabIndex='3'
                            >
                                {'Submit'}
                            </button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </span>
        );
    }
}
