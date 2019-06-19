import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearGradient} from '../reducers/selection-gradient-type';
import {clearSelection} from '../helper/selection';

import { showCrossLine, hideCrossLine} from '../helper/layer';

import CenterTool from '../helper/tools/center-tool';

import CenterModeComponent from '../components/center-mode/center-mode.jsx';

class CenterMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isCenterModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        
        if (nextProps.isCenterModeActive && !this.props.isCenterModeActive) {
            this.activateTool();
        } else if (!nextProps.isCenterModeActive && this.props.isCenterModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isCenterModeActive !== this.props.isCenterModeActive;
    }
    componentWillUnmount () {
      this.deactivateTool();
    }
    activateTool () {
      clearSelection(this.props.clearSelectedItems);
      this.props.clearGradient();
      this.tool = new CenterTool(this.props.onUpdateRotateCenter,this.props.onUpdateImage, Modes.CENTER);
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
                isSelected={this.props.isCenterModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

CenterMode.propTypes = {
    centerModeState: PropTypes.shape({
        centerSize: PropTypes.number.isRequired
    }),
    clearGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isCenterModeActive: PropTypes.bool.isRequired,
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    centerModeState: state.scratchPaint.centerMode,
    isCenterModeActive: state.scratchPaint.mode === Modes.CENTER,
    mode: state.scratchPaint.mode
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
      dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.CENTER));
    },
  
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CenterMode);
