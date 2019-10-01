!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=6)}([function(e,t,r){"use strict";r.d(t,"e",(function(){return n})),r.d(t,"c",(function(){return o})),r.d(t,"d",(function(){return i})),r.d(t,"b",(function(){return a})),r.d(t,"f",(function(){return c})),r.d(t,"a",(function(){return l}));const n="REGISTER_SHADER_MODULE",o="INIT_CONTENT_SCRIPT",i="INIT_EDITOR",a="EDITOR_CONNECTED",c="UPDATED_SHADER_MODULE",l="CLEAR_EDITOR"},function(e,t,r){"use strict";r.d(t,"b",(function(){return n})),r.d(t,"a",(function(){return o}));const n=()=>Math.random().toString(36).substring(2,15);function o(e){const t=[document.body,document.head,document.documentElement];for(let r=0;r<t.length;r++){const n=t[r];if(n){n.firstElementChild?n.insertBefore(e,n.firstElementChild):n.appendChild(e);break}}}},,,,,function(e,t,r){"use strict";r.r(t);var n=r(0),o=r(1);const i=e=>(void 0===e.__WEBGPU_SHADER_TOOLS__&&(e.__WEBGPU_SHADER_TOOLS__={}),e.__WEBGPU_SHADER_TOOLS__);let a=void 0;navigator.gpu&&(a=GPUDevice.prototype.createShaderModule);const c={code:void 0};function l(e){return e.compile?c.code=e.compile(e.code):c.code=e.code,a.call(this,c)}navigator.gpu&&a!==l&&(GPUDevice.prototype.createShaderModule=l);const p=function(e){let t=0;window.addEventListener("message",(function(e){const o=e.data;if("object"==typeof o&&null!==o)switch(o.type){case n.b:t+=1;break;case n.f:r[o.id]=o.updatedCode}}));const r={};function a(e){if(!e||!e.module)return;const t=e.module,r=i(t);window.postMessage({type:n.e,id:r.id,code:r.descriptor.code})}function c(e){const r=i(e);if(r.connectionGeneration==t)return;r.connectionGeneration=t;const n=r.descriptor;a(n.vertexStage),a(n.fragmentStage),a(n.computeStage)}function l(t){if(!t||!t.module)return;const n=t.module,o=i(n);if(o.id in r){const t=r[o.id];delete r[o.id],o.descriptor.code=t;try{const t=e.createShaderModule.call(o.device,o.descriptor);Object.assign(i(t),o),o.replacement=t,o.generation+=1}catch(e){console.error(e)}}return o.generation}function p(t){if(0==Object.keys(r).length)return;const n=i(t),o=n.descriptor,a=l(o.vertexStage),c=l(o.fragmentStage),p=l(o.computeStage),d=void 0!==a&&a!==n.vertexStageGeneration,u=void 0!==c&&c!==n.fragmentStageGeneration,s=void 0!==p&&p!==n.computeStageGeneration;(d||u||s)&&(d&&(o.vertexStage.module=i(o.vertexStage.module).replacement),u&&(o.fragmentStage.module=i(o.fragmentStage.module).replacement),s&&(o.computeStage.module=i(o.computeStage.module).replacement),d||u?n.replacement=e.createRenderPipeline.call(n.device,o):s&&(n.replacement=e.createComputePipeline.call(n.device,o)))}const d=e=>e&&{module:e.module,entryPoint:e.entryPoint},u=e=>e&&{frontFace:e.frontFace,cullMode:e.cullMode,depthBias:e.depthBias,depthBiasSlopeScale:e.depthBiasSlopeScale,depthBiasClamp:e.depthBiasClamp},s=e=>e&&{format:e.format,alphaBlend:e.alphaBlend,colorBlend:e.colorBlend,writeMask:e.writeMask},f=e=>e&&{compare:e.compare,failOp:e.failOp,depthFailOp:e.depthFailOp,passOp:e.passOp},m=e=>e&&{format:e.format,depthWriteEnabled:e.depthWriteEnabled,depthCompare:e.depthCompare,stencilFront:f(e.stencilFront),stencilBack:f(e.stencilBack),stencilReadMask:e.stencilReadMask,stencilWriteMask:e.stencilWriteMask},S=e=>e&&{offset:e.offset,format:e.format,shaderLocation:e.shaderLocation},g=e=>{if(e){if(!e.attributeSet)throw new Error("Missing attributeSet");if("function"!=typeof e.attributeSet[Symbol.iterator])throw new Error("attributeSet is not iterable");return{stride:e.stride,stepMode:e.stepMode,attributeSet:Array.from(e.attributeSet,S)}}},v=e=>{if(e){if(e.vertexBuffers&&"function"!=typeof e.vertexBuffers[Symbol.iterator])throw new Error("vertexBuffers is not iterable");return{indexFormat:e.indexFormat,vertexBuffers:e.vertexBuffers&&Array.from(e.vertexBuffers,g)}}};return{createShaderModule(t,r){r={code:r.code,compile:r.compile};const n=Object(o.b)(),a=e.createShaderModule.call(t,r),c=i(a);return c.device=t,c.descriptor=r,c.id=n,c.replacement=void 0,c.generation=0,a},createRenderPipeline(t,r){r=(e=>{if(e){if(!e.colorStates)throw new Error("Missing colorStates");if("function"!=typeof e.colorStates[Symbol.iterator])throw new Error("colorStates is not iterable");return{layout:e.layout,vertexStage:d(e.vertexStage),fragmentStage:d(e.fragmentStage),primitiveTopology:e.primitiveTopology,rasterizationState:u(e.rasterizationState),colorStates:Array.from(e.colorStates,s),depthStencilState:m(e.depthStencilState),vertexInput:v(e.vertexInput),sampleCount:e.sampleCount,sampleMask:e.sampleMask,alphaToCoverageEnabled:e.alphaToCoverageEnabled}}})(r);const n=e.createRenderPipeline.call(t,r),o=i(n);return o.device=t,o.descriptor=r,o.replacement=void 0,o.vertexStageGeneration=0,o.fragmentStageGeneration=0,o.shaderRegistrationGeneration=0,n},createComputePipeline(t,r){r=(e=>e&&{layout:e.layout,computeStage:d(e.computeStage)})(r);const n=e.createComputePipeline.call(t,r),o=i(n);return o.device=t,o.descriptor=r,o.replacement=void 0,o.computeStageGeneration=0,o.shaderRegistrationGeneration=0,n},setRenderPipeline:(t,r)=>(c(r),p(r),e.setRenderPipeline.call(t,i(r).replacement||r)),setComputePipeline:(t,r)=>(c(r),p(r),r=i(r).replacement||r,e.setComputePipeline.call(t,i(r).replacement||r))}}({createShaderModule:GPUDevice.prototype.createShaderModule,createRenderPipeline:GPUDevice.prototype.createRenderPipeline,createComputePipeline:GPUDevice.prototype.createComputePipeline,setRenderPipeline:GPURenderPassEncoder.prototype.setPipeline,setComputePipeline:GPUComputePassEncoder.prototype.setPipeline});GPUDevice.prototype.createShaderModule=function(e){return p.createShaderModule(this,e)},GPUDevice.prototype.createRenderPipeline=function(e){return p.createRenderPipeline(this,e)},GPUDevice.prototype.createComputePipeline=function(e){return p.createComputePipeline(this,e)},GPURenderPassEncoder.prototype.setPipeline=function(e){return p.setRenderPipeline(this,e)},GPUComputePassEncoder.prototype.setPipeline=function(e){return p.setComputePipeline(this,e)}}]);