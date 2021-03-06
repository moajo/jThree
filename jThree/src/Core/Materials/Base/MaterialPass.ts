import Material = require("../Material");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("./IVariableInfo");
import IParsedProgramResult = require("./IParsedProgramResult");
import IMaterialConfigureArgument = require("./IMaterialConfigureArgument");
import BasicMaterial = require("./BasicMaterial");
import XMMLRenderConfigUtility = require("./XMMLRenderConfigUtility");
import Program = require("../../Resources/Program/Program");
import Shader = require("../../Resources/Shader/Shader");
import ShaderType = require("../../../Wrapper/ShaderType");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../ResourceManager");
import XMMLShaderParser = require("./XMMLShaderParser");
import Delegates = require("../../../Base/Delegates");
class MaterialPass {
    public fragmentShaderSource: string;

    public vertexShaderSource: string;

    public fragmentShader: Shader;

    public vertexShader: Shader;

    public program: Program;

    private _passDocument: Element;

    public parsedProgram: IParsedProgramResult;

    constructor(passDocument: Element, materialName: string, index: number) {
        this._passDocument = passDocument;
        this._parseGLSL();
        this._constructProgram(materialName + index);
    }

    private _parseGLSL(): void {
        const shaderCode = this._passDocument.getElementsByTagName("glsl").item(0).textContent;
        const parsedCodes = XMMLShaderParser.parseCombined(shaderCode);
        this.parsedProgram = parsedCodes;
        this.fragmentShaderSource = parsedCodes.fragment;
        this.vertexShaderSource = parsedCodes.vertex;
    }

    private _constructProgram(idPrefix: string): void {
        this.fragmentShader = MaterialPass._resourceManager.createShader(idPrefix + "-fs", this.fragmentShaderSource, ShaderType.FragmentShader);
        this.vertexShader = MaterialPass._resourceManager.createShader(idPrefix + "-vs", this.vertexShaderSource, ShaderType.VertexShader);
        this.fragmentShader.loadAll();
        this.vertexShader.loadAll();
        this.program = MaterialPass._resourceManager.createProgram(idPrefix + "-program", [this.vertexShader, this.fragmentShader]);
    }

    public configureMaterial(matArg: IMaterialConfigureArgument, uniformRegisters: Delegates.Action4<WebGLRenderingContext, ProgramWrapper, IMaterialConfigureArgument, { [key: string]: IVariableInfo }>[],material:Material): void {
        const gl = matArg.renderStage.GL;
        const pWrapper = this.program.getForContext(matArg.renderStage.Renderer.ContextManager);
        const defRendererConfig = matArg.renderStage.DefaultRenderConfigures;
        XMMLRenderConfigUtility.applyCullConfigure(gl, this._passDocument,defRendererConfig.cullOrientation);
        XMMLRenderConfigUtility.applyDepthTestConfigure(gl, this._passDocument, defRendererConfig.depthEnabled, defRendererConfig.depthMode, defRendererConfig.depthMask);
        XMMLRenderConfigUtility.applyBlendFuncConfigure(gl, this._passDocument, defRendererConfig.blendEnabled,defRendererConfig.blendSrcColor,defRendererConfig.blendDstColor,defRendererConfig.blendSrcAlpha,defRendererConfig.blendDstAlpha);
        //Declare using program before assigning material variables
        pWrapper.useProgram();
        //Apply attribute variables by geometries
        matArg.object.Geometry.applyAttributeVariables(pWrapper, this.parsedProgram.attributes);
        //Apply uniform variables
        uniformRegisters.forEach((r) => {
            r(gl, pWrapper, matArg, this.parsedProgram.uniforms);
        });
        material.registerMaterialVariables(matArg.renderStage.Renderer,pWrapper,this.parsedProgram.uniforms);
    }

    private static get _resourceManager(): ResourceManager {
        return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    }
}

export = MaterialPass;
