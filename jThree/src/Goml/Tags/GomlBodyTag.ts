import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
class GomlBodyTag extends GomlTagBase
{
    CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase { throw new Error("Not implemented"); }

    get TagName(): string { return "BODY"; }

}

export=GomlBodyTag;