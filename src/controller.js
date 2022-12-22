const keysAndKeycodes = [
    { key: "space", code: 32 },
    { key: "left", code: 37 },
    { key: "up", code: 38 },
    { key: "right", code: 39 },
    { key: "down", code: 40 },
    { key: "enter", code: 13 },
    { key: "tab", code: 9 },
    { key: "shift", code: 16 },
    { key: "ctrl", code: 17 },
    { key: "alt", code: 18 },
    { key: "backspace", code: 8 },
    { key: "delete", code: 46 },
    { key: "escape", code: 27 },
    { key: "pageup", code: 33 },
    { key: "pagedown", code: 34 },
    { key: "end", code: 35 },
    { key: "home", code: 36 },
    { key: "insert", code: 45 },
    { key: "numlock", code: 144 },
    { key: "scrolllock", code: 145 },
    { key: "capslock", code: 20 },
    { key: "printscreen", code: 44 },
    { key: "pause", code: 19 },
    { key: "f1", code: 112 },
    { key: "f2", code: 113 },
    { key: "f3", code: 114 },
    { key: "f4", code: 115 },
    { key: "f5", code: 116 },
    { key: "f6", code: 117 },
    { key: "f7", code: 118 },
    { key: "f8", code: 119 },
    { key: "f9", code: 120 },
    { key: "f10", code: 121 },
    { key: "f11", code: 122 },
    { key: "f12", code: 123 },
]

function stringToKeyCode(keyString) {
    if (keyString.length > 1) {
        const key = keysAndKeycodes.find((key) => key.key === keyString);
        if (key) {
            return key.code;
        }
    }
    const keyCode = keyString.toUpperCase().charCodeAt(0);
    if (keyCode) {
        return keyCode;
    }
    console.error(`Key code "${keyString}" not found.`);
}