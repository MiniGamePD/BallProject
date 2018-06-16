class BoxCreateStrategy
{
	private boxEmitter: BoxEmitter;
	public emitInterval = 1000;
	public emitLeftTime = 0;

	private widthCount = 5;
	private heightCount = 8;

	private extraWidth = 0;
	private extraHeight = 0;

	public birthPoint: egret.Point[] = [];
	public specialBoxRandomBirthPosTemp = new egret.Point(0, 0);

	public specialBoxInterval = 5000;
	public specialBoxLeftTime = 0;

	public constructor()
	{
	}

	public Init(boxEmitter: BoxEmitter)
	{
		this.boxEmitter = boxEmitter;

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

		this.specialBoxLeftTime = Math.random() * this.specialBoxInterval; 
	}

	public Update(deltaTime: number)
	{
		this.emitLeftTime -= deltaTime;
		if (this.emitLeftTime < 0)
		{
			this.emitLeftTime = this.emitInterval;
			var randomBirthPos = this.GetRandomBirthPos();
			var randomBoxType = this.GetRandomBoxType();
			this.boxEmitter.EmitBox(randomBoxType, randomBirthPos, 12);
		}

		this.specialBoxLeftTime -= deltaTime;
		if (this.specialBoxLeftTime < 0)
		{
			this.specialBoxLeftTime = this.specialBoxInterval;
			var randomBirthPos = this.GetSpecialBoxRandomBirthPos();
			var randomBoxType = this.GetSpecialBoxRandomType();
			this.boxEmitter.EmitBox(randomBoxType, randomBirthPos, 10);
		}
	}

	public GetRandomBirthPos(): egret.Point
	{
		var ranIdx = Math.floor(Math.random() * this.birthPoint.length);
		return this.birthPoint[ranIdx];
	}

	public GetRandomBoxType(): BoxType
	{
		return Math.random() > 0.7 ? BoxType.Triangle : BoxType.Square;
	}

	public GetSpecialBoxRandomBirthPos()
	{
		this.specialBoxRandomBirthPosTemp.x = (Math.random() - 0.5) * GameMain.GetInstance().GetStageWidth() * SpecialBoxRandomBirthPos_Stage_Range;
		this.specialBoxRandomBirthPosTemp.y = (Math.random() - 0.5) * GameMain.GetInstance().GetStageWidth() * SpecialBoxRandomBirthPos_Stage_Range;
		this.specialBoxRandomBirthPosTemp.x += SpecialBoxRandomBirthPos_Center_Offset;
		this.specialBoxRandomBirthPosTemp.y += SpecialBoxRandomBirthPos_Center_Offset;
		return this.specialBoxRandomBirthPosTemp;
	}

	public GetSpecialBoxRandomType(): BoxType
	{
		var boxType;
		var ran = Math.random();
		if (ran < 0.25)
		{
			 boxType = BoxType.SixMulDir;
		}
		else if (ran < 0.5)
		{
			 boxType = BoxType.FireUp;
		}
		else if (ran < 0.75)
		{
			 boxType = BoxType.LevelUp;
		}
		else
		{
			 boxType = BoxType.GoldCoin;
		}
		return boxType;
	}
}
