enum TriangleBoxType
{
	LeftTop,
	LeftBottom,
	RightTop,
	RightBottom,
}

class TriangleBox extends Box
{
	public triangleBoxType: TriangleBoxType;
	public width: number;
	public pointList: egret.Point[];
	public centerOffset: egret.Point; 

	public constructor(id: number, initPos: egret.Point, targetPos: egret.Point, health: number, width: number)
	{
		super(id, initPos, targetPos, health);
		this.canMerge = true;
		this.width = width;
		this.InitTriangleBoxType();
		this.CreatePoint();
		this.CreateBox();
		this.SetColor(0x00ff00);
	}

	private InitTriangleBoxType()
	{
		var deltaX = this.targetPos.x - this.initPos.x;
		var deltaY = this.targetPos.y - this.initPos.y;
		if (deltaX >= 0 && deltaY >= 0)
		{
			this.triangleBoxType = TriangleBoxType.LeftTop;
		}
		else if (deltaX >= 0 && deltaY <= 0)
		{
			this.triangleBoxType = TriangleBoxType.LeftBottom;
		}
		else if (deltaX <= 0 && deltaY <= 0)
		{
			this.triangleBoxType = TriangleBoxType.RightBottom;
		}
		else
		{
			this.triangleBoxType = TriangleBoxType.RightTop;
		}
	}

	private CreatePoint()
	{
		this.pointList = [];
		var leftTop = new egret.Point(-this.width / 2, -this.width / 2);
		var leftBottom = new egret.Point(-this.width / 2, this.width / 2);
		var rightTop = new egret.Point(this.width / 2, -this.width / 2);
		var rightBottom = new egret.Point(this.width / 2, this.width / 2);
		if (this.triangleBoxType == TriangleBoxType.LeftTop)
		{
			this.pointList.push(leftBottom);
			this.pointList.push(leftTop);
			this.pointList.push(rightTop);
			this.centerOffset = new egret.Point(-this.width / 4, -this.width / 4);
		}
		else if (this.triangleBoxType == TriangleBoxType.LeftBottom)
		{
			this.pointList.push(rightBottom);
			this.pointList.push(leftBottom);
			this.pointList.push(leftTop);
			this.centerOffset = new egret.Point(-this.width / 4, this.width / 4);
		}
		else if (this.triangleBoxType == TriangleBoxType.RightBottom)
		{
			this.pointList.push(rightTop);
			this.pointList.push(rightBottom);
			this.pointList.push(leftBottom);
			this.centerOffset = new egret.Point(this.width / 4, this.width / 4);
		}
		else if (this.triangleBoxType == TriangleBoxType.RightTop)
		{
			this.pointList.push(leftTop);
			this.pointList.push(rightTop);
			this.pointList.push(rightBottom);
			this.centerOffset = new egret.Point(this.width / 4, -this.width / 4);
		}

		// this.centerOffset = new egret.Point(0,0);
		// for (var i = 0; i < this.pointList.length; ++i)
		// {
		// 	this.centerOffset.x += this.pointList[i].x;
		// 	this.centerOffset.y += this.pointList[i].y;
		// }
		// this.centerOffset.x /= this.pointList.length;
		// this.centerOffset.y /= this.pointList.length;
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
		this.boxDisplayObj.graphics.moveTo(this.pointList[this.pointList.length - 1].x, 
										   this.pointList[this.pointList.length - 1].y);
		for (var i = 0; i < this.pointList.length; ++i)
		{
			this.boxDisplayObj.graphics.lineTo(this.pointList[i].x, this.pointList[i].y);
		}
		this.boxDisplayObj.graphics.endFill();
		this.boxDisplayObj.x = this.initPos.x;
		this.boxDisplayObj.y = this.initPos.y;

		this.healthDisplayObj = new egret.TextField();
		this.healthDisplayObj.text = this.health.toString();
		this.healthDisplayObj.x = this.initPos.x + this.centerOffset.x;
		this.healthDisplayObj.y = this.initPos.y+ this.centerOffset.y;
		this.healthDisplayObj.width = this.boxSize.x;
		this.healthDisplayObj.height = this.boxSize.y;
		this.healthDisplayObj.anchorOffsetX = this.healthDisplayObj.width / 2;
		this.healthDisplayObj.anchorOffsetY = this.healthDisplayObj.height / 2;
		this.healthDisplayObj.textAlign = egret.HorizontalAlign.CENTER;
		this.healthDisplayObj.verticalAlign = egret.VerticalAlign.MIDDLE;

		var vertices = [];
		for (var i = 0; i < this.pointList.length; ++i)
		{
			vertices.push([this.pointList[i].x, this.pointList[i].y]);
		}
		this.phyShape = new p2.Convex({ vertices: vertices });
		this.phyShape.id = this.id;
		this.phyShape.collisionGroup = Collision_Layer_Box;
		this.phyShape.collisionMask = Collision_Layer_Ball;
		this.phyBody = new p2.Body({
			id: this.id,
			mass: this.boxMass, position: [this.initPos.x, this.initPos.y],
			velocity: [moveDir.x, moveDir.y], type: p2.Body.KINEMATIC
		});
		this.phyBody.collisionResponse = true;
		this.phyBody.addShape(this.phyShape);
		this.phyBody.displays = [this.boxDisplayObj, this.healthDisplayObj];
	}
}