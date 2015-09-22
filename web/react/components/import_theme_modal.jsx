// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

const Utils = require('../utils/utils.jsx');
var Modal = ReactBootstrap.Modal;

export default class ImportThemeModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            inputError: ''
        };
    }
    handleSubmit(e) {
        e.preventDefault();

        const text = e.target.value;

        if (!this.isInputValid(text)) {
            return;
        }

        const colors = text.split(',');
        const theme = {type: 'custom'};

        theme.sidebarBg = colors[0];
        theme.linkColor = colors[7];
        // asaad add the rest of the slack to mattermost color conversions here

        this.props.updateTheme(theme);
    }
    isInputValid(text) {
        let isValid = true;

        if (text.indexOf(' ') !== -1) {
            isValid = false;
        }

        if (text.length > 0 && text.indexOf(',') === -1) {
            isValid = false;
        }

        if (text.length > 0) {
            const colors = text.split(',');

            if (colors.length !== 8) {
                isValid = false;
            } else {
                for (let i = 0; i < colors.length; i++) {
                    if (colors[i].length !== 7 && colors[i].length !== 4) {
                        isValid = false;
                    }

                    if (colors[i].charAt(0) !== '#') {
                        isValid = false;
                    }
                }
            }
        }

        return isValid;
    }
    handleChange(e) {
        if (this.isValid(e.target.value)) {
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
                    show={this.props.show}
                    onHide={this.props.onModalDismissed}
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
                                onClick={this.props.onModalDismissed}
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

ImportThemeModal.defaultProps = {
    show: false
};
ImportThemeModal.propTypes = {
    show: React.PropTypes.bool.isRequired,
    updateTheme: React.PropTypes.func.isRequired,
    onModalDismissed: React.PropTypes.func.isRequired
};
