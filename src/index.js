import PaintEditor from './containers/paint-editor.jsx';
import ScratchPaintReducer from './reducers/scratch-paint-reducer';
// #if MOBILE
// 临时用这种不够优雅的方式
import ThirdTool from './helper/tools/third-tool';
// #endif

export {
    PaintEditor as default,
    ScratchPaintReducer,
    // #if MOBILE
    ThirdTool
    // #endif
};
