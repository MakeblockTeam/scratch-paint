import paper from '@scratch/paper';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

import PaperCanvas from '../../containers/paper-canvas.jsx';
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
// import FillColorIndicatorComponent from '../../containers/fill-color-indicator.jsx';
import FillMode from '../../containers/fill-mode.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LineMode from '../../containers/line-mode.jsx';
import Loupe from '../loupe/loupe.jsx';
import FixedToolsContainer from '../../containers/fixed-tools.jsx';
// import ModeToolsContainer from '../../containers/mode-tools.jsx';
import OvalMode from '../../containers/oval-mode.jsx';
import RectMode from '../../containers/rect-mode.jsx';
// import ReshapeMode from '../../containers/reshape-mode.jsx';
import SelectMode from '../../containers/select-mode.jsx';
import DeleteMode from '../mobile/delete-mode/delete-mode.jsx';
import SaveConfirmationBox from '../mobile/save-confirmation-box/save-confirmation-box.jsx';
// import StrokeColorIndicatorComponent from '../../containers/stroke-color-indicator.jsx';
// import StrokeWidthIndicatorComponent from '../../containers/stroke-width-indicator.jsx';
import TextMode from '../../containers/text-mode.jsx';
import CenterMode from '../../containers/center-mode.jsx';
import ColorSelector from '../mobile/color-selector/color-selector.jsx';
import ColorPickerBox from '../mobile/color-selector/color-picker-box.jsx';

import { changeStrokeWidth } from '../../reducers/stroke-width';
import { changeBrushSize } from '../../reducers/brush-mode';
import { changeFillColor } from '../../reducers/fill-color';
import { changeFillColor2 } from '../../reducers/fill-color-2';
import { changeStrokeColor } from '../../reducers/stroke-color';
import { clearSelectedItems, setSelectedItems } from '../../reducers/selected-items';
// #if MOBILE
import { changeSaveStatus } from '../../reducers/save-image';
import MobileInputBox from 'ui-mobile-input';
// #endif

import Modes from '../../lib/modes';
import Formats from '../../lib/format';
import { isBitmap, isVector } from '../../lib/format';
import {
    applyStrokeWidthToSelection, applyFillColorToSelection, applyStrokeColorToSelection
} from '../../helper/style-path';
import { selectAllBitmap } from '../../helper/bitmap';
import {
    deleteSelection,
    getSelectedLeafItems,
    selectAllItems,
    selectAllSegments
} from '../../helper/selection';
import GradientTypes from '../../lib/gradient-types';
import styles from './paint-editor.mobile.css';

// import bitmapIcon from './icons/bitmap.svg';
import zoomInIcon from './icons/zoom-in-mobile.svg';
import zoomOutIcon from './icons/zoom-out-mobile.svg';
import zoomResetIcon from './icons/zoom-reset-mobile.svg';
import backIcon from './icons/back.svg';
import arrowRightIcon from './icons/arrow-right-mobile.svg';

const messages = defineMessages({
    title: {
        defaultMessage: '编辑造型',
        description: '编辑造型',
        id: 'paint.paintEditor.title'
    },
    save: {
        defaultMessage: 'Save',
        description: 'Save',
        id: 'paint.paintEditor.save'
    },
    bitmap: {
        defaultMessage: 'Convert to Bitmap',
        description: 'Label for button that converts the paint editor to bitmap mode',
        id: 'paint.paintEditor.bitmap'
    },
    vector: {
        defaultMessage: 'Convert to Vector',
        description: 'Label for button that converts the paint editor to vector mode',
        id: 'paint.paintEditor.vector'
    },
    costume: {
        id: 'paint.paintEditor.costume',
        description: 'Label for the name of a costume',
        defaultMessage: 'Costume'
    },
    fill: {
        defaultMessage: 'Fill',
        description: 'Label for the fill tool',
        id: 'paint.fillMode.fill'
    },
    stroke: {
        id: 'paint.paintEditor.stroke',
        description: 'Label for the color picker for the outline color',
        defaultMessage: 'Outline'
    },
    noColor: {
        defaultMessage: 'No color',
        description: 'No color',
        id: 'paint.colorSelector.noColor'
    },
    colorPicker: {
        defaultMessage: 'Draw color',
        description: 'Draw color',
        id: 'paint.colorSelector.colorPicker'
    },
    confirm: {
        defaultMessage: 'OK',
        description: 'OK',
        id: 'gui.modal.ok'
    },
    cancel: {
        defaultMessage: 'Cancel',
        description: 'Cancel',
        id: 'gui.modal.cancel'
    },
    save: {
        defaultMessage: 'Save',
        description: 'Save',
        id: 'gui.project.save'
    },
    unSave: {
        defaultMessage: 'UnSave',
        description: 'UnSave',
        id: 'gui.project.unSave'
    }
});

class PaintEditorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isColorSelectorShow: false,
            // fill / stroke
            colorSelectorMode: 'fill',
            isDrawColor: false,
            drawColorRGBValues: '',
            currentCostumeName: '',
            isSaveBoxShow: false
        };
        this._hasChanged = false;
    }

    componentDidMount() {
        this.setState({ currentCostumeName: this.props.name });
    }

    componentWillReceiveProps(nextProps) {
        const { onUpdateImage } = this.props;
        if (this._hasChanged) onUpdateImage();
        this._hasChanged = false;
    }

    handleChangeVectorModeStrokeOrFillWidth(newWidth) {
        const { strokeModeDisabled } = this.props;
        if (!strokeModeDisabled) {
            if (applyStrokeWidthToSelection(newWidth, this.props.textEditTarget)) {
                this.props.onUpdateImage();
            }
            this.props.onChangeStrokeWidth(newWidth);
        } else {
            this.props.onBrushSliderChange(newWidth);
        }
    }

    handleOpenColorSelector(mode = 'fill') {
        this.setState({
            isColorSelectorShow: true,
            colorSelectorMode: mode
        });
    }

    handleDelete() {
        if (!this.props.selectedItems.length) {
            if (isBitmap(this.props.format)) {
                selectAllBitmap(this.props.clearSelectedItems);
            } else if (this.props.mode === Modes.RESHAPE) {
                selectAllSegments();
            } else {
                selectAllItems();
            }
        }
        if (deleteSelection(this.props.mode, this.props.onUpdateImage)) {
            this.props.setSelectedItems(this.props.format);
        }
    }

    onDrawColor() {
        this.setState({ isDrawColor: true });
    }

    onSetNewCostumName(newValue) {
        if (typeof newValue === 'string') {
            this.setState({ currentCostumeName: newValue });
        } else {
            this.setState({ currentCostumeName: newValue.target.value });
        }
    }


    onSetNewColor(newColor) {
        const { colorSelectorMode } = this.state;
        if (colorSelectorMode === 'fill') {
            const {
                onChangeFillColor, fillModeColorIndex, gradientType, format, textEditTarget
            } = this.props;
            const isDifferent = applyFillColorToSelection(
                newColor,
                fillModeColorIndex,
                gradientType === GradientTypes.SOLID,
                isBitmap(format),
                textEditTarget);
            this._hasChanged = this._hasChanged || isDifferent;
            onChangeFillColor(newColor, fillModeColorIndex);
        } else {
            const { onChangeStrokeColor, format, textEditTarget } = this.props;
            const isDifferent =
                applyStrokeColorToSelection(newColor, isBitmap(format), textEditTarget);
            this._hasChanged = this._hasChanged || isDifferent;
            onChangeStrokeColor(newColor);
        }
        this.setState({
            isColorSelectorShow: false,
            drawColorRGBValues: ''
        });
    }

    /**
     * 在颜色选择器上设置吸取颜色值
     * 
     * @param {*} values 
     */
    onSetDrawColorInColorSelector(values) {
        this.setState({
            isDrawColor: false,
            drawColorRGBValues: values
        });
    }

    handleClosePaintEditor() {
        if (this.props.canRedo() || this.props.canUndo()) {
            this.setState({ isSaveBoxShow: true });
        } else {
            this.handleClosedPaintEditor();
        }
    }
    
    handleClosedPaintEditor() {
        this.setState({ isSaveBoxShow: false });
        const { onClosePaintEditor = () => { } } = this.props;
        onClosePaintEditor();
    }

    handleCloseSaveConfirmationBox() {
        this.setState({ isSaveBoxShow: false });
    }

    handleSaveImageInPaintEditor() {
        // #if MOBILE
        this.props.changeSaveStatus(true);
        // #endif
        this.saveDelayTimer = setTimeout(() => {
            this.props.onUpdateName(this.costumeNameEle && this.costumeNameEle.value);
            this.props.onUpdateImage();
            this.handleClosedPaintEditor();
            clearTimeout(this.saveDelayTimer);
        }, 100);
    }

    handleInputValue() {
        if (!MobileInputBox) return false;
        const { currentCostumeName } = this.state;
        MobileInputBox.default(
            {
                ok: this.props.intl.formatMessage(messages.confirm),
                cancel: this.props.intl.formatMessage(messages.cancel)
            },
            currentCostumeName,
            this.onSetNewCostumName.bind(this)
        );
    }

    renderStrokeOrFillWidthSelector() {
        const { strokeModeDisabled, vectorModeStrokeWidth, vectorModeBrushSize } = this.props;
        let currentWidth = !strokeModeDisabled ? vectorModeStrokeWidth : vectorModeBrushSize;
        const strokeWidth = [4, 8, 12, 14];
        return (
            <div className={styles.strokeWidthSelector}>
                {
                    strokeWidth.map((width, idx) => (
                        <div
                            className={classNames(styles.item, {
                                [styles.selected]: currentWidth == width
                            })}
                            key={`${idx}-${width}`}
                            onClick={this.handleChangeVectorModeStrokeOrFillWidth.bind(this, width)}
                        >
                            <div className={classNames(styles.line, styles[`line${idx + 1}`])}></div>
                        </div>
                    ))
                }
            </div>
        )
    }

    render() {
        const { isColorSelectorShow, isDrawColor, drawColorRGBValues, currentCostumeName,
            colorSelectorMode, isSaveBoxShow } = this.state;
        return (
            <div
                className={styles.editorContainer}
                ref={ele => { this.editorContainerEle = ele }}
                dir={this.props.rtl ? 'rtl' : 'ltr'}
            >
                <header className={styles.header} ref={ele => { this.headerAreaEle = ele }}>
                    <img
                        className={styles.icon}
                        draggable={false}
                        src={backIcon}
                        onClick={this.handleClosePaintEditor.bind(this)}
                    />
                    <span>{this.props.intl.formatMessage(messages.title)}</span>
                    <span onClick={this.handleSaveImageInPaintEditor.bind(this)}>{this.props.intl.formatMessage(messages.save)}</span>
                </header>
                <div className={styles.paintArea} ref={ele => { this.paintAreaEle = ele }}>
                    <div className={styles.left} ref={ele => { this.leftAreaEle = ele }}>
                        {/* Modes */}
                        {this.props.canvas !== null && isVector(this.props.format) ? ( // eslint-disable-line no-negated-condition
                            <div className={styles.modeSelector}>
                                <SelectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <DeleteMode
                                    disabled={this.props.mode !== Modes.SELECT}
                                    onDelete={this.handleDelete.bind(this)}
                                />
                                {/* <ReshapeMode
                                    onUpdateImage={this.props.onUpdateImage}
                                /> */}
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
                                    messages={{
                                        ok: this.props.intl.formatMessage(messages.confirm),
                                        cancel: this.props.intl.formatMessage(messages.cancel)
                                    }}
                                    textArea={this.props.textArea}
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <LineMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <OvalMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <CenterMode
                                    onUpdateImage={this.props.onUpdateImage}
                                    onUpdateRotateCenter={this.props.onUpdateRotateCenter}
                                />
                                <RectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                            </div>
                        ) : null}

                        {this.props.canvas !== null && isBitmap(this.props.format) ? ( // eslint-disable-line no-negated-condition
                            <div className={styles.modeSelector}>
                                <BitSelectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <DeleteMode
                                    disabled={this.props.mode !== Modes.BIT_SELECT}
                                    onDelete={this.handleDelete.bind(this)}
                                />
                                <BitBrushMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitEraserMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitFillMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <TextMode
                                    isBitmap
                                    messages={{
                                        ok: this.props.intl.formatMessage(messages.confirm),
                                        cancel: this.props.intl.formatMessage(messages.cancel)
                                    }}
                                    textArea={this.props.textArea}
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitLineMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitOvalMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                                <BitCenterMode
                                    onUpdateImage={this.props.onUpdateImage}
                                    onUpdateRotateCenter={this.props.onUpdateRotateCenter}
                                />
                                <BitRectMode
                                    onUpdateImage={this.props.onUpdateImage}
                                />
                            </div>
                        ) : null}
                        <FixedToolsContainer
                            canRedo={this.props.canRedo}
                            canUndo={this.props.canUndo}
                            name={this.props.name}
                            onRedo={this.props.onRedo}
                            onUndo={this.props.onUndo}
                            onUpdateImage={this.props.onUpdateImage}
                            onUpdateName={this.props.onUpdateName}
                        />
                    </div>
                    <div
                        className={classNames(styles.canvasArea, {
                            [styles.isDrawColor]: isDrawColor
                        })}
                        ref={ele => { this.paintCanvasAreaEle = ele }}
                    >
                        <ScrollableCanvas
                            canvas={this.props.canvas}
                            hideCursor={this.props.isEyeDropping}
                            style={classNames(styles.canvasContainer, {
                                [styles.drawColor]: isDrawColor
                            })}
                        >
                            <PaperCanvas
                                className={classNames({ [styles.hidden]: isDrawColor })}
                                canvasRef={this.props.setCanvas}
                                image={this.props.image}
                                imageFormat={this.props.imageFormat}
                                imageId={this.props.imageId}
                                rotationCenterX={this.props.rotationCenterX}
                                rotationCenterY={this.props.rotationCenterY}
                                zoomLevelId={this.props.zoomLevelId}
                                onUpdateImage={this.props.onUpdateImage}
                            />
                            {
                                isDrawColor &&
                                <ColorPickerBox
                                    canvas={this.props.canvas}
                                    parent={this.editorContainerEle}
                                    paintAreaEle={this.paintAreaEle}
                                    headerArea={this.headerAreaEle}
                                    canvasArea={this.paintCanvasAreaEle}
                                    leftArea={this.leftAreaEle}
                                    rightArea={this.rightAreaEle}
                                    isDrawColor={isDrawColor}
                                    setDrawColor={this.onSetDrawColorInColorSelector.bind(this)}
                                />
                            }
                            {
                                isDrawColor &&
                                <canvas
                                    id='clone-paper-canvas'
                                    className={styles.clonePaperCanvas}
                                />
                            }
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
                            {/* Zoom controls */}
                            <InputGroup className={classNames(styles.zoomControls, {
                                [styles.hide]: isDrawColor
                            })}>
                                <ButtonGroup className={styles.buttonGroup}>
                                    <Button
                                        className={styles.buttonGroupButton}
                                        onClick={this.props.onZoomOut}
                                    >
                                        <img
                                            alt="Zoom Out"
                                            className={styles.buttonGroupButtonIcon}
                                            draggable={false}
                                            src={zoomOutIcon}
                                        />
                                    </Button>
                                    <Button
                                        className={styles.buttonGroupButton}
                                        onClick={this.props.onZoomReset}
                                    >
                                        <img
                                            alt="Zoom Reset"
                                            className={styles.buttonGroupButtonIcon}
                                            draggable={false}
                                            src={zoomResetIcon}
                                        />
                                    </Button>
                                    <Button
                                        className={styles.buttonGroupButton}
                                        onClick={this.props.onZoomIn}
                                    >
                                        <img
                                            alt="Zoom In"
                                            className={styles.buttonGroupButtonIcon}
                                            draggable={false}
                                            src={zoomInIcon}
                                        />
                                    </Button>
                                </ButtonGroup>
                            </InputGroup>
                        </ScrollableCanvas>
                    </div>
                    <div className={styles.right} ref={ele => { this.rightAreaEle = ele }}>
                        <div className={styles.actionContent}>
                            <div
                                className={classNames(styles.box, styles.costumeBox)}
                                onClick={this.handleInputValue.bind(this)}
                            >
                                <span className={styles.name}>{this.props.intl.formatMessage(messages.costume)}</span>
                                <input
                                    disabled={ MobileInputBox ? true : false}
                                    ref={ele => this.costumeNameEle = ele}
                                    className={classNames(styles.value, styles.inputValue)}
                                    type='text'
                                    value={currentCostumeName}
                                    onChange={this.onSetNewCostumName.bind(this)}
                                />
                            </div>
                        </div>
                        <div className={classNames(styles.actionContent, {
                            [styles.disabled]: this.props.fillModeDisabled
                        })}>
                            <div className={classNames(styles.box, styles.costumeBox)}>
                                <span className={styles.name}>{this.props.intl.formatMessage(messages.fill)}</span>
                                <div
                                    className={styles.value}
                                    onClick={this.handleOpenColorSelector.bind(this, 'fill')}
                                >
                                    <div
                                        className={classNames(styles.color, {
                                            [styles.noneColor]: !this.props.fillColor
                                        })}
                                        style={{ backgroundColor: this.props.fillColor }}
                                    >
                                    </div>
                                    <div className={styles.arrow}>
                                        <img src={arrowRightIcon} alt='arrow' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            isVector(this.props.format) &&
                            <div className={classNames(styles.actionContent, {
                                [styles.disabled]: this.props.strokeModeDisabled
                            })}>
                                <div className={classNames(styles.box, styles.costumeBox)}>
                                    <span className={styles.name}>{this.props.intl.formatMessage(messages.stroke)}</span>
                                    <div
                                        className={styles.value}
                                        onClick={this.handleOpenColorSelector.bind(this, 'stroke')}
                                    >
                                        <div
                                            className={classNames(styles.color, {
                                                [styles.noneColor]: !this.props.vectorModeStrokeColor
                                            })}
                                            style={{ backgroundColor: this.props.vectorModeStrokeColor }}
                                        >
                                        </div>
                                        <div className={styles.arrow}>
                                            <img src={arrowRightIcon} alt='arrow' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            isVector(this.props.format) &&
                            this.renderStrokeOrFillWidthSelector()
                        }
                    </div>
                    <ColorSelector
                        copywriting={{
                            noColor: this.props.intl.formatMessage(messages.noColor),
                            colorPicker: this.props.intl.formatMessage(messages.colorPicker),
                            confirm: this.props.intl.formatMessage(messages.confirm)
                        }}
                        mode={colorSelectorMode}
                        drawColorRGBValues={drawColorRGBValues}
                        fillColor={this.props.fillColor}
                        strokeColor={this.props.vectorModeStrokeColor}
                        isShow={isColorSelectorShow}
                        onDrawColor={this.onDrawColor.bind(this)}
                        onOk={this.onSetNewColor.bind(this)}
                    />
                    {
                        isDrawColor &&
                        <div className={styles.mask}></div>
                    }
                    {
                        isSaveBoxShow &&
                        <SaveConfirmationBox
                            messages={{
                                save: this.props.intl.formatMessage(messages.save),
                                unSave: this.props.intl.formatMessage(messages.unSave),
                                cancel: this.props.intl.formatMessage(messages.cancel),
                            }}
                            onSave={() => { this.handleSaveImageInPaintEditor() }}
                            OnUnSave={() => { this.handleClosedPaintEditor() }}
                            onClose={() => { this.handleCloseSaveConfirmationBox() }}
                        />
                    }
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

const mapStateToProps = state => ({
    fillModeColorIndex: state.scratchPaint.fillMode.colorIndex,
    fillModeDisabled: state.scratchPaint.mode === Modes.LINE,
    fillColor: state.scratchPaint.color.fillColor,
    fillColor2: state.scratchPaint.color.fillColor2,
    gradientType: state.scratchPaint.color.gradientType,
    textEditTarget: state.scratchPaint.textEditTarget,
    strokeModeDisabled: state.scratchPaint.mode === Modes.BRUSH ||
        state.scratchPaint.mode === Modes.TEXT ||
        state.scratchPaint.mode === Modes.FILL,
    vectorModeStrokeColor: state.scratchPaint.color.strokeColor,
    vectorModeStrokeWidth: state.scratchPaint.color.strokeWidth,
    vectorModeBrushSize: state.scratchPaint.brushMode.brushSize,
    mode: state.scratchPaint.mode,
    selectedItems: state.scratchPaint.selectedItems
});

const mapDispatchToProps = dispatch => ({
    onChangeStrokeWidth: strokeWidth => {
        dispatch(changeStrokeWidth(strokeWidth));
    },
    onBrushSliderChange: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    onChangeFillColor: (fillColor, index) => {
        if (index === 0) {
            dispatch(changeFillColor(fillColor));
        } else if (index === 1) {
            dispatch(changeFillColor2(fillColor));
        }
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    },
    // #if MOBILE
    changeSaveStatus: status => {
        dispatch(changeSaveStatus(status))
    }
    // #endif
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PaintEditorComponent));
