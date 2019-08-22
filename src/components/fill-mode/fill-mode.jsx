import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
import fillIcon from './fill-mobile.svg';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import fillIcon from './fill.svg';
// #endif


const FillModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.fill}
        imgSrc={fillIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

FillModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default FillModeComponent;
