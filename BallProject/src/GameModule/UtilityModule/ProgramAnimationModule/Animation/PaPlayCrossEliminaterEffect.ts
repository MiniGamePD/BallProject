class PaPlayCrossEliminaterEffectParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.PlayCrossEliminaterEffect;
	public pos: egret.Point;
	public direction: Direction[];
	
	public constructor()
	{
		super();
		this.pos = null;
		this.direction = [];
	}
}

class PaPlayCrossEliminaterEffect extends ProgramAnimationBase<PaPlayCrossEliminaterEffectParam>
{
	protected OnInit()
	{
		this.PlayBoomEffect();
		for (var i = 0; i < this.param.direction.length; ++i)
		{
			this.MoveOneSide(this.param.direction[i]);
			this.PlayTailEffect(this.param.direction[i]);
			this.PlayPartical(this.param.direction[i]);
		}
	}

	protected OnUpdate(deltaTime: number)
	{
		
	}

	private PlayTailEffect(dir: Direction)
	{
		var playEffectParam = new PaPlayFramesAnimParam()
		playEffectParam.pos = this.param.pos;
		playEffectParam.scale = new egret.Point(1, 0.6);
		playEffectParam.textNameSeq = Frame_Anim_CrossEliminater_tuowei;
		playEffectParam.interval = 50;
		playEffectParam.times = 1;
		playEffectParam.anchor = AnchorType.Left;
		playEffectParam.rotation = Tools.GetDirectionRotateAngle(dir);
		var event = new PlayProgramAnimationEvent();
        event.param = playEffectParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	public MoveOneSide(dir: Direction)
    {
        var startX = this.param.pos.x;
        var startY = this.param.pos.y;
        var targetOffset = Math.max(GameMain.GetInstance().GetStageHeight(),
            GameMain.GetInstance().GetStageWidth())

        var headPic = this.resModule.CreateBitmapByName("Cross_huojianEff");
        headPic.anchorOffsetX = headPic.width / 2;
        headPic.anchorOffsetY = headPic.height / 2;
        headPic.x = startX;
        headPic.y = startY;
        GameMain.GetInstance().AdapteDisplayObjectScale(headPic);
        GameMain.GetInstance().GetAdaptedStageContainer().addChild(headPic);
        var movingParam = new PaMovingParam;
        movingParam.displayObj = headPic;
        movingParam.duration = 1000;
        movingParam.targetPosX = Tools.MoveScenePosX(startX, dir, targetOffset);
        movingParam.targetPosY = Tools.MoveScenePosY(startY, dir, targetOffset);
        movingParam.needRotate = true;
        movingParam.needRemoveOnFinish = true;
        var event = new PlayProgramAnimationEvent();
        event.param = movingParam;
        GameMain.GetInstance().DispatchEvent(event);
    }

	private PlayBoomEffect()
	{
		var playEffectParam = new PaPlayFramesAnimParam()
		playEffectParam.pos = this.param.pos;
		playEffectParam.textNameSeq = Frame_Anim_CrossEliminater_fashe;
		playEffectParam.interval = 100;
		playEffectParam.times = 1;
		var event = new PlayProgramAnimationEvent();
        event.param = playEffectParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	private PlayPartical(dir: Direction)
	{
	    var startX = this.param.pos.x;
        var startY = this.param.pos.y;
        var targetOffset = Math.max(GameMain.GetInstance().GetStageHeight(),
            GameMain.GetInstance().GetStageWidth())

		var particalParam = new PaMoveParticalParam;
        particalParam.textureName = "huojian_shinning";
        particalParam.jsonName = "huojian_shinning";
        particalParam.duration = 2000;
        particalParam.flyDuration = 1000;
        particalParam.stayDuration = 0;
        particalParam.stratPosX = startX;
        particalParam.stratPosY = startY;
        particalParam.endPosX = Tools.MoveScenePosX(startX, dir, targetOffset);
        particalParam.endPosY = Tools.MoveScenePosY(startY, dir, targetOffset);
        particalParam.isMoveEmitter = true;
        var event = new PlayProgramAnimationEvent();
        event.param = particalParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	protected OnRelease()
	{
	}

	public IsFinish()
	{
		return true; //this.runningTime >= this.duration;
	}

}