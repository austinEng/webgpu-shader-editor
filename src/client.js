import { EDITOR_CONNECTED, REGISTER_SHADER_MODULE, UPDATED_SHADER_MODULE } from './messages';
import { randomId } from './helpers';

const getInfo = obj => {
    if (obj.__WEBGPU_SHADER_TOOLS__ === undefined) {
        obj.__WEBGPU_SHADER_TOOLS__ = {};
    }
    return obj.__WEBGPU_SHADER_TOOLS__;
}

export default function Client(fn) {

    let connectionGeneration = 0;

    window.addEventListener('message', function (event) {
        const message = event.data;
        if (typeof message !== 'object' || message === null) {
            return;
        }

        switch (message.type) {
            case EDITOR_CONNECTED:
                connectionGeneration += 1;
                break;

            case UPDATED_SHADER_MODULE:
                shaderModuleUpdates[message.id] = message.updatedCode;
                break;
        }
    });

    const shaderModuleUpdates = {};

    function registerShaderStage(shaderStage) {
        if (!shaderStage || !shaderStage.module) {
            return;
        }
        const shaderModule = shaderStage.module;
        const info = getInfo(shaderModule);

        window.postMessage({
            type: REGISTER_SHADER_MODULE,
            id: info.id,
            code: info.descriptor.code,
        });
    }

    function registerShaders(pipeline) {
        const info = getInfo(pipeline);
        if (info.connectionGeneration == connectionGeneration) {
            return;
        }
        info.connectionGeneration = connectionGeneration;

        const descriptor = info.descriptor;
        registerShaderStage(descriptor.vertexStage);
        registerShaderStage(descriptor.fragmentStage);
        registerShaderStage(descriptor.computeStage);
    }

    function updateShaderStage(shaderStage) {
        if (!shaderStage || !shaderStage.module) {
            return undefined;
        }
        const shaderModule = shaderStage.module;
        const info = getInfo(shaderModule);
        if (info.id in shaderModuleUpdates) {
            const updatedCode = shaderModuleUpdates[info.id];
            delete shaderModuleUpdates[info.id];

            info.descriptor.code = updatedCode;

            try {
                const replacement = fn.createShaderModule.call(info.device, info.descriptor);
                Object.assign(getInfo(replacement), info);

                info.replacement = replacement;
                info.generation += 1;
            } catch (e) {
                console.error(e);
            }
        }

        return info.generation;
    }

    function updatePipeline(pipeline) {
        if (Object.keys(shaderModuleUpdates).length == 0) {
            return;
        }

        const info = getInfo(pipeline);
        const descriptor = info.descriptor;

        const vertexStageGeneration = updateShaderStage(descriptor.vertexStage);
        const fragmentStageGeneration = updateShaderStage(descriptor.fragmentStage);
        const computeStageGeneration = updateShaderStage(descriptor.computeStage);

        const vertexStageUpdated = (vertexStageGeneration !== undefined && vertexStageGeneration !== info.vertexStageGeneration);
        const fragmentStageUpdated = (fragmentStageGeneration !== undefined && fragmentStageGeneration !== info.fragmentStageGeneration);
        const computeStageUpdated = (computeStageGeneration !== undefined && computeStageGeneration !== info.computeStageGeneration);

        if (!(vertexStageUpdated || fragmentStageUpdated || computeStageUpdated)) {
            return;
        }

        if (vertexStageUpdated) {
            descriptor.vertexStage.module = getInfo(descriptor.vertexStage.module).replacement;
        }

        if (fragmentStageUpdated) {
            descriptor.fragmentStage.module = getInfo(descriptor.fragmentStage.module).replacement;
        }

        if (computeStageUpdated) {
            descriptor.computeStage.module = getInfo(descriptor.computeStage.module).replacement;
        }

        if (vertexStageUpdated || fragmentStageUpdated) {
            info.replacement = fn.createRenderPipeline.call(info.device, descriptor);
        } else if (computeStageUpdated) {
            info.replacement = fn.createComputePipeline.call(info.device, descriptor);
        }
    }

    const cloneProgrammableStageDescriptor = descriptor => (descriptor && {
        module: descriptor.module,
        entryPoint: descriptor.entryPoint,
    });

    const cloneRasterizationStateDescriptor = descriptor => (descriptor && {
        frontFace: descriptor.frontFace,
        cullMode: descriptor.cullMode,
        depthBias: descriptor.depthBias,
        depthBiasSlopeScale: descriptor.depthBiasSlopeScale,
        depthBiasClamp: descriptor.depthBiasClamp,
    });

    const cloneColorStateDescriptor = descriptor => (descriptor && {
        format: descriptor.format,
        alphaBlend: descriptor.alphaBlend,
        colorBlend: descriptor.colorBlend,
        writeMask: descriptor.writeMask,
    });

    const cloneStencilStateFaceDescriptor = descriptor => (descriptor && {
        compare: descriptor.compare,
        failOp: descriptor.failOp,
        depthFailOp: descriptor.depthFailOp,
        passOp: descriptor.passOp,
    });

    const cloneDepthStencilStateDescriptor = descriptor => (descriptor && {
        format: descriptor.format,
        depthWriteEnabled: descriptor.depthWriteEnabled,
        depthCompare: descriptor.depthCompare,
        stencilFront: cloneStencilStateFaceDescriptor(descriptor.stencilFront),
        stencilBack: cloneStencilStateFaceDescriptor(descriptor.stencilBack),
        stencilReadMask: descriptor.stencilReadMask,
        stencilWriteMask: descriptor.stencilWriteMask,
    });

    const cloneVertexAttributeDescriptor = descriptor => (descriptor && {
        offset: descriptor.offset,
        format: descriptor.format,
        shaderLocation: descriptor.shaderLocation,
    });

    const cloneVertexBufferDescriptor = descriptor => {
        if (!descriptor) {
            return undefined;
        }
        if (!descriptor.attributeSet) {
            throw new Exception('Missing attributeSet');
        }
        if (typeof descriptor.attributeSet[Symbol.iterator] !== 'function') {
            throw new Exception('attributeSet is not iterable');
        }
        return {
            stride: descriptor.stride,
            stepMode: descriptor.stepMode,
            attributeSet: Array.from(descriptor.attributeSet, cloneVertexAttributeDescriptor),
        };
    }

    const cloneVertexInputDescriptor = descriptor => {
        if (!descriptor) {
            return undefined;
        }
        if (descriptor.vertexBuffers && typeof descriptor.vertexBuffers[Symbol.iterator] !== 'function') {
            throw new Exception('vertexBuffers is not iterable');
        }
        return {
            indexFormat: descriptor.indexFormat,
            vertexBuffers: descriptor.vertexBuffers && Array.from(descriptor.vertexBuffers, cloneVertexBufferDescriptor),
        };
    }

    const cloneRenderPipelineDescriptor = descriptor => {
        if (!descriptor) {
            return undefined;
        }
        if (!descriptor.colorStates) {
            throw new Exception('Missing colorStates');
        }
        if (typeof descriptor.colorStates[Symbol.iterator] !== 'function') {
            throw new Exception('colorStates is not iterable');
        }
        return {
            layout: descriptor.layout,
            vertexStage: cloneProgrammableStageDescriptor(descriptor.vertexStage),
            fragmentStage: cloneProgrammableStageDescriptor(descriptor.fragmentStage),
            primitiveTopology: descriptor.primitiveTopology,
            rasterizationState: cloneRasterizationStateDescriptor(descriptor.rasterizationState),
            colorStates: Array.from(descriptor.colorStates, cloneColorStateDescriptor),
            depthStencilState: cloneDepthStencilStateDescriptor(descriptor.depthStencilState),
            vertexInput: cloneVertexInputDescriptor(descriptor.vertexInput),
            sampleCount: descriptor.sampleCount,
            sampleMask: descriptor.sampleMask,
            alphaToCoverageEnabled: descriptor.alphaToCoverageEnabled,
        };
    };

    const cloneComputePipelineDescriptor = descriptor => (descriptor && {
        layout: descriptor.layout,
        computeStage: cloneProgrammableStageDescriptor(descriptor.computeStage),
    });

    return {
        createShaderModule(device, descriptor) {
            descriptor = {
                code: descriptor.code,
                compile: descriptor.compile,
            };

            const id = randomId();
            const shaderModule = fn.createShaderModule.call(device, descriptor);
            const info = getInfo(shaderModule);
            info.device = device;
            info.descriptor = descriptor;
            info.id = id;
            info.replacement = undefined;
            info.generation = 0;

            return shaderModule;
        },

        createRenderPipeline(device, descriptor) {
            descriptor = cloneRenderPipelineDescriptor(descriptor);

            const pipeline = fn.createRenderPipeline.call(device, descriptor);
            const info = getInfo(pipeline);
            info.device = device;
            info.descriptor = descriptor;
            info.replacement = undefined;
            info.vertexStageGeneration = 0;
            info.fragmentStageGeneration = 0;
            info.shaderRegistrationGeneration = 0;

            return pipeline;
        },

        createComputePipeline(device, descriptor) {
            descriptor = cloneComputePipelineDescriptor(descriptor);

            const pipeline = fn.createComputePipeline.call(device, descriptor);
            const info = getInfo(pipeline);
            info.device = device;
            info.descriptor = descriptor;
            info.replacement = undefined;
            info.computeStageGeneration = 0;
            info.shaderRegistrationGeneration = 0;

            return pipeline;
        },

        setRenderPipeline(encoder, pipeline) {
            registerShaders(pipeline);
            updatePipeline(pipeline);
            return fn.setRenderPipeline.call(encoder, getInfo(pipeline).replacement || pipeline);
        },

        setComputePipeline(encoder, pipeline) {
            registerShaders(pipeline);
            updatePipeline(pipeline);
            pipeline = getInfo(pipeline).replacement || pipeline;
            return fn.setComputePipeline.call(encoder, getInfo(pipeline).replacement || pipeline);
        }
    };
}
