import Client from './client';
import installShaderCompilerLoader from 'webgpu-shader-compiler-loader';

installShaderCompilerLoader();

const fn = {
    createShaderModule: GPUDevice.prototype.createShaderModule,
    createRenderPipeline: GPUDevice.prototype.createRenderPipeline,
    createComputePipeline: GPUDevice.prototype.createComputePipeline,
    setRenderPipeline: GPURenderPassEncoder.prototype.setPipeline,
    setComputePipeline: GPUComputePassEncoder.prototype.setPipeline,
};

const client = Client(fn);

GPUDevice.prototype.createShaderModule = function createShaderModule(descriptor) {
    return client.createShaderModule(this, descriptor);
};

GPUDevice.prototype.createRenderPipeline = function createRenderPipeline(descriptor) {
    return client.createRenderPipeline(this, descriptor);
};

GPUDevice.prototype.createComputePipeline = function createComputePipeline(descriptor) {
    return client.createComputePipeline(this, descriptor);
};

GPURenderPassEncoder.prototype.setPipeline = function setRenderPipeline(pipeline) {
    return client.setRenderPipeline(this, pipeline);
};

GPUComputePassEncoder.prototype.setPipeline = function setComputePipeline(pipeline) {
    return client.setComputePipeline(this, pipeline);
};
