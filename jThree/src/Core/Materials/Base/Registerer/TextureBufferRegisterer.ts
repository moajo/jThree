import Matrix = require("../../../../Math/Matrix");
import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("../IVariableInfo");
import IMaterialConfigureArgument = require("../IMaterialConfigureArgument");
const TextureBufferRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IMaterialConfigureArgument, uniforms: { [key: string]: IVariableInfo }) => {
  for(let variableName in uniforms)
  {
    const uniform = uniforms[variableName];
    if(variableName[0] !== '_' || uniform.variableType !='sampler2D')continue;
    if(uniform.variableAnnotation["type"] === 'buffer')
    {
      const bufferName = uniform.variableAnnotation['name'];
      if(!bufferName || !matArg.textureResource[bufferName])continue;
      let register = parseInt(uniform.variableAnnotation['register']);
      if(!register)register = 0;
      pWrapper.uniformSampler2D(variableName,matArg.textureResource[bufferName],register);
    }
  }
}

export = TextureBufferRegisterer;
