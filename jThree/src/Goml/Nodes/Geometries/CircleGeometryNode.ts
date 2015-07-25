import GeometryNodeBase = require("./GeometryNodeBase");
import GomlLoader = require("../../GomlLoader");
import Geometry = require("../../../Core/Geometries/Geometry")
import CircleGeometry = require("../../../Core/Geometries/CircleGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class CircleGeometryNode extends GeometryNodeBase
{
  private gridGeometry:CircleGeometry;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      this.attributes.defineAttribute
      (
        {
          "divide":
          {
            value:30,
            converter:"integer",
            handler:(v)=>{this.gridGeometry.DiviceCount=v.Value;}
          }
        }
      );
  }

  protected ConstructGeometry():Geometry
  {
    this.gridGeometry=new CircleGeometry(this.Name);
    return this.gridGeometry;
  }

  beforeLoad()
  {
    super.beforeLoad();
  }

}

export=CircleGeometryNode