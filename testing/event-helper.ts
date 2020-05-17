enum keyBoardLocation {
    // 各个值的含义请参见: https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/location
    DOM_KEY_LOCATION_STANDARD,
    DOM_KEY_LOCATION_LEFT,
    DOM_KEY_LOCATION_RIGHT,
    DOM_KEY_LOCATION_NUMPAD
}

interface keyBoardParams {
    key?: string,
    code?: string,
    location?: keyBoardLocation,
    ctrlKey?: boolean,
    altKey?: boolean,
    shiftKey?: boolean,
    metaKey?: boolean,
    repeat?: boolean,
    isComposing?: boolean,
    keyCode?: number
}

type keyBoardEventType = 'keydown' | 'keyup' | 'keypress';

export function createKeyBoardEvent(eventType: keyBoardEventType, params: keyBoardParams) {
    params.key = params.key || '';
    params.code = params.code || '';
    params.ctrlKey = params.ctrlKey === undefined ? true : params.ctrlKey;
    params.altKey = params.altKey === undefined ? true : params.altKey;
    params.shiftKey = params.shiftKey === undefined ? true : params.shiftKey;
    params.metaKey = params.metaKey === undefined ? true : params.metaKey;
    params.repeat = params.repeat === undefined ? true : params.repeat;
    params.isComposing = params.isComposing === undefined ? true : params.isComposing;

    return new KeyboardEvent(eventType, {
        key: params.key,
        code: params.code
    });
}