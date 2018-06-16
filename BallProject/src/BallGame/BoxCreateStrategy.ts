class BoxCreateStrategy
{
	private widthCount = 5;
	private heightCount = 8;

	private extraWidth = 0;
	private extraHeight = 0;

	public birthPoint: egret.Point[] = [];
	
	public constructor()
	{
	}

	public Init()
	{
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
}
