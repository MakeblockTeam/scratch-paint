import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
// #if MOBILE
import ToolSelectComponent from '../tool-select-base/tool-select-base.mobile.jsx';
import selectIcon from './select-mobile.svg';
// #else
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import selectIcon from './select.svg';
// #endif


const SelectModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.select}
        imgSrc={selectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

SelectModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default SelectModeComponent;
