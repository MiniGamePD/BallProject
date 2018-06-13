class ShapeBgButton extends ButtonBase
{
    public constructor(bgColor:number, bgThickness:number, fgPath:string, bgWidth:number, bgHeight:number, fgWidth:number, fgHeight:number)
    {
        super();
        this.bg = new egret.Shape();
        var temp = <egret.Shape>this.bg;
        temp.graphics.lineStyle( bgThickness, bgColor );
        temp.graphics.beginFill(0x000000, 0);
        temp.graphics.drawRect(0,0,bgWidth,bgHeight);
        temp.graphics.endFill();
        this.addChild(this.bg);

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
}