class BallEmitter
{
	private resModule: IResModule;

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

	public constructor()
	{
	}

	// 输入相关 begin
	private RegisterTouchEvent(): void
	{
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchEvent, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchEvent, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchEvent, this);
	}

	private UnRegisterTouchEvent(): void
	{
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchEvent, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchEvent, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchEvent, this);
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

	public Init(ballGameWorld: BallGameWorld, battleGround: egret.DisplayObjectContainer)
	{
		this.ballGameWorld = ballGameWorld;

		this.battleGround = battleGround;

		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

		this.emitPos = ballGameWorld.center;

		this.emitDir = new egret.Point(0, this.emitSpeed);

		this.ballList = [];

		this.RegisterTouchEvent();

		this.SetLevel(1);

		this.RefreshBallEmitterSprite();
	}
	
	private RefreshBallEmitterSprite()
	{	
		Tools.DetachDisplayObjFromParent(this.ballEmitterSprite);
		if (this.multipleDirectionsCount > 0)
		{
			this.ballEmitterSprite = this.resModule.CreateBitmapByName("pd_res_json.Skill_zhanyu");
			this.ballEmitterSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
			this.ballEmitterSprite.y = GameMain.GetInstance().GetStageHeight() / 2;
			this.ballEmitterSprite.anchorOffsetX = this.ballEmitterSprite.width / 2;
			this.ballEmitterSprite.anchorOffsetY = this.ballEmitterSprite.height / 2;
			this.battleGround.addChild(this.ballEmitterSprite);
		}
		else
		{
			this.ballEmitterSprite = this.resModule.CreateBitmapByName("pd_res_json.zhangyue");
			this.ballEmitterSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
			this.ballEmitterSprite.y = GameMain.GetInstance().GetStageHeight() / 2;
			this.ballEmitterSprite.anchorOffsetX = this.ballEmitterSprite.width / 2;
			this.ballEmitterSprite.anchorOffsetY = this.ballEmitterSprite.height / 2;
			this.battleGround.addChild(this.ballEmitterSprite);
		}
	}

	public SetLevel(level: number)
	{
		this.level = level;
	}

	public SetMultipleDirections(leftTime: number, dirCount: number)
	{
		this.multipleDirectionsLeftTime = leftTime;
		this.multipleDirectionsCount = dirCount;
		this.RefreshBallEmitterSprite();
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
		if (this.emitBallCount == 20)
		{
			this.SetMultipleDirections(10000, 6);
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

	public Release()
	{
		this.UnRegisterTouchEvent();
	}
}