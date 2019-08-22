import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
import rectIcon from './rectangle-mobile.svg';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import rectIcon from './rectangle.svg';
// #endif

const RectModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.rect}
        imgSrc={rectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

RectModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default RectModeComponent;
