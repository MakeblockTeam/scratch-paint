import bindAll from 'lodash.bindall';
import React from 'react';
import ReactDOM from 'react-dom';
import PaintEditor from '..';
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
    '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="M0 0h120v120H0z"/><path id="c" d="M0 .917h110.212V111H0z"/></defs><g fill="none" fill-rule="evenodd"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><path d="M81.797 118.125c-10.898 2.5-32.695 2.5-43.594 0C18.648 113.64 6.32 101.361 1.875 81.797c-2.512-11.056-2.488-32.851 0-43.594C6.402 18.657 18.66 6.415 38.203 1.875c10.693-2.484 32.487-2.516 43.594 0 19.567 4.433 31.675 16.812 36.328 36.328 2.452 10.285 2.548 32.058 0 43.594-4.327 19.591-16.773 31.843-36.328 36.328" fill="#EF5350" mask="url(#b)"/><g transform="translate(0 9)"><mask id="d" fill="#fff"><use xlink:href="#c"/></mask><path d="M91.64 99.281c-10.898 2.5-32.695 2.5-43.594 0-19.555-4.485-31.883-16.764-36.328-36.328-2.512-11.056-2.488-32.85 0-43.594 1.651-7.13 4.343-13.275 8.03-18.442C10.753 7.337 4.75 16.791 1.874 29.203c-2.487 10.743-2.51 32.538 0 43.594 4.445 19.564 16.773 31.842 36.328 36.328 10.9 2.5 32.696 2.5 43.594 0 12.44-2.854 21.99-8.863 28.416-17.892-5.207 3.707-11.407 6.404-18.572 8.048" fill="#D84A4A" mask="url(#d)"/></g><path d="M85.483 47.858c-3.391-.24-7.831-.413-12.734-.52-.105-4.899-.272-9.362-.506-12.82-.376-5.594-5.393-10.143-12.046-10.143-6.652 0-11.46 4.562-12.046 10.142-.373 3.557-.641 8.003-.811 12.825-4.814.11-9.258.28-12.823.516-5.593.373-10.142 5.393-10.142 12.046 0 6.652 4.557 11.546 10.142 12.046 3.466.31 7.924.532 12.81.673.172 4.946.445 9.431.824 12.86.62 5.576 5.394 10.142 12.046 10.142 6.653 0 11.678-4.55 12.046-10.143.233-3.526.399-7.996.504-12.864 4.826-.14 9.249-.36 12.736-.668 5.586-.492 10.143-5.394 10.143-12.046 0-6.653-4.551-11.65-10.143-12.046" fill="#FFF"/></g></svg>'
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
            imageFormat: 'svg', // 'svg', 'png', or 'jpg'
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
