import IMaterialConfigureArgument = require("../Base/IMaterialConfigureArgument");
import IMaterialConfig = require("../IMaterialConfig");
import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Matrix = require("../../../Math/Matrix");
import Vector4 = require("../../../Math/Vector4");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");

class HitTestMaterial extends Material {
    protected program: Program;
    constructor() {
        super();
        var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../../Shaders/SolidColor.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.solidcolor", "jthree.programs.solidcolor", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        var renderer = matArg.renderStage.Renderer;
        const object = matArg.object;
        //super.configureMaterial(scene, renderStage, object, texs, techniqueIndex, passIndex);
        var r = 0xFF00 & (matArg.renderStage as any).___objectIndex;
        var g = 0x00FF & (matArg.renderStage as any).___objectIndex;
        var geometry = object.Geometry;
        var pWrapper = this.program.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);
        pWrapper.useProgram();
        pWrapper.uniformMatrix("matMVP",v);
        pWrapper.uniformMatrix("matMV",Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal) );
        pWrapper.uniformVector("u_color",new Vector4(r /0xFF,  g/0xFF, 0, 1));
        pWrapper.assignAttributeVariable("position",geometry.PositionBuffer);
        pWrapper.assignAttributeVariable("normal",geometry.NormalBuffer);
        geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
    }

    public getMaterialConfig(pass: number, technique: number): IMaterialConfig {
        return {
            cull: "ccw",
            blend: false
        }
    }

    public get MaterialGroup(): string {
        return "jthree.materials.hitarea";
    }
}

export =HitTestMaterial;
