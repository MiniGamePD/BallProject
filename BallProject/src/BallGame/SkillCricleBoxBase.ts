class SkillCricleBoxBase extends Box
{
	public radius: number;
	public constructor(id: number, initPos: egret.Point, targetPos: egret.Point, health: number, radius: number)
	{
		super(id, initPos, targetPos, health)
		this.canMerge = false;
		this.radius = radius;
		this.moveSpeed = 0;
		
		this.CreateBox();
		this.SetColor(0xffffff);
	}

	public GetBoxType(): BoxType
	{
		return BoxType.None;
	}

	public GetSkillBitmapName(): string
	{
		if (DEBUG)
		{
			console.assert(false, "Can not instance SkillCricleBox!");
		}
		return "";
	}

	public CreateDisplay(): egret.DisplayObject
	{
		var resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		var shape = resModule.CreateBitmapByName(this.GetSkillBitmapName());
		shape.width = this.radius * 2;
		shape.height = this.radius * 2;
		shape.x = this.initPos.x;
		shape.y = this.initPos.y;
		shape.anchorOffsetX = this.radius;
		shape.anchorOffsetY = this.radius;
		return shape;
	}

	public CreateBox()
	{
		// var moveDir = new egret.Point(this.targetPos.x - this.initPos.x, this.targetPos.y - this.initPos.y);
		// moveDir.normalize(this.moveSpeed);

		this.boxDisplayObj = this.CreateDisplay();

		this.healthDisplayObj = new egret.TextField();
		this.healthDisplayObj.text = this.health.toString();
		this.healthDisplayObj.x = this.initPos.x;
		this.healthDisplayObj.y = this.initPos.y;
		this.healthDisplayObj.width = this.radius * 2;
		this.healthDisplayObj.height = this.radius * 2;
		this.healthDisplayObj.anchorOffsetX = this.healthDisplayObj.width / 2;
		this.healthDisplayObj.anchorOffsetY = this.healthDisplayObj.height / 2 - 18;
		this.healthDisplayObj.textAlign = egret.HorizontalAlign.CENTER;
		this.healthDisplayObj.verticalAlign = egret.VerticalAlign.MIDDLE;

		this.phyShape = new p2.Circle({ radius: this.radius });
		this.phyShape.id = this.id;
		this.phyShape.collisionGroup = Collision_Layer_Box;
		this.phyShape.collisionMask = Collision_Layer_Ball;
		this.phyBody = new p2.Body({
			id: this.id,
			mass: this.boxMass, position: [this.initPos.x, this.initPos.y],
			/*velocity: [moveDir.x, moveDir.y],*/ type: p2.Body.KINEMATIC
		});
		this.phyBody.collisionResponse = true;
		this.phyBody.addShape(this.phyShape);
		this.phyBody.displays = [this.boxDisplayObj, this.healthDisplayObj];
	}

	public OnEliminate()
	{
		super.OnEliminate();
		
		var event = new SpecialBoxEliminateEvent()
		event.boxType = this.GetBoxType();
		GameMain.GetInstance().DispatchEvent(event);
	}
}