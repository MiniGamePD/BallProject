class Ball
{
	private resModule: IResModule;

	public id: number;
	public emitPos: egret.Point;
	public emitDir: egret.Point;
	public emitSpeed: number;
	public ballMass: number;
	public ballRadius: number;
	public ballTextureName: string;
	public canSplitOnHit: boolean;
	public displayScale: number;

	public ballDisplay: egret.Bitmap;
	public phyShape: p2.Shape;
	public phyBody: p2.Body;

	public constructor(resModule: IResModule)
	{
		this.resModule = resModule;
	}

	public Init(id: number, emitPos: egret.Point, emitDir: egret.Point,
		emitSpeed: number, ballMass: number, ballRadius: number, ballTextureName: string, canSplit: boolean, displayScale: number)
	{
		this.id = id;
		this.emitPos = emitPos;
		this.emitDir = emitDir;
		this.emitSpeed = emitSpeed;
		this.ballMass = ballMass;
		this.ballRadius = ballRadius;
		this.ballTextureName = ballTextureName;
		this.canSplitOnHit = canSplit;
		this.displayScale = displayScale;

		emitDir.normalize(emitSpeed);
		this.phyShape = new p2.Circle({ id: id, radius: this.ballRadius });
		this.phyShape.collisionGroup = Collision_Layer_Ball;
		this.phyShape.collisionMask = Collision_Layer_Box;


		this.ballDisplay = this.resModule.CreateBitmapByName(ballTextureName);
		this.ballDisplay.width = this.ballRadius * 2 * this.displayScale;
		this.ballDisplay.height = this.ballRadius * 2 * this.displayScale;
		this.ballDisplay.x = emitPos.x;
		this.ballDisplay.y = emitPos.y;

		this.ballDisplay.anchorOffsetX = this.ballDisplay.width / 2;
		this.ballDisplay.anchorOffsetY = this.ballDisplay.height / 2;

		this.phyBody = new p2.Body({
			id: id,
			mass: this.ballMass,
			position: [emitPos.x, emitPos.y],
			velocity: [emitDir.x, emitDir.y]
		});
		this.phyBody.addShape(this.phyShape);
		this.phyBody.displays = [this.ballDisplay];
	}

	public ScaleBallRadius(scale: number, maxRadius: number)
	{
		var radius = this.ballRadius * scale;
		radius = Tools.Clamp(radius, 0.1, maxRadius)
		if (this.ballRadius != radius)
		{
			this.ballRadius = radius;
			(<p2.Circle>this.phyShape).radius = this.ballRadius;

			this.ballDisplay.width = this.ballRadius * 2 * this.displayScale;
			this.ballDisplay.height = this.ballRadius * 2 * this.displayScale;
			this.ballDisplay.anchorOffsetX = this.ballDisplay.width / 2;
			this.ballDisplay.anchorOffsetY = this.ballDisplay.height / 2;
		}
	}
}