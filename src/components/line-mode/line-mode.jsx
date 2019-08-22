import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
import lineIcon from './line-mobile.svg';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import lineIcon from './line.svg';
// #endif

const LineModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.line}
        imgSrc={lineIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

LineModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default LineModeComponent;
