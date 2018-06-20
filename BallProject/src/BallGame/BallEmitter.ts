class BallEmitter
{
	private resModule: IResModule;
	private soundModule: ISoundModule;

	public ballGameWorld: BallGameWorld;
	public emitLeftTime = 0;
	public emitPos: egret.Point;
	public emitDir: egret.Point;
	public emitSpeed: number = 1000;
	public ballMass: number = 1;
	public ballRadius: number = 15;
	public emitPosOffsetDis = 30;
	public emitBallCount = 0;

	public ballList: p2.Body[] = [];

	public battleGround: egret.DisplayObjectContainer;

	public level = 1;
	public fireUpLeftTime = 0;
	public multipleDirectionsLeftTime = 0;
	public multipleDirectionsCount = 0;

	private ballEmitterSprite: egret.Bitmap;
	private levelUpEvent: BallEmitterLevelUpEvent;

	private emitSoundCdTime = 0;

	public constructor()
	{
	}

	// 输入相关 begin
	private RegisterTouchEvent(): void
	{
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchEvent, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchEvent, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchEvent, this);
		GameMain.GetInstance().AddEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
		GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOverEvent, this);
		GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
	}


	private UnRegisterTouchEvent(): void
	{
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchEvent, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchEvent, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchEvent, this);
		GameMain.GetInstance().RemoveEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
		GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOverEvent, this);
		GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
	}

	private OnTouchEvent(evt: egret.TouchEvent): void
	{
		if (evt != null
			&& evt.stageX != undefined
			&& evt.stageY != undefined)
		{
			this.OnTouchPosition(evt.stageX, evt.stageY);
		}
	}
	// 输入相关 end

	private OnSpecialBoxEliminateEvent(evt: SpecialBoxEliminateEvent): void
	{
		if (evt != null)
		{
			if (evt.boxType == BoxType.SixMulDir)
			{
				this.SetMultipleDirections(5000, 6);
			}
			else if (evt.boxType == BoxType.FireUp)
			{
				this.EnterFireUp(5000);
			}
			else if (evt.boxType == BoxType.LevelUp)
			{
				this.SetLevel(this.level + 1);
			}
		}
	}

	public Init(ballGameWorld: BallGameWorld, battleGround: egret.DisplayObjectContainer)
	{
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.soundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);

		this.ballGameWorld = ballGameWorld;

		this.battleGround = battleGround;

		this.emitPos = ballGameWorld.center;

		this.emitDir = new egret.Point(0, this.emitSpeed);

		this.ballList = [];

		this.RegisterTouchEvent();

		this.SetLevel(1);

		this.RefreshBallEmitterSprite();
	}

	private OnReviveEvent(evt: ReviveEvent): void
	{
		if (evt != null)
		{
			this.RefreshBallEmitterSprite();
		}
	}

	private OnGameOverEvent()
	{
		Tools.DetachDisplayObjFromParent(this.ballEmitterSprite);
		this.ballEmitterSprite = this.resModule.CreateBitmapByName("pd_res_json.zhangyu_dead");
		this.ballEmitterSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.ballEmitterSprite.y = GameMain.GetInstance().GetStageHeight() / 2;
		this.ballEmitterSprite.anchorOffsetX = this.ballEmitterSprite.width / 2;
		this.ballEmitterSprite.anchorOffsetY = this.ballEmitterSprite.height / 2;
		this.battleGround.addChild(this.ballEmitterSprite);
		this.ballEmitterSprite.rotation = 0;
	}

	private RefreshBallEmitterSprite()
	{
		Tools.DetachDisplayObjFromParent(this.ballEmitterSprite);
		if (this.multipleDirectionsCount > 0)
		{
			this.ballEmitterSprite = this.resModule.CreateBitmapByName("pd_res_json.Skill_zhangyu");
			this.ballEmitterSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
			this.ballEmitterSprite.y = GameMain.GetInstance().GetStageHeight() / 2;
			this.ballEmitterSprite.anchorOffsetX = this.ballEmitterSprite.width / 2;
			this.ballEmitterSprite.anchorOffsetY = this.ballEmitterSprite.height / 2;
			this.battleGround.addChild(this.ballEmitterSprite);
		}
		else
		{
			this.ballEmitterSprite = this.resModule.CreateBitmapByName("pd_res_json.zhangyu");
			this.ballEmitterSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
			this.ballEmitterSprite.y = GameMain.GetInstance().GetStageHeight() / 2;
			this.ballEmitterSprite.anchorOffsetX = this.ballEmitterSprite.width / 2;
			this.ballEmitterSprite.anchorOffsetY = this.ballEmitterSprite.height / 2;
			this.battleGround.addChild(this.ballEmitterSprite);
		}
		this.ballEmitterSprite.rotation = -90 + Tools.GetRotateAngle(0, 0, this.emitDir.x, this.emitDir.y);
	}

	public SetLevel(level: number)
	{
		this.level = level;
		if (this.levelUpEvent == undefined
			|| this.levelUpEvent == null)
		{
			this.levelUpEvent = new BallEmitterLevelUpEvent();
		}
		this.levelUpEvent.curLevel = this.level;
		GameMain.GetInstance().DispatchEvent(this.levelUpEvent);
	}

	public SetMultipleDirections(leftTime: number, dirCount: number)
	{
		this.multipleDirectionsLeftTime = leftTime;
		this.multipleDirectionsCount = dirCount;
		this.RefreshBallEmitterSprite();
	}

	public EnterFireUp(fireUpDuration: number)
	{
		this.fireUpLeftTime = fireUpDuration;
	}

	public GetEmitInterval()
	{
		var emitInterval = 1000 / (BallEmitCountPerSecondBase + (this.level - 1) * BallEmitCountPerLevelUp);

		if (this.fireUpLeftTime > 0)
		{
			emitInterval /= BallEmitCountPerSecond_Skill_FireUp;
		}
		return emitInterval;
	}

	public OnTouchPosition(posX: number, posY: number)
	{
		this.emitDir.x = posX - this.emitPos.x;
		this.emitDir.y = posY - this.emitPos.y;
		this.ballEmitterSprite.rotation = -90 + Tools.GetRotateAngle(0, 0, this.emitDir.x, this.emitDir.y);
	}

	public Update(deltaTime: number)
	{
		// if (this.emitBallCount == 20)
		// {
		// 	this.SetMultipleDirections(10000, 6);
		// }

		if (this.emitSoundCdTime > 0)
		{
			this.emitSoundCdTime -= deltaTime;
		}

		if (this.fireUpLeftTime > 0)
		{
			this.fireUpLeftTime -= deltaTime;
		}

		if (this.multipleDirectionsLeftTime > 0)
		{
			this.multipleDirectionsLeftTime -= deltaTime;
			if (this.multipleDirectionsLeftTime <= 0)
			{
				this.SetMultipleDirections(0, 0);
			}
		}

		this.emitLeftTime -= deltaTime;
		if (this.emitLeftTime < 0)
		{
			this.emitLeftTime = this.GetEmitInterval();
			this.Emit();
		}

		this.ClearBall();
	}

	public Emit()
	{
		if (this.multipleDirectionsLeftTime > 0)
		{
			var deltaAngle = 360 / this.multipleDirectionsCount;
			for (var i = 0; i < this.multipleDirectionsCount; ++i)
			{
				this.EmitBall(Tools.RotateDirection(this.emitDir, Tools.Angle2Radians(i * deltaAngle)), this.emitSpeed);
			}
		}
		else 
		{
			this.EmitBall(this.emitDir, this.emitSpeed);
		}
	}

	public EmitBall(emitDir: egret.Point, speed: number)
	{
		// this.PlayBallEmitSound();
		++this.emitBallCount;
		emitDir.normalize(this.emitPosOffsetDis);
		var emitPos = new egret.Point(this.emitPos.x + emitDir.x, this.emitPos.y + emitDir.y);
		emitDir.normalize(speed)
		var ballShape: p2.Shape = new p2.Circle({ radius: this.ballRadius });
		ballShape.collisionGroup = Collision_Layer_Ball;
		ballShape.collisionMask = Collision_Layer_Box;
		var ballBody: p2.Body = new p2.Body({
			mass: this.ballMass,
			position: [emitPos.x, emitPos.y],
			velocity: [emitDir.x, emitDir.y]
		});
		ballBody.addShape(ballShape);
		this.ballGameWorld.world.addBody(ballBody);

		var display = this.resModule.CreateBitmapByName("Ball_White");
		display.width = (<p2.Circle>ballShape).radius * 1.5 * this.ballGameWorld.factor;
		display.height = (<p2.Circle>ballShape).radius * 1.5 * this.ballGameWorld.factor;
		display.x = emitPos.x;
		display.y = emitPos.y;

		display.anchorOffsetX = display.width / 2;
		display.anchorOffsetY = display.height / 2;
		ballBody.displays = [display];
		this.battleGround.addChild(display);
		this.ballList.push(ballBody);
	}

	private ClearBall()
	{
		for (var i = 0; i < this.ballList.length; ++i)
		{
			if (this.ballList[i].displays[0].x < 0
				|| this.ballList[i].displays[0].x > GameMain.GetInstance().GetStageWidth()
				|| this.ballList[i].displays[0].y < 0
				|| this.ballList[i].displays[0].y > GameMain.GetInstance().GetStageHeight())
			{
				Tools.DetachDisplayObjFromParent(this.ballList[i].displays[0]);
				this.ballGameWorld.world.removeBody(this.ballList[i]);
			}
		}
	}

	private PlayBallEmitSound()
	{
		if (this.emitSoundCdTime <= 0)
		{
			this.emitSoundCdTime = BallEmitSoundCDTime;
			this.soundModule.PlaySound("ballEmit_mp3", 1);
		}
	}

	public Release()
	{
		this.UnRegisterTouchEvent();
	}
}