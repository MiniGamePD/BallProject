class BoxCreateStrategy
{
	private boxEmitter: BoxEmitter;

	public runTime = 0;
	public emitInterval = 0;
	public emitLeftTime = 0;

	private widthCount = 5;
	private heightCount = 8;

	private extraWidth = 0;
	private extraHeight = 0;

	public birthPoint: egret.Point[] = [];
	public specialBoxRandomBirthPosTemp = new egret.Point(0, 0);

	public specialBoxStrategy: SpecialBoxStrategy[];

	public constructor()
	{
	}

	public Init(boxEmitter: BoxEmitter)
	{
		this.boxEmitter = boxEmitter;
		this.emitInterval = 1000 / BoxCreateCountPerSecond;
		this.runTime = 0;

		var minWidth = -this.extraWidth;
		var maxWidth = GameMain.GetInstance().GetStageWidth() + this.extraWidth;
		var widthStep = (maxWidth - minWidth) / this.widthCount;

		var minHeight = -this.extraHeight;
		var maxHeight = GameMain.GetInstance().GetStageHeight() + this.extraHeight;
		var heightStep = (maxHeight - minHeight) / this.heightCount;

		for (var i = 0; i < this.widthCount; ++i)
		{
			var upPoint = new egret.Point(minWidth + i * widthStep, minHeight);
			var downPoint = new egret.Point(minWidth + i * widthStep, maxHeight);
			this.birthPoint.push(upPoint);
			this.birthPoint.push(downPoint);
		}
		
		for (var i = 0; i < this.heightCount; ++i)
		{
			var leftPoint = new egret.Point(minWidth, minHeight + i * heightStep);
			var rightPoint = new egret.Point(maxWidth, minHeight + i * heightStep);
			this.birthPoint.push(leftPoint);
			this.birthPoint.push(rightPoint);
		}

		this.CreateSpecialBoxStrategy(); 
	}

	public Update(deltaTime: number)
	{
		this.runTime += deltaTime;
		this.emitLeftTime -= deltaTime;
		if (this.emitLeftTime < 0)
		{
			this.emitLeftTime = this.emitInterval;
			var randomBirthPos = this.GetRandomBirthPos();
			var randomBoxType = this.GetRandomBoxType();
			this.boxEmitter.EmitBox(randomBoxType, randomBirthPos, this.GetRandomBoxHealth());
		}

		this.UpdateSpecialBoxStrategy(deltaTime);
	}

	public GetRandomBoxHealth(): number
	{
		return Math.floor(this.runTime * 0.001 * BoxHealthIncreasePerSecond)  + 1;
	}

	public GetRandomBirthPos(): egret.Point
	{
		var ranIdx = Math.floor(Math.random() * this.birthPoint.length);
		return this.birthPoint[ranIdx];
	}

	public GetRandomBoxType(): BoxType
	{
		return Math.random() > BoxSquareAndTriangleRate ? BoxType.Triangle : BoxType.Square;
	}

	public GetSpecialBoxRandomBirthPos()
	{
		this.specialBoxRandomBirthPosTemp.x = (Math.random() - 0.5) * GameMain.GetInstance().GetStageWidth() * SpecialBoxRandomBirthPos_Stage_Range;
		this.specialBoxRandomBirthPosTemp.y = (Math.random() - 0.5) * GameMain.GetInstance().GetStageHeight() * SpecialBoxRandomBirthPos_Stage_Range;
		if (Math.abs(this.specialBoxRandomBirthPosTemp.x) < SpecialBoxRandomBirthPos_Center_Offset
			 && Math.abs(this.specialBoxRandomBirthPosTemp.y) < SpecialBoxRandomBirthPos_Center_Offset)
		{
			var widthMax = GameMain.GetInstance().GetStageWidth() * SpecialBoxRandomBirthPos_Stage_Range * 0.5;
			var min = Math.min(SpecialBoxRandomBirthPos_Center_Offset, widthMax);
			var max = Math.min(SpecialBoxRandomBirthPos_Center_Offset, widthMax);
			var ranDis = Tools.RandomInterval(min, max);
			this.specialBoxRandomBirthPosTemp.normalize(ranDis);
		}
		this.specialBoxRandomBirthPosTemp.x +=  GameMain.GetInstance().GetStageWidth() * 0.5;
		this.specialBoxRandomBirthPosTemp.y += GameMain.GetInstance().GetStageHeight() * 0.5;
		return this.specialBoxRandomBirthPosTemp;
	}

	public CreateSpecialBoxStrategy()
	{
		this.specialBoxStrategy = [];
		this.specialBoxStrategy.push(new SpecialBoxStrategy(BoxType.SixMulDir, 28000, 32000, 10));
		this.specialBoxStrategy.push(new SpecialBoxStrategy(BoxType.FireUp, 38000, 42000, 10));
		this.specialBoxStrategy.push(new SpecialBoxStrategy(BoxType.LevelUp, 14000, 16000, 10));
		this.specialBoxStrategy.push(new SpecialBoxStrategy(BoxType.Pause, 25000, 35000, 10));
		this.specialBoxStrategy.push(new SpecialBoxStrategy(BoxType.GoldCoin, 50000, 70000, 10));
	}

	private UpdateSpecialBoxStrategy(deltaTime: number)
	{
		for (var i = 0; i < this.specialBoxStrategy.length; ++i)
		{
			this.specialBoxStrategy[i].createLeftTime -= deltaTime;
			if (this.specialBoxStrategy[i].createLeftTime <= 0)
			{
				this.specialBoxStrategy[i].ResetLeftTime();
				var randomBirthPos = this.GetSpecialBoxRandomBirthPos();
				this.boxEmitter.EmitBox(this.specialBoxStrategy[i].boxType, randomBirthPos, this.specialBoxStrategy[i].health);
			}
		}
	}
}

class SpecialBoxStrategy
{
	public boxType: BoxType;
	public minInterval: number;
	public maxInterval: number;
	public createLeftTime: number; 
	public health: number;

	public constructor(boxType: BoxType, minInterval: number, maxInterval: number, health: number)
	{
		this.boxType = boxType;
		this.minInterval = minInterval;
		this.maxInterval = maxInterval;
		this.health = health;
		this.ResetLeftTime();
	}

	public ResetLeftTime()
	{
		this.createLeftTime = Tools.RandomInterval(this.minInterval, this.maxInterval);
	}
}