abstract class Box
{
	public id: number;
	public health: number;
	public initPos: egret.Point;
	public boxSize: egret.Point;
	public targetPos: egret.Point;
	public boxMass = 20000;
	public moveSpeed: number = BoxMoveSpeed;

	public boxDisplayObj: egret.Shape;
	public healthDisplayObj: egret.TextField;
	public phyBody: p2.Body;
	public phyShape: p2.Shape;
	public color: number;

	public isHide = false;
	public hideTime = 0.1;

	public canMerge: boolean = false;

	public constructor(id: number, initPos: egret.Point, targetPos: egret.Point, health: number)
	{
		this.id = id;
		this.health = health;
		this.isHide = false;
		this.initPos = initPos;
		this.boxSize = new egret.Point(80, 80);
		this.targetPos = targetPos;
		this.moveSpeed = BoxMoveSpeed;
	}

	public abstract GetBoxType(): BoxType;

	public abstract CreateBox();

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

	public OnEliminate()
	{

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