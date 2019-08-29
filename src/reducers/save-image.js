// 移动端不需要实时保存功能，所以添加该 reducer

const CHANGE_SAVE_STATUS = 'scratch-paint/save-image/CHANGE_SAVE_STATUS';
const initialState = false;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_SAVE_STATUS:
            return action.status;
        default:
            return state;
    }
};

// Action creators ==================================
const changeSaveStatus = function (status) {
    return {
        type: CHANGE_SAVE_STATUS,
        status
    };
};

export {
    reducer as default,
    changeSaveStatus
};
