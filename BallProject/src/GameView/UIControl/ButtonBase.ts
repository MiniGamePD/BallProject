abstract class ButtonBase extends egret.DisplayObjectContainer
{
    protected bg:egret.DisplayObject;
    protected fg:egret.DisplayObject;
    protected clickCallback:Function;
    protected callbackObj:any;

    protected OnButtonClick()
    {

    }

    protected OnButtonHover()
    {

    }
}

class ButtonParam
{
    public constructor(bgType:string, fgType:string, bgParam:string, fgParam:string, bgWidth:number, bgHeight:number, fgWidth:number, fgHeight:number)
    {
        this.bgType = bgType;
        this.fgType = fgType;
        this.bgParam = bgParam;
        this.fgParam = fgParam;
        this.bgWidth = bgWidth;
        this.bgHeight = bgHeight;
        this.fgWidth = fgWidth;
        this.fgHeight = fgHeight;
    }

    public bgType:string;
    public fgType:string;
    public bgParam:string;
    public fgParam:string;
    public bgWidth:number;
    public bgHeight:number;
    public fgWidth:number;
    public fgHeight:number;
}