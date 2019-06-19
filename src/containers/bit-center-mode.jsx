import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import Modes from '../lib/modes';

import { showCrossLine, hideCrossLine} from '../helper/layer';

import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearGradient} from '../reducers/selection-gradient-type';
import {clearSelection} from '../helper/selection';

import CenterTool from '../helper/tools/center-tool';

import CenterModeComponent from '../components/center-mode/center-mode.jsx';

class BitCenterMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isBitCenterModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.isBitCenterModeActive && !this.props.isBitCenterModeActive) {
            this.activateTool();
        } else if (!nextProps.isBitCenterModeActive && this.props.isBitCenterModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isBitCenterModeActive !== this.props.isBitCenterModeActive;
    }
    componentWillUnmount () {
            this.deactivateTool();
    }
    activateTool () {
      clearSelection(this.props.clearSelectedItems);
      this.props.clearGradient();
      this.tool = new CenterTool(this.props.onUpdateRotateCenter, this.props.onUpdateImage, Modes.BIT_CENTER);
      this.tool.activate();
      showCrossLine()
    }

    deactivateTool () {
      this.tool = null;
      hideCrossLine()
    }
    render () {
        return (
            <CenterModeComponent
                isSelected={this.props.isBitCenterModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

BitCenterMode.propTypes = {
    handleMouseDown: PropTypes.func.isRequired,
    isBitCenterModeActive: PropTypes.bool.isRequired,
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isBitCenterModeActive: state.scratchPaint.mode === Modes.BIT_CENTER,
    mode: state.scratchPaint.mode
});
const mapDispatchToProps = dispatch => ({
    clearGradient: () => {
        dispatch(clearGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_CENTER));
    },
    clearSelectedItems: () => {
      dispatch(clearSelectedItems());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitCenterMode);
