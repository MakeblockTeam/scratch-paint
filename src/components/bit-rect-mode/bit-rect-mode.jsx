import React from 'react';
import PropTypes from 'prop-types';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
// #endif
import messages from '../../lib/messages.js';
import rectIcon from './rectangle.svg';

const BitRectComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.rect}
        imgSrc={rectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitRectComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitRectComponent;
