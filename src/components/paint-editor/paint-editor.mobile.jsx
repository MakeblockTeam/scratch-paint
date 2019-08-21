import paper from '@scratch/paper';
import classNames from 'classnames';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

import PaperCanvas from '../../containers/paper-canvas.mobile.jsx';
import ScrollableCanvas from '../../containers/scrollable-canvas.jsx';

import BitBrushMode from '../../containers/bit-brush-mode.jsx';
import BitLineMode from '../../containers/bit-line-mode.jsx';
import BitOvalMode from '../../containers/bit-oval-mode.jsx';
import BitRectMode from '../../containers/bit-rect-mode.jsx';
import BitFillMode from '../../containers/bit-fill-mode.jsx';
import BitEraserMode from '../../containers/bit-eraser-mode.jsx';
import BitSelectMode from '../../containers/bit-select-mode.jsx';
import BitCenterMode from '../../containers/bit-center-mode.jsx';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import ButtonGroup from '../button-group/button-group.jsx';
import BrushMode from '../../containers/brush-mode.jsx';
import EraserMode from '../../containers/eraser-mode.jsx';
import FillColorIndicatorComponent from '../../containers/fill-color-indicator.jsx';
import FillMode from '../../containers/fill-mode.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LineMode from '../../containers/line-mode.jsx';
import Loupe from '../loupe/loupe.jsx';
import FixedToolsContainer from '../../containers/fixed-tools.jsx';
import ModeToolsContainer from '../../containers/mode-tools.jsx';
import OvalMode from '../../containers/oval-mode.jsx';
import RectMode from '../../containers/rect-mode.jsx';
import ReshapeMode from '../../containers/reshape-mode.jsx';
import SelectMode from '../../containers/select-mode.jsx';
import StrokeColorIndicatorComponent from '../../containers/stroke-color-indicator.jsx';
import StrokeWidthIndicatorComponent from '../../containers/stroke-width-indicator.jsx';
import TextMode from '../../containers/text-mode.jsx';
import CenterMode from '../../containers/center-mode.jsx';

import Formats from '../../lib/format';
import { isBitmap, isVector } from '../../lib/format';
import styles from './paint-editor.mobile.css';

import bitmapIcon from './icons/bitmap.svg';
import zoomInIcon from './icons/zoom-in.svg';
import zoomOutIcon from './icons/zoom-out.svg';
import zoomResetIcon from './icons/zoom-reset.svg';
import closeIcon from './icons/close.svg';
import doneIcon from './icons/done.svg';

const messages = defineMessages({
    bitmap: {
        defaultMessage: 'Convert to Bitmap',
        description: 'Label for button that converts the paint editor to bitmap mode',
        id: 'paint.paintEditor.bitmap'
    },
    vector: {
        defaultMessage: 'Convert to Vector',
        description: 'Label for button that converts the paint editor to vector mode',
        id: 'paint.paintEditor.vector'
    }
});

class PaintEditorComponent extends React.Component {
    componentDidMount() {
        const canvasAreaRect = this.paintCanvasAreaEle.getBoundingClientRect();
        window.artBoardWidth = canvasAreaRect.width;
        window.artBoardHeight = canvasAreaRect.height;
    }

    render() {
        return (
            <div
                className={styles.editorContainer}
                dir={this.props.rtl ? 'rtl' : 'ltr'}
            >
                <header className={styles.header}>
                    <img
                        className={styles.icon}
                        draggable={false}
                        src={closeIcon}
                    />
                    <span>造型设置</span>
                    <img
                        className={styles.icon}
                        draggable={false}
                        src={doneIcon}
                    />
                </header>
                <div className={styles.paintArea}>
                    <div className={styles.left}>
                        {/* Modes */}
                        {this.props.canvas !== null && isVector(this.props.format) ? ( // eslint-disable-line no-negated-condition
                            <div className={styles.modeSelector}>
                                <SelectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <ReshapeMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BrushMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <EraserMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <FillMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <TextMode
                                    textArea={this.props.textArea}
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <LineMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <OvalMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <RectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <CenterMode
                                    onUpdateImage={this.props.onUpdateImage}
                                    onUpdateRotateCenter={this.props.onUpdateRotateCenter}
                                />
                            </div>
                        ) : null}

                        {this.props.canvas !== null && isBitmap(this.props.format) ? ( // eslint-disable-line no-negated-condition
                            <div className={styles.modeSelector}>
                                <BitBrushMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitLineMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitOvalMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitRectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <TextMode
                                    isBitmap
                                    textArea={this.props.textArea}
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitFillMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitEraserMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitSelectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitCenterMode
                                    onUpdateImage={this.props.onUpdateImage}
                                    onUpdateRotateCenter={this.props.onUpdateRotateCenter}
                                />

                            </div>
                        ) : null}
                    </div>
                    <div
                        className={styles.canvasArea}
                        ref={ele => { this.paintCanvasAreaEle = ele }}
                    >
                        <ScrollableCanvas
                            canvas={this.props.canvas}
                            hideCursor={this.props.isEyeDropping}
                            style={styles.canvasContainer}
                        >
                            <PaperCanvas
                                canvasRef={this.props.setCanvas}
                                image={this.props.image}
                                imageFormat={this.props.imageFormat}
                                imageId={this.props.imageId}
                                rotationCenterX={this.props.rotationCenterX}
                                rotationCenterY={this.props.rotationCenterY}
                                zoomLevelId={this.props.zoomLevelId}
                                onUpdateImage={this.props.onUpdateImage}
                            />
                            <textarea
                                className={styles.textArea}
                                ref={this.props.setTextArea}
                                spellCheck={false}
                            />
                            {this.props.isEyeDropping &&
                                this.props.colorInfo !== null &&
                                !this.props.colorInfo.hideLoupe ? (
                                    <Box className={styles.colorPickerWrapper}>
                                        <Loupe
                                            colorInfo={this.props.colorInfo}
                                            pixelRatio={paper.project.view.pixelRatio}
                                        />
                                    </Box>
                                ) : null
                            }
                        </ScrollableCanvas>
                    </div>
                    <div className={styles.right}></div>
                </div>
            </div>
        )
    }
}

PaintEditorComponent.propTypes = {
    canRedo: PropTypes.func.isRequired,
    canUndo: PropTypes.func.isRequired,
    canvas: PropTypes.instanceOf(Element),
    colorInfo: Loupe.propTypes.colorInfo,
    format: PropTypes.oneOf(Object.keys(Formats)),
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(HTMLImageElement)
    ]),
    imageFormat: PropTypes.string,
    imageId: PropTypes.string,
    intl: intlShape,
    isEyeDropping: PropTypes.bool,
    name: PropTypes.string,
    onRedo: PropTypes.func.isRequired,
    onSwitchToBitmap: PropTypes.func.isRequired,
    onSwitchToVector: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    onZoomIn: PropTypes.func.isRequired,
    onZoomOut: PropTypes.func.isRequired,
    onZoomReset: PropTypes.func.isRequired,
    rotationCenterX: PropTypes.number,
    rotationCenterY: PropTypes.number,
    rtl: PropTypes.bool,
    setCanvas: PropTypes.func.isRequired,
    setTextArea: PropTypes.func.isRequired,
    textArea: PropTypes.instanceOf(Element),
    zoomLevelId: PropTypes.string
};

export default injectIntl(PaintEditorComponent);
