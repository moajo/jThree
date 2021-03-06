import PMXModel = require("./PMXModel");
import JThreeLogger = require("../../Base/JThreeLogger");
import Q = require("q");
class PMXTextureManager
{
  private model:PMXModel;

  private textures:HTMLImageElement[]|Q.Promise<HTMLImageElement>[]=[];

  private static _toons:string[] = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////Nzc1XNMFjAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////14eF2pXIGAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX///+ampo+MvaSAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////47+sAKyXFAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGFBMVEX/////5t3/6N7/7eX/+fb/9PD//Pv/8Op5dFmOAAAAQklEQVQoz2MYBRQDtjQYgAq4gEAIiEiBCIYiAEjYjaEcBIrLoSA0lMEYDTAooQEGRQgtqAgTEEQD5AgoYQggAFgOAHEkIrrgwCawAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAflBMVEX/7WHDrAPErQT/7mT/7mn66Fj86VvizTLJswz/8of/8Hf/73L+7F7NtxLLtQ7/7mb///z//ez//OL/+9vs2ELk0Db//vX/+L7/723o1DzRvBjFrgX/+sz/+Lr/9qzw3Uj/+tL/97b/9Jf/85D/9Z//8X//6DHFrgb/+MD/5AUNrqVlAAAAwklEQVQ4y+XO226DMAwAUG/OutmhgyQQkgYYl162///BmaoV7UPFc9XzYlu2bMNrQrhS16hyRMxVCLlSgWrNmpkPvP8lDogKutb4Qbvajc5b6xpr92071qbvTMNMPfjCdzgVoulJkx2oNW4wtulqYl8YoIkVaq1lOcB8Sy4hjk4SDHTQd+8tcLokR1jxByuO8CKybDP7uLE5y84AyrKMsaqqz4VUMUZp/AjYbcW3+FrM5VbsBJxSen8kpXSCtxVPMfAPmVcPlflaGvEAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII="
  ];

  public static _imgConvertedToons:HTMLImageElement[] =[];

  constructor(model:PMXModel)
  {
    this.model = model;
  }

  public generateSharedToonImg(index:number):HTMLImageElement
  {
    if(PMXTextureManager._imgConvertedToons[index])
    {
      return PMXTextureManager._imgConvertedToons[index];
    }else
    {
      const imgTag = document.createElement("img");
      imgTag.src = PMXTextureManager._toons[index];
      PMXTextureManager._imgConvertedToons[index] = imgTag;
      return imgTag;
    }
  }

  public loadTexture(index:number):Q.Promise<HTMLImageElement>
  {
    if(this.textures[index] && typeof this.textures[index] === "object")return Q.Promise<HTMLImageElement>((resolver,reject,notify)=>{resolver(this.textures[index])});//Assume texture was loaded
    if(this.textures[index]&& typeof this.textures[index] ==="function")return <Q.Promise<HTMLImageElement>>this.textures[index];//Assume texture is loading
    var loadingPromise =  Q.Promise<HTMLImageElement>((resolver, reject, notify) =>
    {
        var img = new Image();
        img.onload = () =>
        {
            this.textures[index] = img;
            resolver(img);
            this.model.loadedTextureCount++;
            JThreeLogger.sectionLog("pmx texture",`loaded texture ${this.model.loadedTextureCount} / ${this.model.loadingTextureCount}`);
            if(this.model.loadingTextureCount == this.model.loadedTextureCount)this.model.onload.fire(this.model,this.model);
        }
        img.onerror = () =>
        {
          this.textures[index] = img;
          resolver(img);
          this.model.loadedTextureCount++;
          JThreeLogger.sectionError("pmx texture",`load failure texture ${this.model.loadedTextureCount} / ${this.model.loadingTextureCount} ${img.src}`);
          if(this.model.loadingTextureCount == this.model.loadedTextureCount)this.model.onload.fire(this.model,this.model);
        }
        img.src = this.model.modelDirectory + this.model.ModelData.Textures[index];
        this.model.loadingTextureCount++;
    });
    this.textures[index] = loadingPromise;
    return loadingPromise;
  }
}

export = PMXTextureManager;
