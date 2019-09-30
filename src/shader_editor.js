import { REGISTER_SHADER_MODULE, INIT_EDITOR, UPDATED_SHADER_MODULE, CLEAR_EDITOR } from './messages';

const windowLoaded = new Promise(resolve => {
    window.onload = function() {
        const shaderList = document.getElementById('shader-list');
        const shaderEditor = document.getElementById('shader-editor');

        shaderEditor.addEventListener('keydown', function(ev) {
            if (ev.keyCode === 83 && (ev.ctrlKey || ev.metaKey)) {
                updateShaderModuleSource(shaderEditor.value);
            }
        }, false);
        resolve({
            shaderList,
            shaderEditor,
        });
    };
});

function registerShader(shaderList, shaderEditor, message) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    const a = document.createElement('a');
    const text = document.createTextNode(`Shader ${message.id}`);

    a.appendChild(text);
    td.appendChild(a);
    tr.appendChild(td);
    shaderList.appendChild(tr);

    if (typeof message.code === "object") {
        message.code.length = Object.keys(message.code).length;
        message.code = new Uint32Array(message.code);
    }

    a.href = "#";
    a.onclick = function() {
        setCurrentShaderModule(message);
        setShaderEditorSource(shaderEditor, message.code);
        return true;
    };
}

let currentShaderModule = undefined;
function setCurrentShaderModule(shaderModule) {
    currentShaderModule = shaderModule;
}

function updateShaderModuleSource(updatedCode) {
    if (!currentShaderModule) {
        return;
    }
    currentShaderModule.code = updatedCode;
    backgroundPageConnection.postMessage({
        type: UPDATED_SHADER_MODULE,
        id: currentShaderModule.id,
        updatedCode,
        tabId: chrome.devtools.inspectedWindow.tabId,
        // new Uint32Array(updatedSource.split(' ').map(s => parseInt(s))),
    });
}

function setShaderEditorSource(shaderEditor, code) {
    // if (code instanceof Uint32Array) {
    //     const str = Array.from(code).map(num => {
    //         let hex = num.toString(16);
    //         while (hex.length < 8) {
    //             hex = '0' + hex;
    //         }
    //         return '0x' + hex;
    //     }).join(' ');
    //     shaderEditor.value = str;
    // } else
    if (typeof code === 'string') {
        shaderEditor.value = code;
    }
}

const backgroundPageConnection = chrome.runtime.connect({
    name: 'shader-editor',
});

function messageHandler(message) {
    // Handle responses from the background page, if any
    console.log(message);

    switch (message.type) {
        case REGISTER_SHADER_MODULE:
            windowLoaded.then(({ shaderList, shaderEditor }) => {
                registerShader(shaderList, shaderEditor, message);
            });
            break;

        case CLEAR_EDITOR:
            currentShaderModule = undefined;
            windowLoaded.then(({ shaderList, shaderEditor}) => {
                shaderEditor.value = '';
                while (shaderList.lastChild !== shaderList.firstChild) {
                    shaderList.removeChild(shaderList.lastChild);
                }
            });
            break;
    }
}

backgroundPageConnection.onMessage.addListener(messageHandler);
backgroundPageConnection.onDisconnect.addListener(function() {
    backgroundPageConnection.onMessage.removeListener(messageHandler);
});

backgroundPageConnection.postMessage({
    type: INIT_EDITOR,
    tabId: chrome.devtools.inspectedWindow.tabId
});
