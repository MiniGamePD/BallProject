class CircleBox extends Box
{
	public radius: number;
	public constructor(id: number, initPos: egret.Point, targetPos: egret.Point, health: number, radius: number)
	{
		super(id, initPos, targetPos, health)

		this.radius = radius;
		this.canMerge = true;

		this.CreateBox();
		this.SetColor(0x00ff00);
	}
	
	public GetBoxType(): BoxType
	{
		return BoxType.Square;
	}

	public CreateBox()
	{
		var moveDir = new egret.Point(this.targetPos.x - this.initPos.x, this.targetPos.y - this.initPos.y);
		moveDir.normalize(this.moveSpeed);
		
		this.boxDisplayObj = new egret.Shape();
		this.boxDisplayObj.graphics.lineStyle(2, 0x00ff00);
		this.boxDisplayObj.graphics.beginFill(0xFF0000, 0);
		this.boxDisplayObj.graphics.drawCircle(0, 0, this.radius);
		this.boxDisplayObj.graphics.endFill();
		this.boxDisplayObj.x = this.initPos.x;
		this.boxDisplayObj.y = this.initPos.y;

		this.healthDisplayObj = new egret.TextField();
		this.healthDisplayObj.text = this.health.toString();
        this.healthDisplayObj.x = this.initPos.x;
        this.healthDisplayObj.y = this.initPos.y;
		this.healthDisplayObj.width = this.radius * 2;
        this.healthDisplayObj.height = this.radius * 2;
		this.healthDisplayObj.anchorOffsetX = this.healthDisplayObj.width / 2;
		this.healthDisplayObj.anchorOffsetY = this.healthDisplayObj.height / 2;
        this.healthDisplayObj.textAlign = egret.HorizontalAlign.CENTER;
        this.healthDisplayObj.verticalAlign = egret.VerticalAlign.MIDDLE;

		this.phyShape = new p2.Circle({ radius: this.radius });
		this.phyShape.id = this.id;
		this.phyShape.collisionGroup = Collision_Layer_Box;
		this.phyShape.collisionMask = Collision_Layer_Ball;
		this.phyBody = new p2.Body({id: this.id,
			mass: this.boxMass, position: [this.initPos.x, this.initPos.y],
			velocity: [moveDir.x, moveDir.y], type: p2.Body.KINEMATIC
		});
		this.phyBody.collisionResponse = true;
		this.phyBody.addShape(this.phyShape);
		this.phyBody.displays = [this.boxDisplayObj, this.healthDisplayObj];
	}
}