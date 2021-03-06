import GLExtensionManager = require("./GLExtensionManager");
import Rectangle = require("../Math/Rectangle");
import JThreeContext = require("../JThreeContext");
import BasicRenderer = require("./Renderers/BasicRenderer");
import ClearTargetType = require("../Wrapper/ClearTargetType");
import JThreeEvent = require('../Base/JThreeEvent');
import CanvasSizeChangedEventArgs = require('./CanvasSizeChangedEventArgs');
import Delegates = require('../Base/Delegates');
import ContextComponents = require("../ContextComponents");
import CanvasManager = require("./CanvasManager");
import Debugger = require("../Debug/Debugger");
import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import Color4 = require("../Math/Color4");
import CanvasRegion = require("./CanvasRegion");
/**
 * The class to manage HTMLCanvasElement.
 * Provides most of interfaces related to GLContext except the features resource manager providing.
 *
 * HTMLCanvasElementを管理するクラス
 * リソースマネージャーが提供する機能以外のGLContextが関連する機能のほとんどを内包します。
 */
class Canvas extends CanvasRegion {

    /**
     * Constructor
     * @param  {HTMLCanvasElement} canvasElement the HTMLCanvasElement that is managed by this class.
     */
    constructor(canvasElement: HTMLCanvasElement) {
        super(canvasElement);
        this._lastWidth = canvasElement.width;
        this._lastHeight = canvasElement.height;
        this.__setGLContext(this._tryGetGLContext());
    }

    /**
     * Attempts to try getting GLContext from canvas.
     * @return {WebGLRenderingContext} [description]
     */
    private _tryGetGLContext(): WebGLRenderingContext {
        try {
            return <WebGLRenderingContext>this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl");
        } catch (e) {
            console.error("WebGL context generation failed" + e);
        }
    }

    /**
     * canvas height of last time
     */
    private _lastHeight: number;

    /**
     * canvas width of last time
     */
    private _lastWidth: number;

    /**
     * event cache for resize event.
     */
    public canvasResized: JThreeEvent<CanvasSizeChangedEventArgs> = new JThreeEvent<CanvasSizeChangedEventArgs>();

    /**
     * Called after rendering. It needs super.afterRenderer(renderer) when you need to override.
     */
    public afterRender(renderer: BasicRenderer): void {
    }

    public afterRenderAll(): void {
    }
    public beforeRender(renderer: BasicRenderer): void {
        this.clearCanvas();
    }
    public beforeRenderAll(): void {
        //check size changed or not.
        if (this.canvasElement.height !== this._lastHeight || this.canvasElement.width !== this._lastWidth) {
            this.canvasResized.fire(this, new CanvasSizeChangedEventArgs(this, this._lastWidth, this._lastHeight, this.canvasElement.width, this.canvasElement.height));
            this._lastHeight = this.canvasElement.height; this._lastWidth = this.canvasElement.width;
        }
    }
    /**
     * clear the default buffer of this canvas with ClearColor.
     */
    public clearCanvas(): void {
        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, null);//binds to default buffer.
        this.applyClearColor();
        this.GL.clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
    }

    public get region(): Rectangle {
        return new Rectangle(0, 0, this._lastWidth, this._lastHeight);
    }
    /**
    * backing field for ClearColor
    */
    public clearColor: Color4 = new Color4(1, 1, 1, 1);
    public GL: WebGLRenderingContext;
    public glExtensionManager: GLExtensionManager = new GLExtensionManager();
    /**
     * apply gl context after webglrendering context initiated.
     */
    protected __setGLContext(glContext: WebGLRenderingContext) {
        this.GL = glContext;
        this.glExtensionManager.checkExtensions(glContext);
    }

    public applyClearColor() {
        this.GL.clearColor(this.clearColor.R, this.clearColor.G, this.clearColor.B, this.clearColor.A);
    }
}


export =Canvas;
