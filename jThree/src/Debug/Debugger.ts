import IContextComponent = require("../IContextComponent");
import ContextComponents = require("../ContextComponents");
import DebuggerModuleBase = require("./Modules/DebuggerModuleBase");
import SceneStructureDebugger = require("./Modules/SceneStructureDebugger");
import GLSpecDebugger = require("./Modules/GLSpecDebugger");
import DebuggerAPI = require("./DebuggerAPI");
class Debugger implements IContextComponent
{
  public getContextComponentIndex()
  {
    return ContextComponents.Debugger;
  }

  private debuggerModules:DebuggerModuleBase[] = [new SceneStructureDebugger(),new GLSpecDebugger()];

  private debuggerAPI:DebuggerAPI;

  constructor()
  {
    this.debuggerAPI = (<any>window).j3d;
    if(!this.debuggerAPI)
    {
      console.warn("Debugger API was not found! Did you surely import j3d.js?\nDebugger will not be attached.")
    }
  }

  public attach():void
  {
    if(this.debuggerAPI)
    {
      this.debuggerModules.forEach(m=>m.attach(this))
      console.warn("Debugger API was attached.");
    };
  }

  public setInfo(key:string,val:number|string)
  {
    this.debuggerAPI.info.setInfo(key,val);
  }
}

export = Debugger;