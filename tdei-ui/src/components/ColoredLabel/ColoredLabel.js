import React from "react";

class ColoredLabel extends React.Component {
    render() {
        const {labelText, color} = this.props;

        const dotStyle = {
            height: '14px',
            width: '14px',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '8px', // Adjust spacing as needed
            backgroundColor: color // Use the color prop directly
        };
        const statusLabel = {
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: '600'
        }

        return (
            <div style={statusLabel}>
                <span style={dotStyle}></span>
                {labelText}
            </div>
        );
    }
}

export default ColoredLabel;