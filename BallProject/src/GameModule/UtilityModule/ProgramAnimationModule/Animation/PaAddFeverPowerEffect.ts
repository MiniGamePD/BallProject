class PaAddFeverPowerEffectParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.AddFeverPowerEffect;

	public pos: egret.Point;

	public constructor()
	{
		super();
		this.pos = null;
	}
}

class PaAddFeverPowerEffect extends ProgramAnimationBase<PaAddFeverPowerEffectParam>
{
    private bitMap: egret.Bitmap;
	private duration: number; // = 1000;
	private speed: number = 500;
	protected OnInit()
	{
		this.duration = (Tools.PointDistance(this.param.pos.x, this.param.pos.y,
									 Tools.FeverPowerTargetPos.x, Tools.FeverPowerTargetPos.y) / this.speed) * 1000;
		
		this.bitMap = this.resModule.CreateBitmapByName("jineng");
		GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.bitMap);
		this.bitMap.x = this.param.pos.x;
		this.bitMap.y = this.param.pos.y;
		this.bitMap.anchorOffsetX = this.bitMap.width;
		this.bitMap.scaleX = 0;
		this.bitMap.scaleY = 0;
		GameMain.GetInstance().AdapteDisplayObjectScale(this.bitMap);

		this.FlyMove();
		this.PlayAlphaFadeIn();
		this.PlayAlphaFadeOut();
		this.PlayPartical();
	}

	private FlyMove()
	{
		var movingParam = new PaMovingParam;
        movingParam.displayObj = this.bitMap;
        movingParam.duration = this.duration;
        movingParam.targetPosX = Tools.FeverPowerTargetPos.x;
        movingParam.targetPosY = Tools.FeverPowerTargetPos.y;
        movingParam.needRotate = true;
        movingParam.needRemoveOnFinish = false;
		movingParam.callBack = this.FlyMoveCallBack;
        var event = new PlayProgramAnimationEvent();
        event.param = movingParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	private FlyMoveCallBack(runTime: number)
	{
		var playSoundEvent = new PlaySoundEvent("AddFeverPower_mp3", 1);
		GameMain.GetInstance().DispatchEvent(playSoundEvent);
	}

	private PlayPartical()
	{
	    var startX = this.param.pos.x;
        var startY = this.param.pos.y;

		var particalParam = new PaMoveParticalParam;
        particalParam.textureName = "boss_jineng";
        particalParam.jsonName = "FeverFlyEffect";
        particalParam.duration = 2500;
        particalParam.flyDuration = this.duration;
        particalParam.stayDuration = 500;
        particalParam.stratPosX = startX;
        particalParam.stratPosY = startY;
        particalParam.endPosX = Tools.FeverPowerTargetPos.x;
        particalParam.endPosY = Tools.FeverPowerTargetPos.y;
        particalParam.isMoveEmitter = true;
        particalParam.delayTime = 100;
        var event = new PlayProgramAnimationEvent();
        event.param = particalParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	private PlayAlphaFadeIn()
	{
		var param = new PaAlphaLoopParam;
        param.displayObj = this.bitMap;;
        param.interval = 500;
        param.duration = 500;
        param.offestTime = 0;
        param.startAlpha = 0;
        param.endAlpha = 1;
        param.reverse = true;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);

		var scaleParam = new PaScalingParam;
        scaleParam.displayObj = this.bitMap;;
        scaleParam.duration = 500;
        scaleParam.targetScaleX = 0.7;
        scaleParam.targetScaleY = 0.7;
        var event = new PlayProgramAnimationEvent();
        event.param = scaleParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	private PlayAlphaFadeOut()
	{
		var param = new PaAlphaLoopParam;
        param.displayObj = this.bitMap;;
        param.interval = 100;
        param.duration = 100;
        param.offestTime = 0;
        param.startAlpha = 1;
        param.endAlpha = 0.3;
		param.delayTime = this.duration - 100;
        param.reverse = true;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);

		var scaleParam = new PaScalingParam;
        scaleParam.displayObj = this.bitMap;;
        scaleParam.duration = 100;
        scaleParam.targetScaleX = 0;
        scaleParam.targetScaleY = 0;
		scaleParam.delayTime = this.duration - 100;
        var event = new PlayProgramAnimationEvent();
        event.param = scaleParam;
        GameMain.GetInstance().DispatchEvent(event);
	}


	protected OnUpdate(deltaTime: number)
	{
		
	}

	protected OnRelease()
	{
		if (this.bitMap != null
			&& this.bitMap.parent != null
			&& this.bitMap.parent != undefined)
		{
			this.bitMap.parent.removeChild(this.bitMap);
			this.bitMap = null;
		}
	}

	public IsFinish()
	{
		return this.runningTime >= this.duration;
	}

}