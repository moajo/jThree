import Canvas = require("../../../Core/Canvas");
import JThreeContext = require("../../../JThreeContext");
import ContextComponents = require("../../../ContextComponents");
import CanvasManager = require("../../../Core/CanvasManager");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import CanvasNodeBase = require('./CanvasNodeBase');
import Delegates = require("../../../Base/Delegates");
import ResourceLoader = require("../../../Core/ResourceLoader");

class CanvasNode extends CanvasNodeBase {
  public canvasElement: HTMLCanvasElement;
  public targetFrame: HTMLElement;
  private resizedFunctions: Delegates.Action1<CanvasNode>[] = [];

  constructor() {
    super();
    this.attributes.defineAttribute({
      'frame': {
        value: undefined,
        converter: 'string',
      }
    });
  }

  protected onMount(): void {
    super.onMount();
    //generate canvas
    this.targetFrame = <HTMLElement>document.querySelector(this.Frame);
    var defaultLoader;
    // TODO: pnly
    // if (this.attributes.getValue("loader") !== "undefined" && this.nodeManager.nodeRegister.hasGroup("jthree.loader")) {
    //   var loaderNode = (this.nodeManager.nodeRegister.getObject("jthree.loader", this.attributes.getValue("loader")) as any);
    //   if (loaderNode) defaultLoader = loaderNode.loaderHTML;
    // }
    if (!defaultLoader) defaultLoader = require('../../../static/defaultLoader.html');

    //frame resize
    var resizeElement = document.createElement("div");
    resizeElement.style.position = "relative";
    resizeElement.style.margin = "0";
    resizeElement.style.padding = "0";
    resizeElement.style.height = "100%";
    this.targetFrame.appendChild(resizeElement);

    this.canvasElement = document.createElement("canvas");
    this.canvasElement.style.position = "absolute";

    if (this.targetFrame) resizeElement.appendChild(this.canvasElement);
    this.canvasElement.classList.add("x-j3-c-" + this.ID);
    this.emit('canvas-ready');

    //initialize contexts
    this.setCanvas(new Canvas(this.canvasElement));
    JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager).addCanvas(this.Canvas);

    var loaderContainer = document.createElement('div');
    loaderContainer.style.position = 'absolute';
    loaderContainer.style.width = this.canvasElement.width + "px";
    loaderContainer.style.height = this.canvasElement.height + "px";
    loaderContainer.classList.add("x-j3-loader-container");
    loaderContainer.innerHTML = defaultLoader;
    resizeElement.appendChild(loaderContainer);

    var progressLoaders = loaderContainer.querySelectorAll(".x-j3-loader-progress");
    JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).promise.then(() => {
      var loaders = resizeElement.querySelectorAll(".x-j3-loader-container");
      for (var i = 0; i < loaders.length; i++) {
        var loader = loaders.item(i);
        loader.remove();
      }
    }, () => { }, (p) => {
      for (var i = 0; i < progressLoaders.length; i++) {
        var progress = <HTMLDivElement>progressLoaders.item(i);
        progress.style.width = p.completedResource / p.resourceCount * 100 + "%";
      }
    });
  }

  public get Frame(): string {
    return this.attributes.getValue("frame") || "body";
  }

  /**
   *
   �C�x���g���΂���*/
  public resize();
  /**
   * �C�x���g�n���h���̓o�^
   * @param func
   * @returns {}
   */
  public resize(func: Delegates.Action1<CanvasNode>);
  public resize(func?: Delegates.Action1<CanvasNode>) {

    if (typeof arguments[0] === "function") {
      this.resizedFunctions.indexOf(arguments[0]) === -1 && this.resizedFunctions.push(arguments[0]);
    } else {
      this.sizeChanged(this.DefaultWidth, this.DefaultHeight);
      this.resizedFunctions.forEach(function(f) {
        f(this);
      }.bind(this));
    }

  }

  protected get DefaultWidth(): number {
    return this.targetFrame.clientWidth;
  }

  protected get DefaultHeight(): number {
    return this.targetFrame.clientHeight;
  }

  protected sizeChanged(width: number, height: number) {
    this.canvasElement.width = width;
    this.canvasElement.height = height;
  }



}

export =CanvasNode;
