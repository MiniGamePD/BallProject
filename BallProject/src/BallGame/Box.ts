class Box
{
	public id: number;
	public health: number;
	public initPos: egret.Point;
	public boxSize: egret.Point;
	public targetPos: egret.Point;
	public boxMass = 20000;
	public moveSpeed: number = 20;

	public boxDisplayObj: egret.Shape;
	public healthDisplayObj: egret.TextField;
	public phyBody: p2.Body;
	public phyShape: p2.Shape;
	public color: number;

	public isHide = false;
	public hideTime = 0.1;

	public constructor()
	{
	}

	public Init(id: number, initPos: egret.Point, targetPos: egret.Point, health: number)
	{
		this.id = id;
		this.health = health;
		this.isHide = false;
		this.initPos = initPos;
		this.boxSize = new egret.Point(80, 80);
		this.targetPos = targetPos;
		this.CreateBox();
		this.SetColor(0x00ff00);
	}

	public CreateBox()
	{
		var moveDir = new egret.Point(this.targetPos.x - this.initPos.x, this.targetPos.y - this.initPos.y);
		moveDir.normalize(this.moveSpeed);

		this.boxDisplayObj = new egret.Shape();
		this.boxDisplayObj.graphics.lineStyle(2, 0x00ff00);
		this.boxDisplayObj.graphics.beginFill(0xFF0000, 0);
		this.boxDisplayObj.graphics.drawRect(0, 0, this.boxSize.x, this.boxSize.y);
		this.boxDisplayObj.graphics.endFill();
		this.boxDisplayObj.x = this.initPos.x;
		this.boxDisplayObj.y = this.initPos.y;
		this.boxDisplayObj.anchorOffsetX = this.boxDisplayObj.width / 2;
		this.boxDisplayObj.anchorOffsetY = this.boxDisplayObj.height / 2;

		this.healthDisplayObj = new egret.TextField();
		this.healthDisplayObj.text = this.health.toString();
        this.healthDisplayObj.x = this.initPos.x;
        this.healthDisplayObj.y = this.initPos.y;
		this.healthDisplayObj.width = this.boxSize.x;
        this.healthDisplayObj.height = this.boxSize.y;
		this.healthDisplayObj.anchorOffsetX = this.healthDisplayObj.width / 2;
		this.healthDisplayObj.anchorOffsetY = this.healthDisplayObj.height / 2;
        this.healthDisplayObj.textAlign = egret.HorizontalAlign.CENTER;
        this.healthDisplayObj.verticalAlign = egret.VerticalAlign.MIDDLE;

		this.phyShape = new p2.Box({ width: this.boxSize.x, height: this.boxSize.y });
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

	public SetColor(color: number)
	{
		this.color = color;
		
		if (this.boxDisplayObj != undefined
			&& this.boxDisplayObj != null)
		{
			this.boxDisplayObj.graphics.lineStyle(2, this.color);
		}

		if (this.healthDisplayObj != undefined
			&& this.healthDisplayObj != null)
		{
			this.healthDisplayObj.textColor = color;
		}
	}	

	public Update(deltaTime: number)
	{
		if (this.isHide)
		{
			this.SetHide(false);
		}
	}

	public changeHealth(healthValue: number)
	{
		this.health += healthValue;
		this.health = this.health < 0 ? 0 : this.health;
		this.SetHide(true);
		this.RefreshDisplay();
	}

	public RefreshDisplay()
	{
		if (this.healthDisplayObj != undefined
			&& this.healthDisplayObj != null)
		{
			this.healthDisplayObj.text = this.health.toString();
		}
	}

	public SetHide(hide: boolean)
	{
		this.isHide = hide;
		var alpha = this.isHide ? 0 : 1;

		if (this.boxDisplayObj != undefined
			&& this.boxDisplayObj != null)
		{
			this.boxDisplayObj.alpha = alpha;
		}

		if (this.healthDisplayObj != undefined
			&& this.healthDisplayObj != null)
		{
			this.healthDisplayObj.alpha = alpha;
		}
	}
}