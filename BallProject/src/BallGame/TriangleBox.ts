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
	public healthOffset: egret.Point; 
	private healthOffsetRate = 0.2;
	private displayScale: egret.Point;

	public constructor(id: number, initPos: egret.Point, targetPos: egret.Point, health: number, width: number)
	{
		super(id, initPos, targetPos, health);
		this.canMerge = true;
		this.width = width;
		this.InitTriangleBoxType();
		this.CreatePoint();
		this.CreateBox();
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
		this.displayScale = new egret.Point;
		if (this.triangleBoxType == TriangleBoxType.LeftTop)
		{
			this.displayScale.x = 1;
			this.displayScale.y = 1;
			this.pointList.push(leftBottom);
			this.pointList.push(leftTop);
			this.pointList.push(rightTop);
			this.healthOffset = new egret.Point(-this.width * this.healthOffsetRate, -this.width * this.healthOffsetRate);
		}
		else if (this.triangleBoxType == TriangleBoxType.LeftBottom)
		{
			this.displayScale.x = 1;
			this.displayScale.y = -1;
			this.pointList.push(rightBottom);
			this.pointList.push(leftBottom);
			this.pointList.push(leftTop);
			this.healthOffset = new egret.Point(-this.width * this.healthOffsetRate, this.width * this.healthOffsetRate);
		}
		else if (this.triangleBoxType == TriangleBoxType.RightBottom)
		{
			this.displayScale.x = -1;
			this.displayScale.y = -1;
			this.pointList.push(rightTop);
			this.pointList.push(rightBottom);
			this.pointList.push(leftBottom);
			this.healthOffset = new egret.Point(this.width * this.healthOffsetRate, this.width * this.healthOffsetRate);
		}
		else if (this.triangleBoxType == TriangleBoxType.RightTop)
		{
			this.displayScale.x = -1;
			this.displayScale.y = 1;
			this.pointList.push(leftTop);
			this.pointList.push(rightTop);
			this.pointList.push(rightBottom);
			this.healthOffset = new egret.Point(this.width * this.healthOffsetRate, -this.width * this.healthOffsetRate);
		}
	}

	public GetBoxType(): BoxType
	{
		return BoxType.Triangle;
	}

	public GetCenterPos(): egret.Point
	{
		this.boxCenterPosTemp.x = this.healthDisplayObj.x + this.healthOffset.x;
		this.boxCenterPosTemp.y = this.healthDisplayObj.y + this.healthOffset.y;
		return this.boxCenterPosTemp;
	}

	public CreateDisplay(): egret.DisplayObject
	{
		var resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		var boxName = "TriangleBox" + (this.colorIndex + 1);
		var shape = resModule.CreateBitmap(boxName, this.initPos.x, this.initPos.y);
		shape.width = this.width;
		shape.height = this.width;
		Tools.SetAnchor(shape, AnchorType.Center);
		shape.scaleX = this.displayScale.x;
		shape.scaleY = this.displayScale.y;
		return shape;
	}

	public CreateBox()
	{
		var moveDir = new egret.Point(this.targetPos.x - this.initPos.x, this.targetPos.y - this.initPos.y);
		moveDir.normalize(this.moveSpeed);

		this.boxDisplayObj = this.CreateDisplay();

		this.healthDisplayObj = new egret.TextField();
		this.healthDisplayObj.text = this.health.toString();
		this.healthDisplayObj.x = this.initPos.x;
		this.healthDisplayObj.y = this.initPos.y;
		this.healthDisplayObj.width = this.width;
		this.healthDisplayObj.height = this.width;
		this.healthDisplayObj.anchorOffsetX = this.width / 2 - this.healthOffset.x;
		this.healthDisplayObj.anchorOffsetY = this.width / 2 - this.healthOffset.y;
		this.healthDisplayObj.textAlign = egret.HorizontalAlign.CENTER;
		this.healthDisplayObj.verticalAlign = egret.VerticalAlign.MIDDLE;
		this.healthDisplayObj.textColor = this.color;

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