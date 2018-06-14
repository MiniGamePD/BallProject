class BoxEmitter
{
	private resModule: IResModule;    

	public ballGameWorld: BallGameWorld;
	public emitInterval = 1000;
	public emitLeftTime = 0;
	public center: egret.Point;
	public boxList: Box[] = [];
	public instanceId = 0;
	
	public constructor()
	{
	}

	public Init(ballGameWorld: BallGameWorld)
	{
		this.ballGameWorld = ballGameWorld;

		this.resModule = <IResModule> GameMain.GetInstance().GetModule(ModuleType.RES);

		this.center = this.ballGameWorld.center;

		this.boxList = [];

		this.instanceId = 0;

		this.ballGameWorld.world.on("beginContact", this.OnBeginContact, this);
	}

	public Update(deltaTime: number)
	{
		this.emitLeftTime -= deltaTime;
		if (this.emitLeftTime < 0)
		{
			this.emitLeftTime = this.emitInterval;
			this.EmitBox();
		}

		for (var i = 0; i < this.boxList.length; ++i)
		{
			if (this.boxList[i] != null)
			{
				this.boxList[i].Update(deltaTime);
			}
		} 
		// this.ClearBall();
	}

	public EmitBox()
	{	
		var randomX = (Math.random() > 0.5 ? 1 : 0) * GameMain.GetInstance().GetStageWidth();
		var randomY = Math.random() * GameMain.GetInstance().GetStageHeight();

		++this.instanceId;
		var id = this.instanceId;
		var box = new Box();
		box.Init(id, new egret.Point(randomX, randomY), this.center, 12);
		GameMain.GetInstance().GetGameStage().addChild(box.boxDisplayObj);
		GameMain.GetInstance().GetGameStage().addChild(box.healthDisplayObj);
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
			box.ReduceHealth(1);
			if (box.health <= 0)
			{
				this.DeleteBox(box);
			}
		}
	}

	private DeleteBox(box: Box)
	{
		if (box != null 
			&& box != undefined)
		{
			var idx = this.boxList.indexOf(box);
			if (idx >= 0)
			{
				Tools.DetachDisplayObjFromParent(box.boxDisplayObj);
				Tools.DetachDisplayObjFromParent(box.healthDisplayObj);
				if (box.phyBody != null)
				{
					this.ballGameWorld.world.removeBody(box.phyBody);
				}
				this.boxList.splice(idx, 1);
			}
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
        }
    }

	public Release()
	{
	}
}