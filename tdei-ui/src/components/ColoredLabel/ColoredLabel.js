import React from "react";

class ColoredLabel extends React.Component {
    render() {
        const {labelText, color} = this.props;

        const dotStyle = {
            height: '10px',
            width: '10px',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '5px', // Adjust spacing as needed
            backgroundColor: color // Use the color prop directly
        };

        return (
            <label>
                <span style={dotStyle}></span>
                {labelText}
            </label>
        );
    }
}

export default ColoredLabel;