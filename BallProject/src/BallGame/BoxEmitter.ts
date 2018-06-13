class BoxEmitter
{
	private resModule: IResModule;    

	public ballGameWorld: BallGameWorld;
	public boxCount = 100;
	public emitInterval = 1000;
	public emitLeftTime = 0;
	public center: egret.Point;
	public moveSpeed: number = 10;
	public ballList: p2.Body[] = [];
	public boxSize: egret.Point;
	public boxMass = 2000;
	
	public constructor()
	{
	}

	public Init(ballGameWorld: BallGameWorld)
	{
		this.ballGameWorld = ballGameWorld;

		this.resModule = <IResModule> GameMain.GetInstance().GetModule(ModuleType.RES);

		this.center = this.ballGameWorld.center;

		this.ballList = [];

		this.boxSize = new egret.Point(80, 80); 
	}

	public Update(deltaTime: number)
	{
		this.emitLeftTime -= deltaTime;
		if (this.emitLeftTime < 0)
		{
			this.emitLeftTime = this.emitInterval;
			this.EmitBox();
		}

		this.ClearBall();
	}

	public EmitBox()
	{	
		var randomX = (Math.random() > 0.5 ? 1 : 0) * GameMain.GetInstance().GetStageWidth();
		var randomY = Math.random() * GameMain.GetInstance().GetStageHeight();
		var randomAngle = Math.random() * 360;

		var moveDir = new egret.Point(this.center.x - randomX, this.center.y - randomY);
		moveDir.normalize(this.moveSpeed);

		var shape: p2.Shape = new p2.Box({ width: this.boxSize.x, height: this.boxSize.y, angle: randomAngle});
		shape.collisionGroup = Collision_Layer_Box;
		shape.collisionMask = Collision_Layer_Ball;
		var body: p2.Body = new p2.Body({ mass: this.boxMass, position: [randomX, randomY], velocity: [moveDir.x, moveDir.y], type: p2.Body.KINEMATIC });
		body.addShape(shape);
		this.ballGameWorld.world.addBody(body);

		var display: egret.Shape = new egret.Shape();
        display.graphics.lineStyle(10, 0x00ff00 );
        display.graphics.beginFill(0xFF0000, 0);
        display.graphics.drawRect(0,0,this.boxSize.x ,this.boxSize.y);
        display.graphics.endFill();
		display.x = randomX;
		display.y = -randomY;
		display.anchorOffsetX = display.width / 2;
		display.anchorOffsetY = display.height / 2;

		body.displays = [display];
		GameMain.GetInstance().GetGameStage().addChild(display);
		this.ballList.push(body);
	}

	private ClearBall()
	{
		// for (var i = 0; i <this.ballList.length; ++i)
		// {

		// }
	}

	public Release()
	{
	}
}