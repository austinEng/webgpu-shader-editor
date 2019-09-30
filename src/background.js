import { INIT_EDITOR, INIT_CONTENT_SCRIPT, EDITOR_CONNECTED, REGISTER_SHADER_MODULE, CLEAR_EDITOR, UPDATED_SHADER_MODULE } from './messages';

const connections = {};

class Channel {
    constructor() {
        this._editorConnection = null;
        this._contentScriptConnection = null;
    }

    setContentScript(connection) {
        this._contentScriptConnection = connection;
        if (connection) {
            connection.onDisconnect.addListener(() => this._contentScriptConnection = null);
        }
        this.sendEditorId();

        if (this._editorConnection) {
            this._editorConnection.postMessage({
                type: CLEAR_EDITOR,
            });
        }
    }

    setEditor(connection) {
        this._editorConnection = connection;
        if (connection) {
            connection.onDisconnect.addListener(() => this._editorConnection = null);
        }
        this.sendEditorId();
    }

    sendEditorId() {
        if (this._editorConnection && this._contentScriptConnection) {
            this._contentScriptConnection.postMessage({
                type: EDITOR_CONNECTED,
                id: this._editorConnection.sender.id,
            });
        }
    }

    registerShaderModule(message) {
        if (this._editorConnection) {
            this._editorConnection.postMessage(message);
        }
    }

    updateShaderModule(message) {
        if (this._contentScriptConnection) {
            this._contentScriptConnection.postMessage(message);
        }
    }
}

// The background page received a new connection from `chrome.runtime.connect()`
chrome.runtime.onConnect.addListener(function (connection) {
    function messageHandler(message, port) {
        console.log(message, port);

        const tabId = message.tabId || (port.sender && port.sender.tab && port.sender.tab.id);
        if (tabId === undefined) {
            console.error('No tabId');
        }

        if (connections[tabId] === undefined) {
            connections[tabId] = new Channel();
        }

        switch (message.type) {
            case INIT_EDITOR:
                connections[tabId].setEditor(port);
                break;

            case INIT_CONTENT_SCRIPT:
                connections[tabId].setContentScript(port);
                break;

            case REGISTER_SHADER_MODULE:
                connections[tabId].registerShaderModule(message);
                break;

            case UPDATED_SHADER_MODULE:
                connections[tabId].updateShaderModule(message);
                break;
        }
    }

    function removeConnection(port, storage) {
        const keys = Object.keys(storage);
        for (let i = 0, len = keys.length; i < len; ++i) {
            if (storage[keys[i]] == port) {
                console.log('Removed', storage[keys[i]]);
                delete storage[keys[i]];
                break;
            }
        }
    }

    connection.onMessage.addListener(messageHandler);
    connection.onDisconnect.addListener(function (port) {
        console.log('disconnection', port);
        connection.onMessage.removeListener(messageHandler);
        removeConnection(port, connections);
    });
});
