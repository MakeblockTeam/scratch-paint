import paper from '@scratch/paper';
import PropTypes from 'prop-types';

import React from 'react';
import PaintEditorComponent from '../components/paint-editor/paint-editor.jsx';

import {changeMode} from '../reducers/modes';
import {changeFormat} from '../reducers/format';
import {undo, redo, undoSnapshot} from '../reducers/undo';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {deactivateEyeDropper} from '../reducers/eye-dropper';
import {setTextEditTarget} from '../reducers/text-edit-target';
import {updateViewBounds} from '../reducers/view-bounds';

import {getRaster, hideGuideLayers, showGuideLayers} from '../helper/layer';
import {trim} from '../helper/bitmap';
import {performUndo, performRedo, performSnapshot, shouldShowUndo, shouldShowRedo} from '../helper/undo';
import {bringToFront, sendBackward, sendToBack, bringForward} from '../helper/order';
import {groupSelection, ungroupSelection} from '../helper/group';
import {scaleWithStrokes} from '../helper/math';
import {getSelectedLeafItems} from '../helper/selection';
import {resetZoom, zoomOnSelection} from '../helper/view';
import EyeDropperTool from '../helper/tools/eye-dropper';

import Modes from '../lib/modes';
import Formats from '../lib/format';
import {isBitmap, isVector} from '../lib/format';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

class PaintEditor extends React.Component {
    static get ZOOM_INCREMENT () {
        return 0.5;
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUpdateImage',
            'handleUndo',
            'handleRedo',
            'handleSendBackward',
            'handleSendForward',
            'handleSendToBack',
            'handleSendToFront',
            'handleGroup',
            'handleUngroup',
            'handleZoomIn',
            'handleZoomOut',
            'handleZoomReset',
            'canRedo',
            'canUndo',
            'switchMode',
            'onMouseDown',
            'setCanvas',
            'setTextArea',
            'startEyeDroppingLoop',
            'stopEyeDroppingLoop'
        ]);
        this.state = {
            canvas: null,
            colorInfo: null
        };
    }
    componentDidMount () {
        document.addEventListener('keydown', (/* event */) => {
            // Don't activate keyboard shortcuts during text editing
            if (!this.props.textEditing) {
                // @todo disabling keyboard shortcuts because there is a bug
                // that is interfering with text editing.
                // this.props.onKeyPress(event);
            }
        });
        // document listeners used to detect if a mouse is down outside of the
        // canvas, and should therefore stop the eye dropper
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('touchstart', this.onMouseDown);
    }
    componentDidUpdate (prevProps) {
        if (this.props.isEyeDropping && !prevProps.isEyeDropping) {
            this.startEyeDroppingLoop();
        } else if (!this.props.isEyeDropping && prevProps.isEyeDropping) {
            this.stopEyeDroppingLoop();
        }

        if ((isVector(this.props.format) && isBitmap(prevProps.format)) ||
            (isVector(prevProps.format) && isBitmap(this.props.format))) {
            this.switchMode(this.props.format);
        }
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.props.onKeyPress);
        this.stopEyeDroppingLoop();
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('touchstart', this.onMouseDown);
    }
    switchMode (newFormat) {
        if (isVector(newFormat)) {
            switch (this.props.mode) {
            case Modes.BIT_BRUSH:
                this.props.changeMode(Modes.BRUSH);
                break;
            case Modes.BIT_LINE:
                this.props.changeMode(Modes.LINE);
                break;
            default:
                this.props.changeMode(Modes.BRUSH);
            }
        } else if (isBitmap(newFormat)) {
            switch (this.props.mode) {
            case Modes.BRUSH:
                this.props.changeMode(Modes.BIT_BRUSH);
                break;
            case Modes.LINE:
                this.props.changeMode(Modes.BIT_LINE);
                break;
            default:
                this.props.changeMode(Modes.BIT_BRUSH);
            }
        }
    }
    handleUpdateImage (skipSnapshot) {
        // Store the zoom/pan and restore it after snapshotting
        // TODO Only doing this because snapshotting at zoom/pan makes export wrong
        const oldZoom = paper.project.view.zoom;
        const oldCenter = paper.project.view.center.clone();
        resetZoom();

        let raster;
        if (isBitmap(this.props.format)) {
            raster = trim(getRaster());
            raster.remove();

            this.props.onUpdateImage(
                false /* isVector */,
                raster.canvas,
                paper.project.view.center.x - raster.bounds.x,
                paper.project.view.center.y - raster.bounds.y);
        } else if (isVector(this.props.format)) {
            const guideLayers = hideGuideLayers(true /* includeRaster */);

            // Export at 0.5x
            scaleWithStrokes(paper.project.activeLayer, .5, new paper.Point());
            const bounds = paper.project.activeLayer.bounds;

            this.props.onUpdateImage(
                true /* isVector */,
                paper.project.exportSVG({
                    asString: true,
                    bounds: 'content',
                    matrix: new paper.Matrix().translate(-bounds.x, -bounds.y)
                }),
                (paper.project.view.center.x / 2) - bounds.x,
                (paper.project.view.center.y / 2) - bounds.y);

            scaleWithStrokes(paper.project.activeLayer, 2, new paper.Point());
            paper.project.activeLayer.applyMatrix = true;

            showGuideLayers(guideLayers);
        }

        if (!skipSnapshot) {
            performSnapshot(this.props.undoSnapshot, this.props.format);
        }

        // Restore old zoom
        paper.project.view.zoom = oldZoom;
        paper.project.view.center = oldCenter;
    }
    handleUndo () {
        performUndo(this.props.undoState, this.props.onUndo, this.props.setSelectedItems, this.handleUpdateImage);
    }
    handleRedo () {
        performRedo(this.props.undoState, this.props.onRedo, this.props.setSelectedItems, this.handleUpdateImage);
    }
    handleGroup () {
        groupSelection(this.props.clearSelectedItems, this.props.setSelectedItems, this.handleUpdateImage);
    }
    handleUngroup () {
        ungroupSelection(this.props.clearSelectedItems, this.props.setSelectedItems, this.handleUpdateImage);
    }
    handleSendBackward () {
        sendBackward(this.handleUpdateImage);
    }
    handleSendForward () {
        bringForward(this.handleUpdateImage);
    }
    handleSendToBack () {
        sendToBack(this.handleUpdateImage);
    }
    handleSendToFront () {
        bringToFront(this.handleUpdateImage);
    }
    canUndo () {
        return shouldShowUndo(this.props.undoState);
    }
    canRedo () {
        return shouldShowRedo(this.props.undoState);
    }
    handleZoomIn () {
        zoomOnSelection(PaintEditor.ZOOM_INCREMENT);
        this.props.updateViewBounds(paper.view.matrix);
        this.props.setSelectedItems();
    }
    handleZoomOut () {
        zoomOnSelection(-PaintEditor.ZOOM_INCREMENT);
        this.props.updateViewBounds(paper.view.matrix);
        this.props.setSelectedItems();
    }
    handleZoomReset () {
        resetZoom();
        this.props.updateViewBounds(paper.view.matrix);
        this.props.setSelectedItems();
    }
    setCanvas (canvas) {
        this.setState({canvas: canvas});
        this.canvas = canvas;
    }
    setTextArea (element) {
        this.setState({textArea: element});
    }
    onMouseDown (event) {
        if (event.target === paper.view.element &&
                document.activeElement instanceof HTMLInputElement) {
            document.activeElement.blur();
        }

        if (event.target !== paper.view.element && event.target !== this.state.textArea) {
            // Exit text edit mode if you click anywhere outside of canvas
            this.props.removeTextEditTarget();
        }

        if (this.props.isEyeDropping) {
            const colorString = this.eyeDropper.colorString;
            const callback = this.props.changeColorToEyeDropper;

            this.eyeDropper.remove();
            if (!this.eyeDropper.hideLoupe) {
                // If not hide loupe, that means the click is inside the canvas,
                // so apply the new color
                callback(colorString);
            }
            this.props.previousTool.activate();
            this.props.onDeactivateEyeDropper();
            this.stopEyeDroppingLoop();
            this.setState({colorInfo: null});
        }
    }
    startEyeDroppingLoop () {
        this.eyeDropper = new EyeDropperTool(
            this.canvas,
            paper.project.view.bounds.width,
            paper.project.view.bounds.height,
            paper.project.view.pixelRatio,
            paper.view.zoom,
            paper.project.view.bounds.x,
            paper.project.view.bounds.y
        );
        this.eyeDropper.pickX = -1;
        this.eyeDropper.pickY = -1;
        this.eyeDropper.activate();
        
        this.intervalId = setInterval(() => {
            const colorInfo = this.eyeDropper.getColorInfo(
                this.eyeDropper.pickX,
                this.eyeDropper.pickY,
                this.eyeDropper.hideLoupe
            );
            if (!colorInfo) return;
            if (
                this.state.colorInfo === null ||
                this.state.colorInfo.x !== colorInfo.x ||
                this.state.colorInfo.y !== colorInfo.y
            ) {
                this.setState({
                    colorInfo: colorInfo
                });
            }
        }, 30);
    }
    stopEyeDroppingLoop () {
        clearInterval(this.intervalId);
    }
    render () {
        return (
            <PaintEditorComponent
                canRedo={this.canRedo}
                canUndo={this.canUndo}
                canvas={this.state.canvas}
                colorInfo={this.state.colorInfo}
                format={this.props.format}
                image={this.props.image}
                imageId={this.props.imageId}
                isEyeDropping={this.props.isEyeDropping}
                name={this.props.name}
                rotationCenterX={this.props.rotationCenterX}
                rotationCenterY={this.props.rotationCenterY}
                setCanvas={this.setCanvas}
                setTextArea={this.setTextArea}
                textArea={this.state.textArea}
                onGroup={this.handleGroup}
                onRedo={this.handleRedo}
                onSendBackward={this.handleSendBackward}
                onSendForward={this.handleSendForward}
                onSendToBack={this.handleSendToBack}
                onSendToFront={this.handleSendToFront}
                onSwitchToBitmap={this.props.handleSwitchToBitmap}
                onSwitchToVector={this.props.handleSwitchToVector}
                onUndo={this.handleUndo}
                onUngroup={this.handleUngroup}
                onUpdateImage={this.handleUpdateImage}
                onUpdateName={this.props.onUpdateName}
                onZoomIn={this.handleZoomIn}
                onZoomOut={this.handleZoomOut}
                onZoomReset={this.handleZoomReset}
            />
        );
    }
}

PaintEditor.propTypes = {
    changeColorToEyeDropper: PropTypes.func,
    changeMode: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    format: PropTypes.oneOf(Object.keys(Formats)),
    handleSwitchToBitmap: PropTypes.func.isRequired,
    handleSwitchToVector: PropTypes.func.isRequired,
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(HTMLImageElement)
    ]),
    imageId: PropTypes.string,
    isEyeDropping: PropTypes.bool,
    mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
    name: PropTypes.string,
    onDeactivateEyeDropper: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    previousTool: PropTypes.shape({ // paper.Tool
        activate: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired
    }),
    removeTextEditTarget: PropTypes.func.isRequired,
    rotationCenterX: PropTypes.number,
    rotationCenterY: PropTypes.number,
    setSelectedItems: PropTypes.func.isRequired,
    textEditing: PropTypes.bool.isRequired,
    undoSnapshot: PropTypes.func.isRequired,
    undoState: PropTypes.shape({
        stack: PropTypes.arrayOf(PropTypes.object).isRequired,
        pointer: PropTypes.number.isRequired
    }),
    updateViewBounds: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    changeColorToEyeDropper: state.scratchPaint.color.eyeDropper.callback,
    clipboardItems: state.scratchPaint.clipboard.items,
    format: state.scratchPaint.format,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    pasteOffset: state.scratchPaint.clipboard.pasteOffset,
    previousTool: state.scratchPaint.color.eyeDropper.previousTool,
    selectedItems: state.scratchPaint.selectedItems,
    textEditing: state.scratchPaint.textEditTarget !== null,
    undoState: state.scratchPaint.undo
});
const mapDispatchToProps = dispatch => ({
    onKeyPress: event => {
        if (event.key === 'e') {
            dispatch(changeMode(Modes.ERASER));
        } else if (event.key === 'b') {
            dispatch(changeMode(Modes.BRUSH));
        } else if (event.key === 'l') {
            dispatch(changeMode(Modes.LINE));
        } else if (event.key === 's') {
            dispatch(changeMode(Modes.SELECT));
        } else if (event.key === 'w') {
            dispatch(changeMode(Modes.RESHAPE));
        } else if (event.key === 'f') {
            dispatch(changeMode(Modes.FILL));
        } else if (event.key === 't') {
            dispatch(changeMode(Modes.TEXT));
        } else if (event.key === 'c') {
            dispatch(changeMode(Modes.OVAL));
        } else if (event.key === 'r') {
            dispatch(changeMode(Modes.RECT));
        }
    },
    changeMode: mode => {
        dispatch(changeMode(mode));
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    handleSwitchToBitmap: () => {
        dispatch(changeFormat(Formats.BITMAP));
    },
    handleSwitchToVector: () => {
        dispatch(changeFormat(Formats.VECTOR));
    },
    removeTextEditTarget: () => {
        dispatch(setTextEditTarget());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems()));
    },
    onDeactivateEyeDropper: () => {
        // set redux values to default for eye dropper reducer
        dispatch(deactivateEyeDropper());
    },
    onUndo: format => {
        dispatch(undo(format));
    },
    onRedo: format => {
        dispatch(redo(format));
    },
    undoSnapshot: snapshot => {
        dispatch(undoSnapshot(snapshot));
    },
    updateViewBounds: matrix => {
        dispatch(updateViewBounds(matrix));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaintEditor);
