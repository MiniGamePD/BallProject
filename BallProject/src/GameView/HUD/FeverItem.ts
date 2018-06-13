class FeverItem extends egret.DisplayObjectContainer
{
    private feverProgress:ProgressBar;
    private feverSprite:egret.Bitmap;
    private feverEnerge:number;
    private feverControl:FeverControl;
    private feverSpriteTimer:egret.Timer;
    private feverStar:egret.Bitmap;
    private feverStarLight:egret.Bitmap;
    private feverStarLightTimer:egret.Timer;
    private feverEnergeSpeed:number;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        //星星的光
        this.feverStarLight = res.CreateBitmapByName("pd_res_json.FeverTime_Shinning");
        this.feverStarLight.x = 177;
        this.feverStarLight.y = 122;
        this.feverStarLight.anchorOffsetX = this.feverStarLight.width / 2;
        this.feverStarLight.anchorOffsetY = this.feverStarLight.height / 2;
        this.feverStarLight.rotation = 0;
        GameMain.GetInstance().AdapteDisplayObject(this.feverStarLight);

        var anim = new PaRotationParam();
        anim.displayObj = this.feverStarLight;
        anim.targetRot = 360;
        anim.duration = 6000;
        anim.loop = true;
        var event = new PlayProgramAnimationEvent();
        event.param = anim;
        GameMain.GetInstance().DispatchEvent(event);

        //进度条
        var feverEnergeBgRect = new egret.Rectangle(175,95,276,34);
        var feverEnergeFgRect = new egret.Rectangle(176,96,274,32);
    
        this.feverProgress = new ProgressBar("pd_res_json.FeverTime", feverEnergeBgRect, "pd_res_json.FeverTime_Color", feverEnergeFgRect,
            ProgressBarDir.Horizontal_L2R);
        this.feverProgress.x = feverEnergeBgRect.width / 2 + 20;
        this.feverProgress.y = feverEnergeBgRect.height / 2 + 20;
        this.feverProgress.anchorOffsetX = feverEnergeBgRect.width / 2;
        this.feverProgress.anchorOffsetY = feverEnergeBgRect.height / 2;
        this.feverProgress.Adapt();
        this.addChild(this.feverProgress);

        this.feverEnerge = 0;
        this.feverProgress.SetProgress(0.01);
        this.feverEnergeSpeed = 1;

        //星星
        this.feverStar = res.CreateBitmapByName("pd_res_json.FeverTime_xingxing");
        this.feverStar.x = 177;
        this.feverStar.y = 122;
        this.feverStar.anchorOffsetX = this.feverStar.width / 2;
        this.feverStar.anchorOffsetY = this.feverStar.height / 2;
        GameMain.GetInstance().AdapteDisplayObject(this.feverStar);
        this.addChild(this.feverStar);

        Tools.FeverPowerTargetPos.x = this.feverStar.x;
        Tools.FeverPowerTargetPos.y = this.feverStar.y;

        //fever time的美术字
        this.feverSprite = res.CreateBitmapByName("pd_res_json.fever");
        this.feverSprite.anchorOffsetX = this.feverSprite.width / 2;
        this.feverSprite.anchorOffsetY = this.feverSprite.height / 2;
        this.feverSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.feverSprite.y = 400;
        GameMain.GetInstance().AdapteDisplayObject(this.feverSprite);
    }

    public Init()
    {
        GameMain.GetInstance().AddEventListener(FeverEvent.EventName, this.OnFeverEvent, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(FeverEvent.EventName, this.OnFeverEvent, this);
        this.feverControl = null;
    }

    public SetFeverControl(feverControl:FeverControl)
    {
        this.feverControl = feverControl;
    }

    public ShowFeverSprite()
    {
        this.feverSprite.scaleX = 0;
        this.feverSprite.scaleY = 0;
        this.addChild(this.feverSprite);

        var param = new PaScalingParam;
        param.displayObj = this.feverSprite;
        param.duration = 500;
        param.targetScaleX = 1;
        param.targetScaleY = 1;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);

        this.feverSpriteTimer = new egret.Timer(1500, 1);
        this.feverSpriteTimer.addEventListener(egret.TimerEvent.TIMER, this.HideFeverSprite, this);
        this.feverSpriteTimer.start();
    }

    private HideFeverSprite()
    {
        this.removeChild(this.feverSprite);
        this.feverSpriteTimer = null;
    }

    public Update(delta:number)
    {
        if(this.feverControl != null)
        {
            if(this.feverEnerge != this.feverControl.GetFeverEnerge())
            {
                var dir = this.feverControl.GetFeverEnerge() - this.feverEnerge;
                this.feverEnerge += dir * this.feverEnergeSpeed * delta / 1000;
                if( (dir > 0 && this.feverEnerge > this.feverControl.GetFeverEnerge()) ||
                    (dir < 0 && this.feverEnerge < this.feverControl.GetFeverEnerge()) )
                    this.feverEnerge = this.feverControl.GetFeverEnerge();
                this.feverProgress.SetProgress(this.feverEnerge / 100);                   
            }
        }
    }

    private OnFeverEvent(feverEvent:FeverEvent)
    {
        if(feverEvent.feverBegin)
        {
            //显示小星星的光
            var starIndex = this.getChildIndex(this.feverStar);
            this.addChildAt(this.feverStarLight, starIndex - 1);
            var lightParam = new PaAlphaLoopParam;
            lightParam.displayObj = this.feverStarLight;
            lightParam.interval = 500;
            lightParam.duration = 500
            lightParam.startAlpha = 0.1;
            lightParam.endAlpha = 1;
            lightParam.reverse = false;
            var lightEvent = new PlayProgramAnimationEvent();
            lightEvent.param = lightParam;
            GameMain.GetInstance().DispatchEvent(lightEvent);
        }
        else
        {
            //隐藏小星星的光
             var lightParam = new PaAlphaLoopParam;
            lightParam.displayObj = this.feverStarLight;
            lightParam.interval = 500;
            lightParam.duration = 500
            lightParam.startAlpha = 1;
            lightParam.endAlpha = 0.1;
            lightParam.reverse = false;
            var lightEvent = new PlayProgramAnimationEvent();
            lightEvent.param = lightParam;
            GameMain.GetInstance().DispatchEvent(lightEvent);

            this.feverStarLightTimer = new egret.Timer(500, 1);
            this.feverStarLightTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.HideFeverStarLight, this);
            this.feverStarLightTimer.start();
        }
    }

    private HideFeverStarLight()
    {
        this.feverStarLightTimer = null;
        this.removeChild(this.feverStarLight);
    }
}