import IParentSceneChangedEventArgs = require("../IParentSceneChangedEventArgs");
import Color4 = require('../../Math/Color4');
import Vector3 = require('../../Math/Vector3');
import SceneObject = require('../SceneObject');
import Canvas = require('../Canvas');
import Scene = require('../Scene');
import BasicRenderer = require('../Renderers/BasicRenderer');
import JThreeEvent = require("../../Base/JThreeEvent");
import Delegates = require("../../Base/Delegates");
import Material = require("../Materials/Material");
class LightBase extends SceneObject
{
    protected scene: Scene;

    private parameterChanged:JThreeEvent<LightBase>=new JThreeEvent();

	constructor(scene:Scene)
	{
		super();
		this.scene=scene;
	}

	private color:Color4=new Color4(0,0,0,0);

	public get Color():Color4
	{
		return this.color;
	}

	public set Color(col:Color4)
	{
		this.color=col;
	}

	public get Position():Vector3
	{
		return this.Transformer.Position;
	}

	public get LightType():string
	{
		return null;
	}

	public drawBuffer(renderer:BasicRenderer,scene:Scene,object: SceneObject, material: Material,passCount:number) {
	}

	public beforeRender(target:Canvas)
	{

	}

	public afterRender(target:Canvas)
	{

  }

    public onParameterChanged(handler:Delegates.Action2<Object,LightBase>) {
        this.parameterChanged.addListener(handler);
    }

    public getParameters(renderer:BasicRenderer,shadowMapIndex?:number): number[] {
        return [];
    }

    public initializeLight()
    {

    }

    public onParentSceneChanged(info:IParentSceneChangedEventArgs)
    {
      if(info.lastParentScene)
      {
        //info.lastParentScene.removeLight(this);
      }
      if(info.currentParentScene)info.currentParentScene.addLight(this);
    }
}

export = LightBase;
