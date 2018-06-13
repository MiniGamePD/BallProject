class ShapeBgButton extends ButtonBase
{
    public constructor(shapeBgType:ShapeBgType, bgColor:number, bgThickness:number, bgEllipse:number, 
        fgPath:string, bgWidth:number, bgHeight:number, fgWidth:number, fgHeight:number, 
        clickCallback:Function, callbackObj:any)
    {
        super();
        this.bg = new egret.Shape();
        var temp = <egret.Shape>this.bg;
        temp.graphics.lineStyle( bgThickness, bgColor );
        temp.graphics.beginFill(0x000000, 0);
        if(shapeBgType == ShapeBgType.Rect)
            temp.graphics.drawRect(0,0,bgWidth,bgHeight);
        else if(shapeBgType == ShapeBgType.RoundRect)
            temp.graphics.drawRoundRect(0,0,bgWidth,bgHeight,bgEllipse,bgEllipse);
        temp.graphics.endFill();
        this.addChild(this.bg);
        this.bg.touchEnabled = true;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnButtonClick, this);
        this.callbackObj = callbackObj;
        this.clickCallback = clickCallback;

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.fg = res.CreateBitmapByName(fgPath);
        this.fg.width = fgWidth;
        this.fg.height = fgHeight;
        this.fg.anchorOffsetX = fgWidth / 2;
        this.fg.anchorOffsetY = fgHeight / 2;
        this.fg.x = (bgWidth) / 2;
        this.fg.y = (bgHeight) / 2;
        this.addChild(this.fg);

        this.width = bgWidth;
        this.height = bgHeight;
        this.anchorOffsetX = bgWidth / 2;
        this.anchorOffsetY = bgHeight / 2;
    }

    protected OnButtonClick()
    {
        this.clickCallback();
    }
}

enum ShapeBgType
{
    RoundRect,
    Rect,
}