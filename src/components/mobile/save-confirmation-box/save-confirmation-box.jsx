import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './save-confirmation-box.css';

const SaveConfirmationBox = (props) => {
    const { messages, OnUnSave, onSave, onClose } = props;
    return (
        <div className={(styles.modalContent)}>
            <ul className={styles.container}>
                <li className={classNames(styles.operate, styles.save)} onClick={onSave}>
                    {messages.save}
                </li>
                <li className={classNames(styles.operate, styles.unSave)} onClick={OnUnSave}>
                    {messages.unSave}
                </li>
                <li className={classNames(styles.operate, styles.cancel)} onClick={onClose}>
                    {messages.cancel}
                </li>
            </ul>
        </div>
    );
};

SaveConfirmationBox.propTypes = {};

export default SaveConfirmationBox;