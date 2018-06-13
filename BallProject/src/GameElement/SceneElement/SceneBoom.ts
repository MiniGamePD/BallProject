class SceneBoom extends SceneElementBase
{
    private rangeEffect: egret.Bitmap[];
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();      
        this.accessory = new egret.DisplayObjectContainer(); 
        this.color = GameElementColor.random;
        this.canDrop = true;
        this.elementType = SceneElementType.Boom;
        this.RefreshTexture();
        this.eliminateMinCount = 1;
        this.eliminateSound = "Boom_mp3";
    }

	public RefreshTexture():void
    {
        if (this.resModule == null)
        {
            this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        }
        this.framesAnim = this.CreateFramesAnim();
        this.CreateRangeEffect();
    }

	private CreateFramesAnim(): SyncFramesAnim
    {
        var framesAnim = new SyncFramesAnim();
        framesAnim.Init(<egret.Bitmap>this.renderer, Frame_Anim_SceneBoom, 200);
        return framesAnim;
    }

    protected GetResPathByColor():string
    {
        var path = "Boom1";
        return path;
    }

    protected PlayBoomEffect()
	{
		var playEffectParam = new PaPlayFramesAnimParam()
		playEffectParam.pos = new egret.Point(Tools.ElementPosToGameStagePosX(this.posx), Tools.ElementPosToGameStagePosY(this.posy));
		playEffectParam.textNameSeq = Frame_Anim_SceneBoom_Effect;
		playEffectParam.interval = 50;
		playEffectParam.times = 1;
        playEffectParam.scale = new egret.Point(2,2);
		var event = new PlayProgramAnimationEvent();
        event.param = playEffectParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

    private CreateRangeEffect()
    {
        this.rangeEffect = [];
        
        var offsetTime0 = 0;
        var offsetTime1 = 0;
        var offsetTime2 = 0;
        this.CreateRangeObj(0, 1, offsetTime0);
        this.CreateRangeObj(0, -1, offsetTime0);
        this.CreateRangeObj(1, 0, offsetTime0);
        this.CreateRangeObj(-1, 0, offsetTime0);

        this.CreateRangeObj(1, 1, offsetTime1);
        this.CreateRangeObj(1, -1, offsetTime1);
        this.CreateRangeObj(-1, 1, offsetTime1);
        this.CreateRangeObj(-1, -1, offsetTime1);

        this.CreateRangeObj(0, 2, offsetTime2);
        this.CreateRangeObj(0, -2, offsetTime2);
        this.CreateRangeObj(2, 0, offsetTime2);
        this.CreateRangeObj(-2, 0, offsetTime2);
    }

    private CreateRangeObj(xOffset: number, yOffset: number, offsetTime: number)
    {
        var bitmap = this.resModule.CreateBitmapByName("pd_res_json.range");
        bitmap.width = Tools.MatchViewElementWidth;
        bitmap.height = Tools.MatchViewElementHeight;
        bitmap.anchorOffsetX = Tools.MatchViewElementWidth / 2;
        bitmap.anchorOffsetY = Tools.MatchViewElementHeight / 2;
        this.accessory.addChild(bitmap);
        bitmap.x += xOffset * Tools.MatchViewElementWidth;
        bitmap.y += yOffset * Tools.MatchViewElementHeight;
        this.rangeEffect.push(bitmap);
        this.PlayAlphaLoop(bitmap, offsetTime);
    }

    private PlayAlphaLoop(displayObj: egret.DisplayObject, offsetTime: number)
    {
        var param = new PaAlphaLoopParam;
        param.displayObj = displayObj;
        param.interval = 800;
        param.duration = 999999;
        param.offestTime = offsetTime;
        param.startAlpha = 0.6;
        param.endAlpha = 0.9;
        param.reverse = true;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public Release()
    {
        if (this.rangeEffect != undefined
           && this.rangeEffect != null)
        {
            for (var i = 0; i < this.rangeEffect.length; ++i)
            {
                if (this.rangeEffect[i] != null
                    && this.rangeEffect[i].parent != null)
                {
                    this.rangeEffect[i].parent.removeChild(this.rangeEffect[i]);
                }
            }
        }
        super.Release();
    }
}