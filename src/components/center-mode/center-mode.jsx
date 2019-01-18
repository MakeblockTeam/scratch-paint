import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import centerIcon from './center.svg';

const CenterModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.center}
        imgSrc={centerIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

CenterModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default CenterModeComponent;
