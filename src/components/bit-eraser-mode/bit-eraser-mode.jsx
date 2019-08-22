import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
// #endif
import eraserIcon from './eraser.svg';

const BitEraserComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.eraser}
        imgSrc={eraserIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitEraserComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitEraserComponent;
