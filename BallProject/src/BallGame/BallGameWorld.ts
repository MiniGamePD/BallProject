class BallGameWorld
{
	public world: p2.World;
	public factor: number = 1;
	public center: egret.Point;

	public constructor()
	{
	}

	public Init()
	{
		this.world = new p2.World();
		this.world.sleepMode = p2.World.BODY_SLEEPING;
		this.world.applyGravity = false;
		this.world.defaultContactMaterial.restitution = 0.99;
		this.center = new egret.Point(GameMain.GetInstance().GetStageWidth() / 2, 
									GameMain.GetInstance().GetStageHeight() / 2)
	}

	public Update(deltaTime: number)
	{
		this.world.step(deltaTime * 0.001);
		this.SyncDisplayObj();
	}

	public SyncDisplayObj()
	{
		var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
		var l = this.world.bodies.length;
		for (var i: number = 0; i < l; i++)
		{
			var boxBody: p2.Body = this.world.bodies[i];
			var box: egret.DisplayObject = boxBody.displays[0];
			if (box)
			{
				box.x = boxBody.position[0] * this.factor;
				box.y = stageHeight - boxBody.position[1] * this.factor;
				box.rotation = 360 - (boxBody.angle + boxBody.shapes[0].angle) * 180 / Math.PI;
				
				if (DEBUG)
				{
					// 如果是sleep状态，改变一下Alpha
					if (boxBody.sleepState == p2.Body.SLEEPING)
					{
						box.alpha = 0.5;
					}
					else
					{
						box.alpha = 1;
					}
				}
			}
		}
	}

	public Release()
	{
	}
}