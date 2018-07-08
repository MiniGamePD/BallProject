class BallEmitter
{
	private resModule: IResModule;
	private soundModule: ISoundModule;

	private ballDataMgr: BallDataMgr;
	public ballGameWorld: BallGameWorld;
	public emitLeftTime = 0;
	public emitPos: egret.Point;
	public emitDir: egret.Point;
	public emitPosOffsetDis = 30;
	public emitBallCount = 0;

	public ballList: Ball[] = [];

	public battleGround: egret.DisplayObjectContainer;

	public level = 1;
	public fireUpLeftTime = 0;
	public multipleDirectionsLeftTime = 0;
	public multipleDirectionsCount = 0;

	private ballEmitterSprite: egret.Bitmap;
	private ballEmitterLine: egret.Bitmap;
	private levelUpEvent: BallEmitterLevelUpEvent;

	private emitSoundCdTime = 0;

	public constructor()
	{
	}

	private RegisterTouchEvent(): void
	{
		GameMain.GetInstance().AddEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
		GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOverEvent, this);
		GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
		GameMain.GetInstance().AddEventListener(HitBoxEvent.EventName, this.OnHitBoxEvent, this);
		GameMain.GetInstance().AddEventListener(BoxEliminateEvent.EventName, this.OnBoxEliminateEvent, this);
	}


	private UnRegisterTouchEvent(): void
	{
		GameMain.GetInstance().RemoveEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
		GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOverEvent, this);
		GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
		GameMain.GetInstance().RemoveEventListener(HitBoxEvent.EventName, this.OnHitBoxEvent, this);
		GameMain.GetInstance().RemoveEventListener(BoxEliminateEvent.EventName, this.OnBoxEliminateEvent, this);
	}

	private OnSpecialBoxEliminateEvent(evt: SpecialBoxEliminateEvent): void
	{
		if (evt != null)
		{
			if (evt.boxType == BoxType.SixMulDir)
			{
				this.SetMultipleDirections(this.ballDataMgr.ballConfig.Box_Effect_MultipleDirections_Time, 6);
			}
			else if (evt.boxType == BoxType.FireUp)
			{
				this.EnterFireUp(this.ballDataMgr.ballConfig.Box_Effect_FireUp_Time);
			}
			else if (evt.boxType == BoxType.LevelUp)
			{
				this.SetLevel(this.level + 1);
			}
		}
	}

	private OnHitBoxEvent(evt: HitBoxEvent)
	{
		if (evt != null)
		{
			var ball = this.GetBallById(evt.ballPhyBody.id);
			if (ball != null)
			{
				if (this.ballDataMgr.IsTriggerSkill_ScaleOnHit())
				{
					ball.ScaleBallRadius(this.ballDataMgr.ballConfig.skill_ScaleOnHit_Scale, this.ballDataMgr.ballConfig.skill_ScaleOnHit_BallRadius);
				}

				if (ball.canSplitOnHit && this.ballDataMgr.IsTriggerSkill_SplitBallOnHit())
				{
					ball.canSplitOnHit = false;
					var offset = new egret.Point(ball.ballDisplay.x - evt.box.boxDisplayObj.x, ball.ballDisplay.y - evt.box.boxDisplayObj.y);
					// var ballVel = new egret.Point(ball.phyBody.velocity[0], ball.phyBody.velocity[1]);
					offset.normalize(this.emitPosOffsetDis)
					var emitPos = new egret.Point(ball.ballDisplay.x + offset.x, ball.ballDisplay.y + offset.y);
					this.CreateBallOnHit(emitPos, offset, this.ballDataMgr.ballConfig.skill_SplitBallOnHit_Count, this.ballDataMgr.ballConfig.skill_SplitBallOnHit_Angle);
				}
			}
		}
	}

	public CreateBallOnHit(pos: egret.Point, dir: egret.Point, count: number, angle: number)
	{
		for (var i = 0; i < count; ++i)
		{
			var ran = (Math.random() - 0.5) * 2;
			var dir = Tools.RotateDirection(dir, Tools.Angle2Radians(ran * angle));
			var canSplit = true;
			this.EmitBall(pos, dir, canSplit);
		}
	}

	private OnBoxEliminateEvent(evt: BoxEliminateEvent)
	{
		if (evt != null && evt.box != null)
		{
			var ball = this.GetBallById(evt.ballPhyBody.id);

			if (ball != null && this.ballDataMgr.IsTriggerSkill_CreateBallOnBoxEliminate())
			{
				var count = this.ballDataMgr.ballConfig.skill_CreateBallOnBoxEliminate_Count;
				var ballVel = new egret.Point(ball.phyBody.velocity[0], ball.phyBody.velocity[1]);
				var emitPos = new egret.Point(evt.box.boxDisplayObj.x, evt.box.boxDisplayObj.y);
				var deltaAngle = 360 / count;
				for (var i = 0; i < count; ++i)
				{
					this.EmitBall(emitPos, Tools.RotateDirection(ballVel, Tools.Angle2Radians(i * deltaAngle)), true);
				}
			}
		}
	}

	public Init(ballGameWorld: BallGameWorld, battleGround: egret.DisplayObjectContainer, ballDataMgr: BallDataMgr)
	{
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.soundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);

		this.ballDataMgr = ballDataMgr;
		this.ballGameWorld = ballGameWorld;

		this.battleGround = battleGround;

		this.emitPos = ballGameWorld.center;

		this.emitDir = new egret.Point(0, -1);

		this.ballList = [];

		this.emitBallCount = 0;

		this.RegisterTouchEvent();

		this.SetLevel(1);

		this.CreateEmitterLine();
		this.RefreshBallEmitterSprite();
	}

	private CreateEmitterLine()
	{
		Tools.DetachDisplayObjFromParent(this.ballEmitterLine);
		this.ballEmitterLine = this.resModule.CreateBitmapByName("pd_res_json.lockLine");
		this.ballEmitterLine.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.ballEmitterLine.y = GameMain.GetInstance().GetStageHeight() / 2;
		this.ballEmitterLine.anchorOffsetX = this.ballEmitterLine.width / 2;
		this.ballEmitterLine.anchorOffsetY = -this.emitPosOffsetDis;
		this.battleGround.addChild(this.ballEmitterLine);
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
		this.SetRotation(0);
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
		this.SetRotation(-90 + Tools.GetRotateAngle(0, 0, this.emitDir.x, this.emitDir.y));
	}

	private SetRotation(rotation: number)
	{
		this.ballEmitterSprite.rotation = rotation;
		this.ballEmitterLine.rotation = rotation;
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

	public SetEmitDir(dir: egret.Point)
	{
		this.emitDir = dir;
		this.SetRotation(-90 + Tools.GetRotateAngle(0, 0, this.emitDir.x, this.emitDir.y));
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
				this.EmitBallOnCenter(Tools.RotateDirection(this.emitDir, Tools.Angle2Radians(i * deltaAngle)));
			}
		}
		else 
		{
			this.EmitBallOnCenter(this.emitDir);
		}
	}

	public EmitBallOnCenter(emitDir: egret.Point)
	{
		emitDir.normalize(this.emitPosOffsetDis);
		var emitPos = new egret.Point(this.emitPos.x + emitDir.x, this.emitPos.y + emitDir.y);
		this.EmitBall(emitPos, emitDir, true);
	}

	public EmitBall(emitPos: egret.Point, emitDir: egret.Point, canSplit: boolean)
	{
		++this.emitBallCount;
		var ball = new Ball(this.resModule);
		ball.Init(this.emitBallCount, emitPos, emitDir, this.ballDataMgr.ballConfig.emitSpeed,
			this.ballDataMgr.ballConfig.ballMass, this.ballDataMgr.GetBallEmitRadius(), this.ballDataMgr.ballConfig.textureName, canSplit,
		    this.ballDataMgr.ballConfig.displayScale);

		this.ballGameWorld.world.addBody(ball.phyBody);
		this.battleGround.addChild(ball.ballDisplay);
		this.ballList.push(ball);
	}

	private ClearBall()
	{
		for (var i = 0; i < this.ballList.length; ++i)
		{
			if (this.ballList[i].ballDisplay.x < 0
				|| this.ballList[i].ballDisplay.x > GameMain.GetInstance().GetStageWidth()
				|| this.ballList[i].ballDisplay.y < 0
				|| this.ballList[i].ballDisplay.y > GameMain.GetInstance().GetStageHeight()
				|| this.IsSlowBall(this.ballList[i]))
			{
				this.DeleteBall(this.ballList[i]);
				--i;
			}
		}
	}

	private IsSlowBall(ball: Ball): boolean
	{
		return ball.phyBody.sleepState == p2.Body.SLEEPY || ball.phyBody.sleepState == p2.Body.SLEEPING;
	}

	public GetBallById(id: number): Ball
	{
		for (var i = 0; i < this.ballList.length; ++i)
		{
			if (this.ballList[i] != null
				&& this.ballList[i].id == id)
			{
				return this.ballList[i];
			}
		}
		return null;
	}

	private DeleteBall(ball: Ball): boolean
	{
		if (ball != null
			&& ball != undefined)
		{
			var idx = this.ballList.indexOf(ball);
			if (idx >= 0)
			{
				Tools.DetachDisplayObjFromParent(ball.ballDisplay);
				if (ball.phyBody != null)
				{
					this.ballGameWorld.world.removeBody(ball.phyBody);
				}
				this.ballList.splice(idx, 1);
				return true;
			}
		}
		return false;
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