import paper from '@scratch/paper';
import PropTypes from 'prop-types';
import log from '../log/log';
import bindAll from 'lodash.bindall';
import React from 'react';
import omit from 'lodash.omit';
import { connect } from 'react-redux';

import { undoSnapshot } from '../reducers/undo';
import { setSelectedItems } from '../reducers/selected-items';
// #if MOBILE
import { changeSaveStatus } from '../reducers/save-image';
// #endif

import { getSelectedLeafItems } from '../helper/selection';
import { getRaster, hideGuideLayers, showGuideLayers, showCrossLine } from '../helper/layer';
import { commitRectToBitmap, commitOvalToBitmap, commitSelectionToBitmap, getHitBounds } from '../helper/bitmap';
import { performSnapshot } from '../helper/undo';
import { scaleWithStrokes } from '../helper/math';
import { ART_BOARD_WIDTH, ART_BOARD_HEIGHT, SVG_ART_BOARD_WIDTH, SVG_ART_BOARD_HEIGHT } from '../helper/view';

import Modes from '../lib/modes';
import { BitmapModes } from '../lib/modes';
import Formats from '../lib/format';
import { isBitmap, isVector } from '../lib/format';

const UpdateImageHOC = function (WrappedComponent) {
    class UpdateImageWrapper extends React.Component {
        constructor(props) {
            super(props);
            bindAll(this, [
                'handleUpdateImage',
                'handleUpdateBitmap',
                'handleUpdateVector'
            ]);
        }

        componentDidMount() {
            // #if MOBILE
            this.props.changeSaveStatus(false);
            // #endif
        }

        /**
         * @param {?boolean} skipSnapshot True if the call to update image should not trigger saving
         * an undo state. For instance after calling undo.
         * @param {?Formats} formatOverride Normally the mode is used to determine the format of the image,
         * but the format used can be overridden here. In particular when converting between formats,
         * the does not accurately represent the format.
         */
        handleUpdateImage(skipSnapshot, formatOverride) {
            // If in the middle of switching formats, rely on the current mode instead of format.
            const actualFormat = formatOverride ? formatOverride :
                BitmapModes[this.props.mode] ? Formats.BITMAP : Formats.VECTOR;
            if (isBitmap(actualFormat)) {
                this.handleUpdateBitmap(skipSnapshot);
            } else if (isVector(actualFormat)) {
                this.handleUpdateVector(skipSnapshot);
            }

            //设置中心点模式，如果进行撤销或者恢复，十字线相关状态不会进行snapshot，见performSnapshot
            if (this.props.mode === Modes.CENTER || this.props.mode === Modes.BIT_CENTER) {
                showCrossLine()
            }
            console.log(paper.project)
        }
        handleUpdateBitmap(skipSnapshot) {
            if (!getRaster().loaded) {
                // In general, callers of updateImage should wait for getRaster().loaded = true before
                // calling updateImage.
                // However, this may happen if the user is rapidly undoing/redoing. In this case it's safe
                // to skip the update.
                log.warn('Bitmap layer should be loaded before calling updateImage.');
                return;
            }
            // Anything that is selected is on the vector layer waiting to be committed to the bitmap layer.
            // Plaster the selection onto the raster layer before exporting, if there is a selection.
            const plasteredRaster = getRaster().getSubRaster(getRaster().bounds);
            plasteredRaster.remove(); // Don't insert
            const selectedItems = getSelectedLeafItems();
            if (selectedItems.length === 1) {
                const item = selectedItems[0];
                if (item instanceof paper.Raster) {
                    if (!item.loaded ||
                        (item.data &&
                            item.data.expanded &&
                            !item.data.expanded.loaded)) {
                        // This may get logged when rapidly undoing/redoing or changing costumes,
                        // in which case the warning is not relevant.
                        log.warn('Bitmap layer should be loaded before calling updateImage.');
                        return;
                    }
                    commitSelectionToBitmap(item, plasteredRaster);
                } else if (item instanceof paper.Shape && item.type === 'rectangle') {
                    commitRectToBitmap(item, plasteredRaster);
                } else if (item instanceof paper.Shape && item.type === 'ellipse') {
                    commitOvalToBitmap(item, plasteredRaster);
                } else if (item instanceof paper.PointText) {
                    const textRaster = item.rasterize(72, false /* insert */);
                    plasteredRaster.drawImage(
                        textRaster.canvas,
                        new paper.Point(Math.floor(textRaster.bounds.x), Math.floor(textRaster.bounds.y))
                    );
                }
            }
            const rect = getHitBounds(plasteredRaster);
            // #if MOBILE
            if (this.props.isCanSave) {
                this.props.onUpdateImage(
                    false /* isVector */,
                    plasteredRaster.getImageData(rect),
                    (ART_BOARD_WIDTH / 2) - rect.x,
                    (ART_BOARD_HEIGHT / 2) - rect.y);
            }
            // #else
            this.props.onUpdateImage(
                false /* isVector */,
                plasteredRaster.getImageData(rect),
                (ART_BOARD_WIDTH / 2) - rect.x,
                (ART_BOARD_HEIGHT / 2) - rect.y);
            // #endif

            if (!skipSnapshot) {
                performSnapshot(this.props.undoSnapshot, Formats.BITMAP);
            }
        }
        handleUpdateVector(skipSnapshot) {
            const guideLayers = hideGuideLayers(true /* includeRaster */);

            // Export at 0.5x
            scaleWithStrokes(paper.project.activeLayer, .5, new paper.Point());
            const bounds = paper.project.activeLayer.bounds;
            // #if MOBILE
            if (this.props.isCanSave) {
                this.props.onUpdateImage(
                    true /* isVector */,
                    paper.project.exportSVG({
                        asString: true,
                        bounds: 'content',
                        matrix: new paper.Matrix().translate(-bounds.x, -bounds.y)
                    }),
                    (SVG_ART_BOARD_WIDTH / 2) - bounds.x,
                    (SVG_ART_BOARD_HEIGHT / 2) - bounds.y);
            }
            // #else
            // @todo (https://github.com/LLK/scratch-paint/issues/445) generate view box
            this.props.onUpdateImage(
                true /* isVector */,
                paper.project.exportSVG({
                    asString: true,
                    bounds: 'content',
                    matrix: new paper.Matrix().translate(-bounds.x, -bounds.y)
                }),
                (SVG_ART_BOARD_WIDTH / 2) - bounds.x,
                (SVG_ART_BOARD_HEIGHT / 2) - bounds.y);
            // #endif
            scaleWithStrokes(paper.project.activeLayer, 2, new paper.Point());
            paper.project.activeLayer.applyMatrix = true;

            showGuideLayers(guideLayers);

            if (!skipSnapshot) {
                performSnapshot(this.props.undoSnapshot, Formats.VECTOR);
            }
        }
        render() {
            const componentProps = omit(this.props, [
                'format',
                'onUpdateImage',
                'undoSnapshot'
            ]);
            return (
                <WrappedComponent
                    onUpdateImage={this.handleUpdateImage}
                    {...componentProps}
                />
            );
        }
    }

    UpdateImageWrapper.propTypes = {
        format: PropTypes.oneOf(Object.keys(Formats)),
        mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
        onUpdateImage: PropTypes.func.isRequired,
        undoSnapshot: PropTypes.func.isRequired
    };

    const mapStateToProps = state => ({
        format: state.scratchPaint.format,
        mode: state.scratchPaint.mode,
        undoState: state.scratchPaint.undo,
        // #if MOBILE
        isCanSave: state.scratchPaint.saveImage
        // #endif
    });
    const mapDispatchToProps = dispatch => ({
        setSelectedItems: format => {
            dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
        },
        undoSnapshot: snapshot => {
            dispatch(undoSnapshot(snapshot));
        },
        // #if MOBILE
        changeSaveStatus: status => {
            dispatch(changeSaveStatus(status))
        }
        // #endif
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(UpdateImageWrapper);
};

export default UpdateImageHOC;
