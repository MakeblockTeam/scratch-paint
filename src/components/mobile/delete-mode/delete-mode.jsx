import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import messages from '../../../lib/messages.js';
import ToolSelectComponent from '../../tool-select-base/tool-select-base.mobile.jsx';
import deleteIcon from '../icons/delete-mobile.svg';
import styles from './delete-mode.css';


const SelectModeComponent = props => (
    <ToolSelectComponent
        className={classNames(styles.deleteIcon, {
            [styles.disabled]: props.disabled
        })}
        imgDescriptor={messages.select}
        isSelected={false}
        imgSrc={deleteIcon}
        onMouseDown={props.onDelete}
    />
);

SelectModeComponent.propTypes = {
    onDelete: PropTypes.func.isRequired
};

export default SelectModeComponent;
