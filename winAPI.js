import { Library, Callback } from 'ffi-napi'

//I have hand edited a library to match the contents of this PR as it fixes a crash I don't think can be dealt with on my end.
//https://github.com/node-ffi-napi/node-ffi-napi/pull/56

export function onActiveWindowChange(callback) {
    const user32 = Library('user32', {
        SetWinEventHook: ['int', ['int', 'int', 'pointer', 'pointer', 'int', 'int', 'int']],
        GetWindowTextW: ['int', ['pointer', 'pointer', 'int']],
        GetWindowTextLengthW: ['int', ['pointer']]
    })

    const pfnWinEventProc = Callback('void', ['pointer', 'int', 'pointer', 'long', 'long', 'int', 'int'],
    function (_hWinEventHook, _event, hwnd, _idObject, _idChild, _idEventThread, _dwmsEventTime) {
        const titleBuffer = Buffer.alloc(user32.GetWindowTextLengthW(hwnd) * 2 + 4)

        user32.GetWindowTextW(hwnd, titleBuffer, 255)

        const title = titleBuffer.toString('utf16le').replace(/[\x00-\x1F\x7F-\x9F]/g, '')

        callback(title)
    })

    user32.SetWinEventHook(3, 3, null, pfnWinEventProc, 0, 0, 0 | 2)
}