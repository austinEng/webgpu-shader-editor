!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";n.d(t,"e",(function(){return o})),n.d(t,"c",(function(){return r})),n.d(t,"d",(function(){return i})),n.d(t,"b",(function(){return c})),n.d(t,"f",(function(){return s})),n.d(t,"a",(function(){return d}));const o="REGISTER_SHADER_MODULE",r="INIT_CONTENT_SCRIPT",i="INIT_EDITOR",c="EDITOR_CONNECTED",s="UPDATED_SHADER_MODULE",d="CLEAR_EDITOR"},,,function(e,t,n){"use strict";n.r(t);var o=n(0);const r={};class i{constructor(){this._editorConnection=null,this._contentScriptConnection=null}setContentScript(e){this._contentScriptConnection=e,e&&e.onDisconnect.addListener(()=>this._contentScriptConnection=null),this.sendEditorId(),this._editorConnection&&this._editorConnection.postMessage({type:o.a})}setEditor(e){this._editorConnection=e,e&&e.onDisconnect.addListener(()=>this._editorConnection=null),this.sendEditorId()}sendEditorId(){this._editorConnection&&this._contentScriptConnection&&this._contentScriptConnection.postMessage({type:o.b,id:this._editorConnection.sender.id})}registerShaderModule(e){this._editorConnection&&this._editorConnection.postMessage(e)}updateShaderModule(e){this._contentScriptConnection&&this._contentScriptConnection.postMessage(e)}}chrome.runtime.onConnect.addListener((function(e){function t(e,t){console.log(e,t);const n=e.tabId||t.sender&&t.sender.tab&&t.sender.tab.id;switch(void 0===n&&console.error("No tabId"),void 0===r[n]&&(r[n]=new i),e.type){case o.d:r[n].setEditor(t);break;case o.c:r[n].setContentScript(t);break;case o.e:r[n].registerShaderModule(e);break;case o.f:r[n].updateShaderModule(e)}}e.onMessage.addListener(t),e.onDisconnect.addListener((function(n){console.log("disconnection",n),e.onMessage.removeListener(t),function(e,t){const n=Object.keys(t);for(let o=0,r=n.length;o<r;++o)if(t[n[o]]==e){console.log("Removed",t[n[o]]),delete t[n[o]];break}}(n,r)}))}))}]);