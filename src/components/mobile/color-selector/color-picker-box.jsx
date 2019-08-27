import React, { Component } from 'react';
import Draggable from 'react-draggable';
import className from 'classnames';
import styles from './color-picker-box.css';
import loadingIcon from './icons/loading.svg';
import pointIcon from './icons/point.png';

class ColorPickerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRendering: false,
            isDraging: false,
            controlledPosition: { x: 0, y: 0 },
            currentBounds: 'parent',
            currentRGB: '',
            currentRGBValues: {}
        };
    }
    componentDidMount() {
        this.setState({ isRendering: true });
        this.initTimer = setTimeout(() => {
            const that = this;
            const { canvas } = that.props;
            const { offsetHeight, offsetWidth } = canvas;
            const currentImageUrl = canvas.toDataURL();
            const clonePaperCanvas = document.getElementById('clone-paper-canvas');
            const src_img = new Image();
            src_img.src = currentImageUrl;
            clonePaperCanvas.setAttribute('width', offsetWidth);
            clonePaperCanvas.setAttribute('height', offsetHeight);
            that.stageCanvasCtx = clonePaperCanvas.getContext('2d');
            src_img.onload = function () {
                that.stageCanvasCtx.drawImage(src_img, 0, 0, offsetWidth, offsetHeight);
                src_img.style.display = 'none';
            };
            that.setState({
                controlledPosition: {
                    x: (offsetWidth / 2) - (that.ringEle.offsetWidth / 2),
                    y: (offsetHeight / 2) - (that.ringEle.offsetHeight / 2)
                },
                currentBounds: {
                    top: -(that.ringEle.offsetHeight / 2),
                    left: -(that.ringEle.offsetWidth / 2),
                    bottom: offsetHeight - (that.ringEle.offsetHeight / 2) - 2,
                    right: offsetWidth - (that.ringEle.offsetWidth / 2) - 1
                }
            });
            that.getInitRGBTimer = setTimeout(() => {
                that.setState({
                    isRendering: false,
                    currentRGB: that.getImagePositionRGB()
                });
                clearTimeout(that.getInitRGBTimer);
            }, 10);
            clearTimeout(that.initTimer);
        }, 500);
    }
    handleRingOnStart() {
    }
    handleRingOnDrag(e, position) {
        this.changeRingPositionAndRGB(position);
        this.setState({ isDraging: true });
    }
    handleRingOnStop(e, position) {
        // 解决快速滑动后，最终颜色展示与实际颜色不符合问题
        this.changeRingPositionAndRGB(position);
        this.delayReloadStateTimer = setTimeout(() => {
            // 解决存在一些情况下，最后展示的颜色不相符的问题。
            const rgba = this.getImagePositionRGB();
            this.setState({
                currentRGB: rgba,
                isDraging: false
            });
            this.props.setDrawColor(this.state.currentRGBValues);
            clearTimeout(this.delayReloadStateTimer);
        }, 400);
    }
    changeRingPositionAndRGB(position) {
        const { x, y } = position;
        const rgba = this.getImagePositionRGB();
        this.setState({
            controlledPosition: { x, y },
            currentRGB: rgba
        });
    }
    getImagePositionRGB() {
        const { parent, canvas } = this.props;
        const ringCrt = this.ringEle.getBoundingClientRect();
        const imagePixelX = Math.ceil(ringCrt.left - ((parent.offsetWidth - canvas.offsetWidth) / 2) + (this.ringEle.offsetWidth / 2) - 1) + 30;
        const imagePixelY = Math.ceil(ringCrt.top - ((parent.offsetHeight - canvas.offsetHeight) / 2) + (this.ringEle.offsetHeight / 2) - 1);
        const pixel = this.stageCanvasCtx.getImageData(imagePixelX, imagePixelY, 1, 1);
        const { data } = pixel;
        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${(data[3] / 255)})`;
        this.setState({
            currentRGBValues: {
                r: data[0],
                g: data[1],
                b: data[2]
            }
        });
        return rgba;
    }
    onTouchSomeWhere(e) {
        const { isDraging } = this.state;
        if (isDraging) return;
        const { parent, canvas } = this.props;
        const { pageX, pageY } = e;
        const actualXPostion = pageX - ((parent.offsetWidth - canvas.offsetWidth) / 2) - (this.ringEle.offsetWidth / 2) + 30;
        const actualYPosition = pageY - ((parent.offsetHeight - canvas.offsetHeight) / 2) - (this.ringEle.offsetHeight / 2);
        this.setState({
            controlledPosition: {
                x: actualXPostion,
                y: actualYPosition
            }
        });
        this.getInitRGBTimer = setTimeout(() => {
            const rgba = this.getImagePositionRGB();
            this.setState({
                currentRGB: rgba
            });
            clearTimeout(this.getInitRGBTimer);
        }, 10);
    }
    render() {
        const { isRendering, controlledPosition, currentBounds, currentRGB, currentRGBValues } = this.state;
        return (
            <div
                ref={(ele) => { this.colorPickerContainer = ele; }}
                className={styles.container}
            >
                <div className={styles.content}>
                    <div
                        className={styles.image}
                        ref={(ele) => { this.imageBoxEle = ele; }}
                        onClick={this.onTouchSomeWhere.bind(this)}
                    >
                        <div className={styles.ringBox}>
                            <Draggable
                                position={controlledPosition}
                                bounds={currentBounds}
                                scale={1}
                                onStart={this.handleRingOnStart.bind(this)}
                                onDrag={this.handleRingOnDrag.bind(this)}
                                onStop={this.handleRingOnStop.bind(this)}
                            >
                                <div
                                    ref={(ele) => { this.ringEle = ele; }}
                                    className={className(styles.ring, {
                                        [styles.hidden]: isRendering
                                    })}
                                    style={currentRGB && { borderColor: currentRGB }}
                                >
                                    <div className={styles.innerRing}></div>
                                    <div className={styles.outerRing}></div>
                                    <img className={styles.pointIcon} src={pointIcon} alt='point' />
                                </div>
                            </Draggable>
                        </div>
                        {
                            isRendering &&
                            <div className={styles.loadingMask}>
                                <img className={styles.icon} src={loadingIcon} alt='loading' />
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ColorPickerBox;