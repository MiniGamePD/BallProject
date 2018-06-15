class BoxEmitter
{
	private resModule: IResModule;    

	public ballGameWorld: BallGameWorld;
	public emitInterval = 1000;
	public emitLeftTime = 0;
	public center: egret.Point;
	public boxList: Box[] = [];
	public instanceId = 0;
	public boxCreateStrategy: BoxCreateStrategy;
	
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

		this.boxCreateStrategy = new BoxCreateStrategy();
		this.boxCreateStrategy.Init();
	}

	public Update(deltaTime: number)
	{
		this.emitLeftTime -= deltaTime;
		if (this.emitLeftTime < 0)
		{
			this.emitLeftTime = this.emitInterval;
			var randomBirthPos = this.boxCreateStrategy.GetRandomBirthPos();
			this.EmitBox(randomBirthPos, 12);
		}

		for (var i = 0; i < this.boxList.length; ++i)
		{
			if (this.boxList[i] != null)
			{
				this.boxList[i].Update(deltaTime);
			}
		} 

		// this.CheckBoxOverlay();
	}

	public EmitBox(birthPos: egret.Point, health: number)
	{	
		++this.instanceId;
		var id = this.instanceId;
		var box = new Box();
		box.Init(id, new egret.Point(birthPos.x, birthPos.y), this.center, health);
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
			box.changeHealth(-1);
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

	private CheckBoxOverlay()
	{
		for (var i = 0; i < this.boxList.length; ++i)
		{
			for (var j = i + 1; j < this.boxList.length; ++j)
			{
				var boxA = this.boxList[i];
				var boxB = this.boxList[j];
				if (boxA.phyBody.overlaps(boxB.phyBody))
				{
					this.MergeBox(boxA, boxB);
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
			this.DeleteBox(nearBox);
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

			if (shapeA.collisionGroup == Collision_Layer_Box
				&& shapeB.collisionGroup == Collision_Layer_Box)
            {
				var boxA = this.GetBoxById(shapeA.id);
				var boxB = this.GetBoxById(shapeB.id);
				this.MergeBox(boxA, boxB);
			}
        }
    }

	public Release()
	{
	}
}