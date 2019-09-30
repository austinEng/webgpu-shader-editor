
import { INIT_CONTENT_SCRIPT, REGISTER_SHADER_MODULE } from './messages';
import { insertHeaderNode } from './helpers';

if (navigator.gpu) {
    const backgroundPageConnection = chrome.runtime.connect({
        name: 'content-script',
    });

    // Handle messages from the background page
    function messageHandler(message, sender, sendResponse) {
        // Forward to to the injected script
        window.postMessage(message);
    }

    backgroundPageConnection.onMessage.addListener(messageHandler);
    backgroundPageConnection.onDisconnect.addListener(function () {
        backgroundPageConnection.onMessage.removeListener(messageHandler);
    });

    backgroundPageConnection.postMessage({
        type: INIT_CONTENT_SCRIPT,
    });

    // Handle messages from the injected script
    window.addEventListener('message', function (event) {
        const message = event.data;
        if (typeof message !== 'object' || message === null) {
            return;
        }

        if (message.type == REGISTER_SHADER_MODULE) {
            backgroundPageConnection.postMessage(message);
        }
    });

    const inlinedScript = document.createElement('script');
    inlinedScript.type = 'text/javascript';
    inlinedScript.text = `
(function() {
    const insertHeaderNode = ${insertHeaderNode.toString()};

    const injectedScript = document.createElement('script');
    injectedScript.type = 'text/javascript';
    injectedScript.src = '${chrome.extension.getURL('injected_script.js')}';
    const scriptInjected = new Promise(resolve => {
        injectedScript.onload = function() {
            this.remove();
            resolve();
        };
    });
    insertHeaderNode(injectedScript);

    // Gate request adapter on injecting the extension script.
    const GPUPrototype = navigator.gpu.__proto__;
    const originalRequestAdapter = GPUPrototype.requestAdapter;

    GPUPrototype.requestAdapter = async function(options) {
        await scriptInjected;
        return await originalRequestAdapter.call(this, options);
    };
})();
    `;
    insertHeaderNode(inlinedScript);
    setTimeout(() => {
        inlinedScript.remove();
    }, 0);
}
