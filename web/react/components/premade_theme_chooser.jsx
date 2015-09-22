// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var Utils = require('../utils/utils.jsx');
var Constants = require('../utils/constants.jsx');

export default class PremadeThemeChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const theme = this.props.theme;

        const premadeThemes = [];
        for (const k in Constants.THEMES) {
            if (Constants.THEMES.hasOwnProperty(k)) {
                const premadeTheme = $.extend(true, {}, Constants.THEMES[k]);

                let activeClass = '';
                if (premadeTheme.type === theme.type) {
                    activeClass = 'active-border';
                }

                premadeThemes.push(
                    <div
                        className={activeClass}
                        onClick={() => this.props.updateTheme(premadeTheme)}
                    >
                        <label>
                            <img src='/static/images/icon50x50.gif'/>
                            {Utils.toTitleCase(premadeTheme.type)}
                        </label>
                    </div>
                );
            }
        }

        return (
            <div>
                {premadeThemes}
            </div>
        );
    }
}

PremadeThemeChooser.propTypes = {
    theme: React.PropTypes.object.isRequired,
    updateTheme: React.PropTypes.func.isRequired
};
