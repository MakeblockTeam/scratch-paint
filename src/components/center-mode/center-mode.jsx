import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
import centerIcon from './center-mobile.svg';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import centerIcon from './center.svg';
// #endif

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
