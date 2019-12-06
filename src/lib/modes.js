import keyMirror from 'keymirror';

const vectorModesObj = {
    BRUSH: null,
    ERASER: null,
    LINE: null,
    FILL: null,
    SELECT: null,
    RESHAPE: null,
    OVAL: null,
    RECT: null,
    ROUNDED_RECT: null,
    TEXT: null,
    CENTER: null
};

const bitmapModesObj = {
    BIT_BRUSH: null,
    BIT_LINE: null,
    BIT_OVAL: null,
    BIT_RECT: null,
    BIT_TEXT: null,
    BIT_FILL: null,
    BIT_ERASER: null,
    BIT_SELECT: null,
    BIT_CENTER: null
};

const VectorModes = keyMirror(vectorModesObj);
const BitmapModes = keyMirror(bitmapModesObj);
const Modes = keyMirror({...vectorModesObj, ...bitmapModesObj});

export {
    Modes as default,
    VectorModes,
    BitmapModes
};
