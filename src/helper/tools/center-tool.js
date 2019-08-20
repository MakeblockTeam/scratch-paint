// import Modes from '../lib/modes';

import paper from 'paper';
import { ART_BOARD_WIDTH, ART_BOARD_HEIGHT, SVG_ART_BOARD_WIDTH, SVG_ART_BOARD_HEIGHT } from '../view';
import { getRaster, getPaintingLayer, hideGuideLayers, showGuideLayers } from '../layer';
import { BitmapModes } from '../../lib/modes';
import { isBitmap, isVector } from '../../lib/format';
import Formats from '../../lib/format';

class CenterTool extends paper.Tool {
    constructor(onUpdateRotateCenter, onUpdateImage, mode) {
        super();
        this.onUpdateImage = onUpdateImage;
        this.onUpdateRotateCenter = onUpdateRotateCenter;
        this.mode = mode;
        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
    }
    handleMouseDown(event) {

        const point = event.point;
        point.x = Math.max(0, Math.min(point.x, ART_BOARD_WIDTH));
        point.y = Math.max(0, Math.min(point.y, ART_BOARD_HEIGHT));
        // const dragVector = point.subtract(event.downPoint);
        const dragVector = point.subtract(new paper.Point(SVG_ART_BOARD_WIDTH, SVG_ART_BOARD_HEIGHT));
        const actualFormat = BitmapModes[this.mode] ? Formats.BITMAP : Formats.VECTOR;
        if (isBitmap(actualFormat)) {
            this.updateBitRotateCenter(dragVector, event);
        } else if (isVector(actualFormat)) {
            this.updateVectorRotateCenter(dragVector, event);
        }

        // if (event.event.button > 0) return; // only first mouse button
        // this.active = true;
        // this.clearHoveredItem();

        // // Check if double clicked
        // let doubleClicked = false;
        // if (this.lastEvent) {
        //     if ((event.event.timeStamp - this.lastEvent.event.timeStamp) < SelectTool.DOUBLE_CLICK_MILLIS) {
        //         doubleClicked = true;
        //     } else {
        //         doubleClicked = false;
        //     }
        // }
        // this.lastEvent = event;
    }
    handleMouseMove(event) {

    }
    handleMouseDrag(event) {

    }
    handleMouseUp(event) {

    }

    updateVectorRotateCenter(dragVector, event) {
        const items = getPaintingLayer().children;
        for (const item of items) {
            item.position = item.position.subtract(dragVector);
        }
        this.onUpdateImage()
    }


    updateBitRotateCenter(dragVector, event) {
        const ctx = getRaster().getContext(true /* modify */);
        const img = ctx.getImageData(0, 0, ART_BOARD_WIDTH, ART_BOARD_HEIGHT);
        ctx.clearRect(0, 0, ART_BOARD_WIDTH, ART_BOARD_HEIGHT);
        ctx.putImageData(img, -dragVector.x, -dragVector.y);
        this.onUpdateImage();
    }
}

export default CenterTool;
