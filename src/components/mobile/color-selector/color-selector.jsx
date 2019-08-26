import React, { Component } from 'react';
import classNames from 'classnames';
import Slider from 'rc-slider';
import styles from './color-selector.css';
import colorPickerIcon from './icons/color-picker.svg';
import transparentIcon from './icons/transparent.svg';

const defaultColors = ['#fc4144', '#fd9251', '#fed831', '#21ce83', '#2af3fd', '#4476fb', '#983dd0', '#000000', '#ffffff'];
const commonRailStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '10px',
    margin: 'auto',
    borderRadius: '8px'
};
const handleStyle = {
    position: 'absolute',
    marginLeft: '-10px',
    width: '40px',
    height: '40px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    border: 'solid 4px #cfcfcf',
    boxSizing: 'border-box'
};

class ColorSelector extends Component {
    constructor() {
        super();
        this.state = {
            R: 255,
            G: 0,
            B: 0,
            hPickerValue: 0,
            sPickerValue: 100,
            bPickerValue: 100,
            rgbValue: '',
            isColorPickerBoxShow: false,
            currentStageImageUrl: ''
        };
    }

    componentDidMount() {
        const { color } = this.props;
        this.hexToRgb(color);
        this.setState({
            rgbValue: color
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawColorRGBValues !== this.props.drawColorRGBValues) {
            if (nextProps.drawColorRGBValues) {
                const { r, g, b } = nextProps.drawColorRGBValues;
                this.rgbToHsb(r, g, b);
                this.rgbToHex([r, g, b]);
            }
        }
    }

    getDefaultColorItems() {
        const { rgbValue } = this.state;
        return (
            <div className={styles.defaultColors}>
                {
                    defaultColors.map((item, idx) => {
                        return (
                            <label
                                className={classNames(styles.colorItem, {
                                    [styles.active]: item === rgbValue
                                })}
                                key={`default-color-${item}-${idx}`}
                                style={{ backgroundColor: item }}
                                onClick={this.setDefaultColor.bind(this, item)}
                            />
                        )
                    })
                }
            </div>
        );
    }

    setDefaultColor(value) {
        this.hexToRgb(value);
        this.setState({
            rgbValue: value
        });
    }

    onHueSliderChange(value) {
        const { sPickerValue, bPickerValue } = this.state;
        this.hsvToRgb(value / 360, sPickerValue / 100, bPickerValue / 100);
        this.setState({
            hPickerValue: value
        });
    }

    onSatSliderChange(value) {
        const { hPickerValue, bPickerValue } = this.state;
        this.hsvToRgb(this.state.hPickerValue / 360, value / 100, bPickerValue / 100);
        this.setState({
            sPickerValue: value
        });
    }

    onBriSliderChange(value) {
        const { hPickerValue, sPickerValue } = this.state;
        this.hsvToRgb(this.state.hPickerValue / 360, sPickerValue / 100, value / 100);
        this.setState({
            bPickerValue: value
        });
    }

    hsvToRgb(H, S, V) {
        let R;
        let G;
        let B;
        if (S === 0) {
            R = V;
            G = V;
            B = V;
        } else {
            let _H = H * 6;
            if (_H === 6) {
                _H = 0;
            }
            const i = Math.floor(_H);
            const v1 = V * (1 - S);
            const v2 = V * (1 - (S * (_H - i)));
            const v3 = V * (1 - (S * (1 - (_H - i))));
            if (i === 0) {
                R = V;
                G = v3;
                B = v1;
            } else if (i === 1) {
                R = v2;
                G = V;
                B = v1;
            } else if (i === 2) {
                R = v1;
                G = V;
                B = v3;
            } else if (i === 3) {
                R = v1;
                G = v2;
                B = V;
            } else if (i === 4) {
                R = v3;
                G = v1;
                B = V;
            } else {
                R = V;
                G = v1;
                B = v2;
            }
        }
        this.setState({ R, G, B });
        const rValue = Math.round(R * 255);
        const gValue = Math.round(G * 255);
        const bValue = Math.round(B * 255);
        const colors = [rValue, gValue, bValue];
        this.rgbToHex(colors);
    }

    rgbToHsb(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        let h, s, v;
        const min = Math.min(r, g, b);
        const max = v = Math.max(r, g, b);
        const difference = max - min;
        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / difference + (g < b ? 6 : 0); break;
                case g: h = 2.0 + (v - r) / difference; break;
                case b: h = 4.0 + (r - g) / difference; break;
            }
            h = Math.round(h * 60);
        }
        if (max === 0) {
            s = 0;
        } else {
            s = 1 - min / max;
        }
        s = Math.round(s * 100);
        v = Math.round(v * 100);
        this.setState({
            hPickerValue: h,
            sPickerValue: s,
            bPickerValue: v,
        });
    }

    rgbToHex(colors) {
        let hex = '#';
        for (let i = 0; i < 3; i += 1) {
            hex += ("0" + Number(colors[i]).toString(16)).slice(-2);
        }
        this.setState({
            rgbValue: hex
        });
    }

    hexToRgb(hex) {
        const color = [];
        const rgb = [];
        hex = hex.replace(/#/, "");
        if (hex.length === 3) {
            const tmp = [];
            for (var i = 0; i < 3; i++) {
                tmp.push(hex.charAt(i) + hex.charAt(i));
            }
            hex = tmp.join("");
        }
        for (let i = 0; i < 3; i += 1) {
            color[i] = "0x" + hex.substr(i * 2, 2);
            rgb.push(parseInt(Number(color[i]), 10));
        }
        this.rgbToHsb(rgb[0], rgb[1], rgb[2]);
    }

    setTransparentColor() {
        this.setState({
            R: 255,
            G: 0,
            B: 0,
            hPickerValue: 0,
            sPickerValue: 0,
            bPickerValue: 0,
            rgbValue: null
        });
    }

    setCurrentColor() {
        const { drawColorRGBValues } = this.props;
        const { rgbValue } = this.state;
        this.props.onOk(rgbValue);
    }

    renderHsbSliderComp() {
        const { hPickerValue, sPickerValue, bPickerValue, rgbValue } = this.state;
        const hueBackground = { background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' };
        const satBackground = { background: `linear-gradient(to right, transparent, ${rgbValue})` };
        const briBackground = { background: `linear-gradient(to right, #000, ${rgbValue})` };
        const hsbSliders = [{
            id: 'h-slider',
            min: 0,
            max: 359,
            value: hPickerValue,
            railStyle: Object.assign({}, commonRailStyle, hueBackground),
            event: this.onHueSliderChange.bind(this)
        }, {
            id: 's-slider',
            min: 0,
            max: 359,
            value: sPickerValue,
            railStyle: Object.assign({}, commonRailStyle, satBackground),
            event: this.onSatSliderChange.bind(this)
        }, {
            id: 'b-slider',
            min: 0,
            max: 100,
            value: bPickerValue,
            railStyle: Object.assign({}, commonRailStyle, briBackground),
            event: this.onBriSliderChange.bind(this)
        }];
        return (
            <div className={styles.slider}>
                {
                    hsbSliders.map(item => (
                        <Slider
                            key={item.id}
                            className={styles[item.id]}
                            min={item.min}
                            max={item.max}
                            value={item.value}
                            railStyle={item.railStyle}
                            handleStyle={handleStyle}
                            onChange={item.event}
                        />
                    ))
                }
            </div>
        );
    }

    render() {
        let currentColor;
        const { isShow, copywriting, drawColorRGBValues } = this.props;
        const { rgbValue } = this.state;
        return (
            <div className={classNames(styles.container, {
                [styles.hide]: !isShow
            })}>
                <div className={styles.content}>
                    <div className={styles.colorDisplayBox}>
                        <div className={styles.top} style={{ backgroundColor: rgbValue }}>
                            {
                                !rgbValue &&
                                <div className={styles.noneColor}></div>
                            }
                        </div>
                        <div className={styles.bottom}>
                            <div className={styles.left} onClick={this.setTransparentColor.bind(this)}>
                                <img src={transparentIcon} alt='transparentIcon' />
                                <span>{copywriting.noColor}</span>
                            </div>
                            <div className={styles.right} onClick={this.props.onDrawColor}>
                                <img src={colorPickerIcon} alt='colorPickerIcon' />
                                <span>{copywriting.colorPicker}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.colorSelectBox}>
                        {
                            this.getDefaultColorItems()
                        }
                        {
                            this.renderHsbSliderComp()
                        }
                    </div>
                </div>
                <div className={styles.confirmBox} onClick={this.setCurrentColor.bind(this)}>
                    {copywriting.confirm}
                </div>
            </div>
        )
    }
}

export default ColorSelector;