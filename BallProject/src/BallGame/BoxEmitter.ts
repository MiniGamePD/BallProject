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
}

class BoxEmitter
{
	private resModule: IResModule;

	public ballGameWorld: BallGameWorld;

	public center: egret.Point;
	public boxList: Box[] = [];
	public instanceId = 0;
	public boxCreateStrategy: BoxCreateStrategy;
	public battleGround: egret.DisplayObjectContainer;

	public constructor()
	{
	}

	public Init(ballGameWorld: BallGameWorld, battleGround: egret.DisplayObjectContainer)
	{
		this.ballGameWorld = ballGameWorld;

		this.battleGround = battleGround;

		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

		this.center = this.ballGameWorld.center;

		this.boxList = [];

		this.instanceId = 0;

		this.ballGameWorld.world.on("beginContact", this.OnBeginContact, this);

		this.boxCreateStrategy = new BoxCreateStrategy();
		this.boxCreateStrategy.Init(this);
	}

	public Update(deltaTime: number)
	{
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

	private OnHitBox(box: Box)
	{
		if (box != null
			&& box != undefined)
		{
			box.changeHealth(-1);
			if (box.health <= 0)
			{
				box.OnEliminate();
				this.DeleteBox(box, true);
			}
		}
	}

	private DeleteBox(box: Box, detachDisplay: boolean)
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
			}
		}
	}

	private CheckGameOver()
	{
		for (var i = 0; i < this.boxList.length; ++i)
		{
			var boxA = this.boxList[i];
			var centerSizeScale = (boxA.GetBoxType() == BoxType.Triangle) ? 0.5 : 1;
			var deltaX = Math.abs(boxA.boxDisplayObj.x - this.center.x);
			var deltaY = Math.abs(boxA.boxDisplayObj.y - this.center.y);
			if (deltaX < GameOverCenterSize.x * centerSizeScale && deltaY < GameOverCenterSize.y * centerSizeScale)
			{
				let event = new GameOverEvent();
				GameMain.GetInstance().DispatchEvent(event);
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
			moveParam.attachDisplayObj =[nearBox.healthDisplayObj];
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
				this.OnHitBox(box);
			}
			if (shapeA.collisionGroup == Collision_Layer_Ball
				&& shapeB.collisionGroup == Collision_Layer_Box)
			{
				var box = this.GetBoxById(shapeB.id);
				this.OnHitBox(box);
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
	}
}