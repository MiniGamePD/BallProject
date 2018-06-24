enum BoxType
{
	None,		//空
	Square,		//正方形
	Triangle,	//三角形
	Circle,		//圆形
	SixMulDir,  //6方向攻击道具
	FireUp,		//全力开火道具
	LevelUp,    //升级道具
	GoldCoin,	//获取金币道具
	Pause,      //定时道具
}

class BoxEmitter
{
	private resModule: IResModule;
	private soundModule: ISoundModule;

	private ballDataMgr: BallDataMgr;
	public ballGameWorld: BallGameWorld;

	public center: egret.Point;
	public boxList: Box[] = [];
	public instanceId = 0;
	public boxCreateStrategy: BoxCreateStrategy;
	public battleGround: egret.DisplayObjectContainer;

	public hitSoundCdTime = 0;
	public boxPauseLeftTime = 0;

	public hitBoxEvent: HitBoxEvent;
	public boxEliminateEvent: BoxEliminateEvent;

	public gameOverBox: Box;

	public constructor()
	{
	}

	public Init(ballGameWorld: BallGameWorld, battleGround: egret.DisplayObjectContainer, ballDataMgr: BallDataMgr)
	{
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.soundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);

		this.ballDataMgr = ballDataMgr;
		this.ballGameWorld = ballGameWorld;

		this.battleGround = battleGround;


		this.center = this.ballGameWorld.center;

		this.boxList = [];

		this.instanceId = 0;

		this.ballGameWorld.world.on("beginContact", this.OnBeginContact, this);

		this.boxCreateStrategy = new BoxCreateStrategy();
		this.boxCreateStrategy.Init(this);

		this.hitBoxEvent = new HitBoxEvent();
		this.boxEliminateEvent = new BoxEliminateEvent();

		this.RegisterEvent();
	}

	private RegisterEvent(): void
	{
		GameMain.GetInstance().AddEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
		GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
	}

	private UnRegisterEvent(): void
	{
		GameMain.GetInstance().RemoveEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
		GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
	}

	private OnSpecialBoxEliminateEvent(evt: SpecialBoxEliminateEvent): void
	{
		if (evt != null)
		{
			if (evt.boxType == BoxType.Pause
				&& this.boxPauseLeftTime <= 0)
			{
				this.SetBoxPause(true);
				this.boxPauseLeftTime = 5000;
			}
		}
	}

	private OnReviveEvent(evt: ReviveEvent): void
	{
		if (evt != null)
		{
			if (this.gameOverBox != undefined
				&& this.gameOverBox != null)
			{
				Tools.DetachDisplayObjFromParent(this.gameOverBox.boxDisplayObj);
				Tools.DetachDisplayObjFromParent(this.gameOverBox.healthDisplayObj);
				this.gameOverBox = null;
			}
			this.ClearAllBox();
		}
	}

	private SetBoxPause(pause: boolean)
	{
		for (var i = 0; i < this.boxList.length; ++i)
		{
			if (this.boxList[i] != null)
			{
				this.boxList[i].Pause(pause);
			}
		}
	}

	public ClearAllBox()
	{
		for (var i = 0; i < this.boxList.length; ++i)
		{
			if (this.boxList[i] != null)
			{
				var deleteResult = this.DeleteBox(this.boxList[i], true);
				if (deleteResult)
				{
					--i;
				}
			}
		}
	}

	public Update(deltaTime: number)
	{
		if (this.boxPauseLeftTime > 0)
		{
			this.boxPauseLeftTime -= deltaTime;
			if (this.boxPauseLeftTime <= 0)
			{
				this.SetBoxPause(false)
			}
		}

		if (this.hitSoundCdTime > 0)
		{
			this.hitSoundCdTime -= deltaTime;
		}

		this.boxCreateStrategy.Update(deltaTime);

		for (var i = 0; i < this.boxList.length; ++i)
		{
			if (this.boxList[i] != null)
			{
				this.boxList[i].Update(deltaTime);
			}
		}

		this.CheckBoxOverlay();
		this.CheckGameOver();
	}

	public EmitBox(randomBoxType: BoxType, birthPos: egret.Point, health: number)
	{
		++this.instanceId;
		var id = this.instanceId;
		var box;

		if (randomBoxType == BoxType.Square)
		{
			box = new SquareBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 80);
		}
		else if (randomBoxType == BoxType.Circle)
		{
			box = new CircleBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 40);
		}
		else if (randomBoxType == BoxType.Triangle)
		{
			box = new TriangleBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 80);
		}
		else if (randomBoxType == BoxType.SixMulDir)
		{
			box = new SixMulDirBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 40);
		}
		else if (randomBoxType == BoxType.FireUp)
		{
			box = new FireUpBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 40);
		}
		else if (randomBoxType == BoxType.LevelUp)
		{
			box = new LevelUpBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 40);
		}
		else if (randomBoxType == BoxType.GoldCoin)
		{
			box = new GoldCoinBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 40);
		}
		else if (randomBoxType == BoxType.Pause)
		{
			box = new PauseBox(id, new egret.Point(birthPos.x, birthPos.y), this.center, health, 40);
		}

		if (this.boxPauseLeftTime > 0)
		{
			box.Pause(true);
		}

		this.battleGround.addChild(box.boxDisplayObj);
		this.battleGround.addChild(box.healthDisplayObj);
		this.ballGameWorld.world.addBody(box.phyBody);
		this.boxList.push(box);
	}

	public GetBoxById(id: number): Box
	{
		for (var i = 0; i < this.boxList.length; ++i)
		{
			if (this.boxList[i] != null
				&& this.boxList[i].id == id)
			{
				return this.boxList[i];
			}
		}
		return null;
	}

	private PlayHitSound()
	{
		if (this.hitSoundCdTime <= 0)
		{
			this.hitSoundCdTime = BoxHitSoundCDTime;
			var soundChannel = this.soundModule.PlaySound("hitBox_mp3", 1);
			// var soundChannel = this.soundModule.PlaySound("PillRotation_mp3", 1);
			if (soundChannel != null)
			{
				soundChannel.volume = 0.5;
			}
		}
	}

	private OnHitBox(box: Box, ball: p2.Body)
	{
		if (box != null
			&& box != undefined)
		{
			this.hitBoxEvent.box = box;
			this.hitBoxEvent.ball = ball;
			GameMain.GetInstance().DispatchEvent(this.hitBoxEvent);

			box.changeHealth(-1);
			this.PlayHitSound();
			
			if (box.health <= 0)
			{
				this.boxEliminateEvent.boxType = box.GetBoxType();
				this.boxEliminateEvent.box = box;
				this.boxEliminateEvent.ball = ball;
				GameMain.GetInstance().DispatchEvent(this.boxEliminateEvent);

				box.OnEliminate();
				this.DeleteBox(box, true);
			}
		}
	}

	private DeleteBox(box: Box, detachDisplay: boolean): boolean
	{
		if (box != null
			&& box != undefined)
		{
			var idx = this.boxList.indexOf(box);
			if (idx >= 0)
			{
				if (detachDisplay)
				{
					Tools.DetachDisplayObjFromParent(box.boxDisplayObj);
					Tools.DetachDisplayObjFromParent(box.healthDisplayObj);
				}

				if (box.phyBody != null)
				{
					this.ballGameWorld.world.removeBody(box.phyBody);
				}
				this.boxList.splice(idx, 1);
				return true;
			}
		}
		return false;
	}

	private CheckGameOver()
	{
		for (var i = 0; i < this.boxList.length; ++i)
		{
			var boxA = this.boxList[i];
			if (boxA.GetBoxType() == BoxType.Square
				|| boxA.GetBoxType() == BoxType.Triangle
				|| boxA.GetBoxType() == BoxType.Circle)
			{
				var centerSizeScale = (boxA.GetBoxType() == BoxType.Triangle) ? 0.5 : 1;
				var deltaX = Math.abs(boxA.boxDisplayObj.x - this.center.x);
				var deltaY = Math.abs(boxA.boxDisplayObj.y - this.center.y);
				if (deltaX < GameOverCenterSize.x * centerSizeScale && deltaY < GameOverCenterSize.y * centerSizeScale)
				{
					boxA.SetHide(false, true);

					var moveParam = new PaAccMovingParam()
					moveParam.displayObj = boxA.boxDisplayObj;
					moveParam.attachDisplayObj = [boxA.healthDisplayObj];
					moveParam.startSpeed = 500;
					moveParam.accelerate = 500;
					moveParam.targetPos = new egret.Point(this.center.x, this.center.y);
					// moveParam.needRemoveOnFinish = true;
					var moveEvent = new PlayProgramAnimationEvent();
					moveEvent.param = moveParam;
					GameMain.GetInstance().DispatchEvent(moveEvent);

					var scaleParam = new PaScalingParam()
					scaleParam.displayObj = boxA.boxDisplayObj;
					scaleParam.targetScaleX = 1.2;
					scaleParam.targetScaleY = 1.2;
					scaleParam.duration = 2000;
					scaleParam.interval = 200;
					scaleParam.reverse = true;
					var scaleEvent = new PlayProgramAnimationEvent()
					scaleEvent.param = scaleParam;
					GameMain.GetInstance().DispatchEvent(scaleEvent);

					this.gameOverBox = boxA;
					this.DeleteBox(boxA, false);

					let event = new GameOverEvent();
					GameMain.GetInstance().DispatchEvent(event);
				}
			}

		}
	}

	private CheckBoxOverlay()
	{
		for (var i = 0; i < this.boxList.length; ++i)
		{
			for (var j = i + 1; j < this.boxList.length; ++j)
			{
				var boxA = this.boxList[i];
				var boxB = this.boxList[j];
				if (boxA.canMerge && boxB.canMerge)
				{
					var deltaX = Math.abs(boxA.boxDisplayObj.x - boxB.boxDisplayObj.x);
					var deltaY = Math.abs(boxA.boxDisplayObj.y - boxB.boxDisplayObj.y);
					if ((deltaX < boxA.boxSize.x || deltaX < boxB.boxSize.x)
						&& (deltaY < boxA.boxSize.y || deltaY < boxB.boxSize.y))
					{
						this.MergeBox(boxA, boxB);
					}
				}
			}
		}
	}


	private MergeBox(boxA: Box, boxB: Box)
	{
		if (boxA != null
			&& boxB != null)
		{
			var disA = this.center.subtract(new egret.Point(boxA.boxDisplayObj.x, boxA.boxDisplayObj.y)).length;
			var disB = this.center.subtract(new egret.Point(boxB.boxDisplayObj.x, boxB.boxDisplayObj.y)).length;
			var nearBox = disA < disB ? boxA : boxB;
			var farBox = disA < disB ? boxB : boxA;
			farBox.changeHealth(nearBox.health);


			var moveParam = new PaAccMovingParam()
			moveParam.displayObj = nearBox.boxDisplayObj;
			moveParam.attachDisplayObj = [nearBox.healthDisplayObj];
			moveParam.startSpeed = 500;
			moveParam.accelerate = 500;
			moveParam.targetPos = new egret.Point(farBox.boxDisplayObj.x, farBox.boxDisplayObj.y);
			moveParam.needRemoveOnFinish = true;
			var moveEvent = new PlayProgramAnimationEvent();
			moveEvent.param = moveParam;
			GameMain.GetInstance().DispatchEvent(moveEvent);

			var scaleParam = new PaScalingParam()
			scaleParam.displayObj = nearBox.boxDisplayObj;
			scaleParam.targetScaleX = 0;
			scaleParam.targetScaleY = 0;
			scaleParam.duration = 200;
			scaleParam.interval = 200;
			var scaleEvent = new PlayProgramAnimationEvent()
			scaleEvent.param = scaleParam;
			GameMain.GetInstance().DispatchEvent(scaleEvent);

			this.DeleteBox(nearBox, false);
		}
	}

	private OnBeginContact(event)
	{
		var shapeA: p2.Shape = event.shapeA;
		var shapeB: p2.Shape = event.shapeB;
		var bodyA: p2.Body = event.bodyA;
		var bodyB: p2.Body = event.bodyB;

		if (shapeA != null
			&& shapeB != null)
		{
			if (shapeA.collisionGroup == Collision_Layer_Box
				&& shapeB.collisionGroup == Collision_Layer_Ball)
			{
				var box = this.GetBoxById(shapeA.id);
				this.OnHitBox(box, bodyB);
			}
			if (shapeA.collisionGroup == Collision_Layer_Ball
				&& shapeB.collisionGroup == Collision_Layer_Box)
			{
				var box = this.GetBoxById(shapeB.id);
				this.OnHitBox(box, bodyA);
			}

			// if (shapeA.collisionGroup == Collision_Layer_Box
			// 	&& shapeB.collisionGroup == Collision_Layer_Box)
			// {
			// 	var boxA = this.GetBoxById(shapeA.id);
			// 	var boxB = this.GetBoxById(shapeB.id);
			// 	this.MergeBox(boxA, boxB);
			// }
		}
	}

	public Release()
	{
		this.UnRegisterEvent();
	}
}