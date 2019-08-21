import bindAll from 'lodash.bindall';
import React from 'react';
import ReactDOM from 'react-dom';
import PaintEditor from '../index.mobile';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './reducers/combine-reducers';
import {intlInitialState, IntlProvider} from './reducers/intl.js';

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
const store = createStore(
    reducer,
    intlInitialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const svgString =
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
            ' x="0px" y="0px" width="32px" height="32px" viewBox="0.5 384.5 32 32"' +
            ' enable-background="new 0.5 384.5 32 32" xml:space="preserve">' +
        '<path fill="none" stroke="#000000" stroke-width="3" stroke-miterlimit="10" d="M7.5,392.241h7.269' +
            'c4.571,0,8.231,5.555,8.231,10.123v7.377"/>' +
        '<polyline points="10.689,399.492 3.193,391.997 10.689,384.5 "/>' +
        '<polyline points="30.185,405.995 22.689,413.491 15.192,405.995 "/>' +
    '</svg>';
    const svgString2 =
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
            ' x="0px" y="0px" width="32px" height="32px" viewBox="0.5 384.5 32 32"' +
            ' enable-background="new 0.5 384.5 32 32" xml:space="preserve">' +
        '<path fill="none" stroke="#ff0000" stroke-width="3" stroke-miterlimit="10" d="M7.5,392.241h7.269' +
            'c4.571,0,8.231,5.555,8.231,10.123v7.377"/>' +
        '<polyline points="10.689,399.492 3.193,391.997 10.689,384.5 "/>' +
        '<polyline points="30.185,405.995 22.689,413.491 15.192,405.995 "/>' +
    '</svg>';
    const pngString = 
    'data:image/png;base64,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'
class Playground extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUpdateName',
            'handleUpdateImage',
        ]);
        // Append ?dir=rtl to URL to get RTL layout
        const match = location.search.match(/dir=([^&]+)/);
        const rtl = match && match[1] == 'rtl';
        this.state = {
            name: 'meow',
            rotationCenterX: 20,
            rotationCenterY: 20,
            imageFormat: 'png', // 'svg', 'png', or 'jpg'
            image: pngString, // svg string or data URI
            // image: svgString, // svg string or data URI
            rtl: rtl
        };
    }
    handleUpdateName (name) {
        this.setState({name});
    }
    handleUpdateImage (isVector, image, rotationCenterX, rotationCenterY) {
        console.log(image);
        console.log(`rotationCenterX: ${rotationCenterX}    rotationCenterY: ${rotationCenterY}`);
        if (isVector) {
            this.setState({image, rotationCenterX, rotationCenterY});
        } else { // is Bitmap
            // image parameter has type ImageData
            // paint editor takes dataURI as input
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.putImageData(image, 0, 0);
            this.setState({
                image: canvas.toDataURL('image/png'),
                rotationCenterX: rotationCenterX,
                rotationCenterY: rotationCenterY
            });
        
    }
}

    render () {
        return (
            <div>
                <PaintEditor
                            {...this.state}
                            imageId="meow"
                            onUpdateName={this.handleUpdateName}
                            onUpdateImage={this.handleUpdateImage}
                        />
            </div>
      
        );
    }

}
ReactDOM.render((
    <Provider store={store}>
        <IntlProvider>
            <Playground />
        </IntlProvider>
    </Provider>
), appTarget);
