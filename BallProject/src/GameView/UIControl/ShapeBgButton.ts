class ShapeBgButton extends ButtonBase
{
    private clickResponseAnimTimer:egret.Timer;

    public constructor(shapeBgType:ShapeBgType, bgColor:number, bgThickness:number, bgEllipse:number, 
        fgPath:string, bgWidth:number, bgHeight:number, fgWidth:number, fgHeight:number, 
        clickCallback:Function, callbackObj:any)
    {
        super();
        this.bg = new egret.Shape();
        var temp = <egret.Shape>this.bg;
        var bgColorRGB = bgColor / 256;
        var bgColorAlpha = bgColor & 0x000000FF;
        if(bgThickness > 0)
        {
            temp.graphics.lineStyle( bgThickness, bgColorRGB );
        }
        temp.graphics.beginFill(bgColorRGB, bgColorAlpha);
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

        if(fgPath != null)
        {
            var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
            this.fg = res.CreateBitmapByName(fgPath);
            this.fg.width = fgWidth;
            this.fg.height = fgHeight;
            this.fg.anchorOffsetX = fgWidth / 2;
            this.fg.anchorOffsetY = fgHeight / 2;
            this.fg.x = (bgWidth) / 2;
            this.fg.y = (bgHeight) / 2;
            this.addChild(this.fg);
        }

        this.width = bgWidth;
        this.height = bgHeight;
        this.anchorOffsetX = bgWidth / 2;
        this.anchorOffsetY = bgHeight / 2;
    }

    protected OnButtonClick()
    {
        var scaleParam = new PaScalingParam();
        scaleParam.displayObj = this;
        scaleParam.duration = 150;
        scaleParam.interval = 75;
        scaleParam.reverse = true;
        scaleParam.targetScaleX = 1.05;
        scaleParam.targetScaleY = 1.05;
        var scaleEvent = new PlayProgramAnimationEvent();
        scaleEvent.param = scaleParam;
        GameMain.GetInstance().DispatchEvent(scaleEvent);

        var soundEvent: PlaySoundEvent = new PlaySoundEvent("PillRotation_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);

        this.clickResponseAnimTimer = new egret.Timer(250, 1);
        this.clickResponseAnimTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.OnButtonResponseAnimFinish, this);
        this.clickResponseAnimTimer.start();
    }

    protected OnButtonResponseAnimFinish()
    {
        this.clickResponseAnimTimer = null;
        if (this.clickCallback != null
            && this.clickCallback != undefined)
        {
            this.clickCallback(this.callbackObj);
        }
    }
}

enum ShapeBgType
{
    RoundRect,
    Rect,
}