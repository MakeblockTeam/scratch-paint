import React from 'react';
import PropTypes from 'prop-types';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
// #endif
import messages from '../../lib/messages.js';
import textIcon from './text.svg';

const BitTextComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.text}
        imgSrc={textIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitTextComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitTextComponent;
