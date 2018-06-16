class BallGameWorld
{
	public world: p2.World;
	public factor: number = 1;
	public center: egret.Point;

	private debugDraw: p2DebugDraw;
	private enableDebugDraw = false;

	public constructor()
	{
	}

	public Init()
	{
		this.world = new p2.World();
		this.world.sleepMode = p2.World.BODY_SLEEPING;
		this.world.applyGravity = false;
		this.world.defaultContactMaterial.restitution = 1;
		// this.world.setGlobalStiffness(Number.MAX_VALUE);
		this.center = new egret.Point(GameMain.GetInstance().GetStageWidth() / 2, 
									GameMain.GetInstance().GetStageHeight() / 2)

		if (this.enableDebugDraw)
		{
			this.debugDraw = new p2DebugDraw(this.world);
			this.createDebug();
		}
	}

	private createDebug(): void {
        //创建调试试图
        this.debugDraw = new p2DebugDraw(this.world);
        var sprite: egret.Sprite = new egret.Sprite();
		GameMain.GetInstance().GetGameStage().addChild(sprite);
        this.debugDraw.setSprite(sprite);

        this.debugDraw.setLineWidth(0.02);
        sprite.scaleX = 1;
        sprite.scaleY = 1;
    }

	public Update(deltaTime: number)
	{
		this.world.step(deltaTime * 0.001);
		this.SyncDisplayObj();
		
		if(this.enableDebugDraw && this.debugDraw != null)
		{
			this.debugDraw.drawDebug();
		}
	}

	public SyncDisplayObj()
	{
		var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
		var l = this.world.bodies.length;
		for (var i: number = 0; i < l; i++)
		{
			var boxBody: p2.Body = this.world.bodies[i];
			for (var disId = 0; disId < boxBody.displays.length; ++disId)
			{
				var displayObj: egret.DisplayObject = boxBody.displays[disId];
				if (displayObj)
				{
					displayObj.x = boxBody.position[0] * this.factor;
					displayObj.y = boxBody.position[1] * this.factor;
					displayObj.rotation = 360 - (boxBody.angle + boxBody.shapes[0].angle) * 180 / Math.PI;
					
					if (this.enableDebugDraw)
					{
						// 如果是sleep状态，改变一下Alpha
						if (boxBody.sleepState == p2.Body.SLEEPING)
						{
							displayObj.alpha = 0.5;
						}
						else
						{
							displayObj.alpha = 1;
						}
					}
				}
			}
			
		}
	}

	public Release()
	{
		this.world.clear();
	}
}