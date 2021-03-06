import BasicMaterial = require("../Core/Materials/Base/BasicMaterial");
import Geometry = require("../Core/Geometries/Geometry");
import Material = require("../Core/Materials/Material");
import Mesh = require('./Mesh');
import GBufferMaterial = require("../Core/Materials/Buffering/GBufferMaterial");
import ShadowMapMaterial = require("../Core/Materials/Buffering/ShadowMapMaterial");
import HitAreaTestMaterial = require("../Core/Materials/Buffering/HitAreaMaterial");
class BasicMeshObject extends Mesh
    {
        constructor(geometry:Geometry,mat:Material)
        {
            super(geometry,mat);
            this.addMaterial(new GBufferMaterial());
            this.addMaterial(new ShadowMapMaterial());
            this.addMaterial(new HitAreaTestMaterial());
        }
    }

export=BasicMeshObject;
