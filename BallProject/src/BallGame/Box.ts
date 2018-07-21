abstract class Box
{
	public id: number;
	public health: number;
	public initPos: egret.Point;
	public boxSize: egret.Point;
	public targetPos: egret.Point;
	public boxMass = 20000;
	public moveSpeed: number = BoxMoveSpeed;

	public boxDisplayObj: egret.DisplayObject;
	public healthDisplayObj: egret.TextField;
	public phyBody: p2.Body;
	public phyShape: p2.Shape;
	public color: number;
	public colorIndex: number;

	public isHide = false;
	public hideCDTime = 0;

	public canMerge: boolean = false;

	public pause = false;
	public pauseLeftTime = 0;
	public pauseEffect: egret.DisplayObject;

	protected boxCenterPosTemp: egret.Point;

	public constructor(id: number, initPos: egret.Point, targetPos: egret.Point, health: number)
	{
		this.id = id;
		this.health = health;
		this.isHide = false;
		this.initPos = initPos;
		this.boxSize = new egret.Point(80, 80);
		this.targetPos = targetPos;
		this.moveSpeed = BoxMoveSpeed;
		this.SetColor(this.GetRandomBoxColor());
		this.boxCenterPosTemp = new egret.Point();
	}

	public GetRandomBoxColor(): number
	{
		this.colorIndex = Math.floor(Math.random() * BoxColorPool.length);
		return BoxColorPool[this.colorIndex];
	}

	public abstract GetBoxType(): BoxType;

	public abstract CreateBox();

	public SetColor(color: number)
	{
		this.color = color;

		if (this.healthDisplayObj != undefined
			&& this.healthDisplayObj != null)
		{
			this.healthDisplayObj.textColor = color;
		}
	}

	public GetCenterPos(): egret.Point
	{
		this.boxCenterPosTemp.x = this.healthDisplayObj.x;
		this.boxCenterPosTemp.y = this.healthDisplayObj.y;
		return this.boxCenterPosTemp;
	}

	public Update(deltaTime: number)
	{
		if (this.pauseLeftTime > 0)
		{
			this.pauseLeftTime -= deltaTime;
			if (this.pauseLeftTime <= 0)
			{
				this.SetPause(false);
			}
		}

		if (this.hideCDTime > 0)
		{
			this.hideCDTime -= deltaTime;
			if (this.hideCDTime <= 0
				&& this.isHide)
			{
				this.SetHide(false);
			}
		}
	}

	public changeHealth(healthValue: number): number
	{
		var lastHealth = this.health;
		this.health += healthValue;
		this.health = this.health < 0 ? 0 : this.health;
		this.SetHide(true);
		this.RefreshDisplay();
		return this.health - lastHealth;
	}

	public OnEliminate()
	{
		Tools.DetachDisplayObjFromParent(this.pauseEffect);
		this.PlayBoxBoomEffect();
	}

	public PlayBoxBoomEffect()
	{
		for (var i = 1; i <= 7; ++i)
		{
			this.BoxBoomPartical("BoxBoom" + i);
		}
	}

	public BoxBoomPartical(textureName: string)
	{
		var param = new PaPlayParticalParam;
		param.textureName = textureName;
		param.jsonName = "BoxBoom";
		param.duration = 3000;
		param.emitDuration = 100;
		param.posX = this.boxDisplayObj.x;
		param.posY = this.boxDisplayObj.y;
		var event = new PlayProgramAnimationEvent();
		event.param = param;
		GameMain.GetInstance().DispatchEvent(event);
	}

	public RefreshDisplay()
	{
		if (this.healthDisplayObj != undefined
			&& this.healthDisplayObj != null)
		{
			this.healthDisplayObj.text = this.health.toString();
		}
	}

	public SetHide(hide: boolean, froce?: boolean)
	{
		if (this.hideCDTime <= 0 || froce == true)
		{
			this.hideCDTime = BoxHitHideCDTime;
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

	public Pause(pauseTime: number, pauseEffect?: egret.DisplayObject)
	{
		this.SetPause(true);
		this.pauseLeftTime = pauseTime;
		Tools.DetachDisplayObjFromParent(this.pauseEffect);
		this.pauseEffect = pauseEffect;
	}

	private SetPause(pause: boolean)
	{
		this.pause = pause;
		if (this.moveSpeed > 0
			&& this.phyBody != null)
		{
			if (pause)
			{
				this.phyBody.velocity = [0, 0]
			}
			else
			{
				var moveDir = new egret.Point(this.targetPos.x - this.initPos.x, this.targetPos.y - this.initPos.y);
				moveDir.normalize(this.moveSpeed);
				this.phyBody.velocity = [moveDir.x, moveDir.y]
			}
		}
	}
}