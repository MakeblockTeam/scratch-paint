import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
import brushIcon from './brush-mobile.svg';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import brushIcon from './brush.svg';
// #endif


const BrushModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.brush}
        imgSrc={brushIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BrushModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BrushModeComponent;
