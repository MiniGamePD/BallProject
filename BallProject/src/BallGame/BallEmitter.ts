class BallEmitter
{
	private resModule: IResModule;    

	public ballGameWorld: BallGameWorld;
	public emitInterval = 200;
	public emitLeftTime = 0;
	public emitPos: egret.Point;
	public emitDir: egret.Point;
	public emitSpeed: number = 1500;
	public ballMass: number = 1;
	public ballRadius: number = 15;

	public ballList: p2.Body[] = [];
	
	public constructor()
	{
	}

	// 输入相关 begin
	private RegisterTouchEvent(): void {
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchEvent, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchEvent, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchEvent, this);
	}

	private UnRegisterTouchEvent(): void {
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchEvent, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchEvent, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchEvent, this);
	}

	private OnTouchEvent(evt: egret.TouchEvent): void {
		if (evt != null
			&& evt.stageX != undefined
			&& evt.stageY != undefined)
		{
			this.OnTouchPosition(evt.stageX, evt.stageY);
		}
	}
	// 输入相关 end

	public Init(ballGameWorld: BallGameWorld)
	{
		this.ballGameWorld = ballGameWorld;

		this.resModule = <IResModule> GameMain.GetInstance().GetModule(ModuleType.RES);

		this.emitPos = ballGameWorld.center;

		this.emitDir = new egret.Point(0, -this.emitSpeed);

		this.ballList = [];

		this.RegisterTouchEvent();
	}

	public OnTouchPosition(posX: number, posY: number)
	{
		this.emitDir.x = posX - this.emitPos.x;
		this.emitDir.y = posY - this.emitPos.y;
		this.emitDir.normalize(this.emitSpeed);
	}

	public Update(deltaTime: number)
	{
		this.emitLeftTime -= deltaTime;
		if (this.emitLeftTime < 0)
		{
			this.emitLeftTime = this.emitInterval;
			this.EmitBall();
		}

		this.ClearBall();
	}

	public EmitBall()
	{
		var ballShape: p2.Shape = new p2.Circle({ radius: this.ballRadius });
		ballShape.collisionGroup = Collision_Layer_Ball;
		ballShape.collisionMask = Collision_Layer_Box;
		var ballBody: p2.Body = new p2.Body({ mass: this.ballMass, position: [this.emitPos.x, this.emitPos.y], velocity: [this.emitDir.x, -this.emitDir.y] });
		ballBody.addShape(ballShape);
		this.ballGameWorld.world.addBody(ballBody);

		var display = this.resModule.CreateBitmapByName("Pill_Single_Yellow");
		display.width = (<p2.Circle>ballShape).radius * 2 * this.ballGameWorld.factor;
		display.height = (<p2.Circle>ballShape).radius * 2 * this.ballGameWorld.factor;
		display.x = this.emitPos.x;
		display.y = this.emitPos.y;

		display.anchorOffsetX = display.width / 2;
		display.anchorOffsetY = display.height / 2;
		ballBody.displays = [display];
		GameMain.GetInstance().GetGameStage().addChild(display);
		this.ballList.push(ballBody);
	}

	private ClearBall()
	{
		// for (var i = 0; i <this.ballList.length; ++i)
		// {

		// }
	}

	public Release()
	{
		this.UnRegisterTouchEvent();
	}
}