// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var Constants = require('../utils/constants.jsx');

export default class CustomThemeChooser extends React.Component {
    constructor(props) {
        super(props);

        this.updateThemeComponent = this.updateThemeComponent.bind(this);
        this.pasteBoxChange = this.pasteBoxChange.bind(this);

        this.state = {};
    }
    componentDidMount() {
        $('.color-picker').colorpicker().on('changeColor', this.updateThemeComponent);
    }
    updateThemeComponent(e) {
        const theme = this.props.theme;
        theme[e.target.id] = e.color.toHex();
        theme.type = 'custom';
        this.props.updateTheme(theme);
    }
    pasteBoxChange(e) {
        const text = e.target.value;

        if (text.length === 0) {
            return;
        }

        const colors = text.split(',');

        const theme = {type: 'custom'};
        let index = 0;
        Constants.THEME_ELEMENTS.forEach((element) => {
            if (index < colors.length) {
                theme[element.id] = colors[index];
            }
            index++;
        });

        this.props.updateTheme(theme);
    }
    render() {
        const theme = this.props.theme;

        const elements = [];
        let colors = '';
        Constants.THEME_ELEMENTS.forEach((element) => {
            elements.push(
                <div>
                    <label>{element.uiName}</label>
                    <input
                        id={element.id}
                        className='color-picker'
                        type='text'
                        value={theme[element.id]}
                    />
                </div>
            );

            colors += theme[element.id] + ',';
        });

        const pasteBox = (
            <div>
                {'Copy and paste to share theme colors:'}
                <br/>
                <input
                    type='text'
                    value={colors}
                    onChange={this.pasteBoxChange}
                />
            </div>
        );

        return (
            <div>
                {elements}
                <br/>
                {pasteBox}
            </div>
        );
    }
}

CustomThemeChooser.propTypes = {
    theme: React.PropTypes.object.isRequired,
    updateTheme: React.PropTypes.func.isRequired
};
