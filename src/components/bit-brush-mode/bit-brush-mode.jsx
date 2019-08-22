import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
// #endif
import brushIcon from './brush.svg';

const BitBrushModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.brush}
        imgSrc={brushIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitBrushModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitBrushModeComponent;
