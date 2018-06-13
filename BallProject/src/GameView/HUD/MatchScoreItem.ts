class MatchScoreItem extends egret.DisplayObjectContainer
{
	private scoreText: egret.BitmapText;
	private stepText: egret.TextField;
	private curShowScore: number;
	private targetScore: number;
	private scoreIcon: egret.Bitmap;

	private lerpTime = 500;
	private deltaScore = 0;
	private minDeltaScorePreSecond = 30;

	public Init()
	{
		var stageWidth = GameMain.GetInstance().GetStageWidth();
		var stageHeight = GameMain.GetInstance().GetStageHeight();

		let adaptedStageWidth = GameMain.GetInstance().GetAdaptedStageWidth();
		let adaptedStageHeight = GameMain.GetInstance().GetAdaptedStageHeight();

		this.curShowScore = 0;
		this.targetScore = 0;

		var resModule = <IResModule> GameMain.GetInstance().GetModule(ModuleType.RES);
		//得分图标
		this.scoreIcon = resModule.CreateBitmapByName("pd_res_json.Defen");
		this.scoreIcon.x = 200;
		this.scoreIcon.y = 20;
		GameMain.GetInstance().AdapteDisplayObject(this.scoreIcon);
		this.addChild(this.scoreIcon);

		//得分数字
		this.scoreText = resModule.CreateBitmapText("font_num3_fnt");
		this.scoreText.x = 315;
		this.scoreText.y = 38;
		this.scoreText.width = 200;
		this.scoreText.height = 100;
		this.scoreText.scaleX = 0.8;
		this.scoreText.scaleY = 0.8;
		// this.scoreText.textColor = 0xffffff;
		// this.scoreText.fontFamily = "Impact";
		// this.scoreText.size = 40;
		this.scoreText.text = "0";
		GameMain.GetInstance().AdapteDisplayObject(this.scoreText);
		GameMain.GetInstance().AdapteDisplayObjectScale(this.scoreText);
		this.addChild(this.scoreText);

		if(DEBUG)
		{
			this.stepText = new egret.TextField();
			this.stepText.x = stageWidth/2 + 150;
			this.stepText.y = 70;
			this.stepText.width = 200;
			this.stepText.height = 100;
			this.stepText.textColor = 0xff0000;
			this.stepText.fontFamily = "Impact";
			this.stepText.size = 40;
			this.stepText.textAlign = "left";
			GameMain.GetInstance().AdaptTextField(this.stepText);
			this.addChild(this.stepText);
		}

		this.Reset();
	}

	public Update(deltaTime: number)
	{
		if (this.curShowScore < this.targetScore)
		{
			this.curShowScore += (deltaTime / 1000) * this.deltaScore;
			if (this.curShowScore > this.targetScore)
			{
				this.curShowScore = this.targetScore;
			}
			this.scoreText.text = Math.floor(this.curShowScore).toString();
		}
	}

	public SetScore(score: number)
	{
		this.targetScore = score;
		this.deltaScore = (this.targetScore - this.curShowScore) / (this.lerpTime / 1000);
		if (this.deltaScore < this.minDeltaScorePreSecond)
		{
			this.deltaScore = this.minDeltaScorePreSecond;
		}
	}

	public SetStep(step: number)
	{
		if(DEBUG)
			this.stepText.text = "Move:" + step.toString();
	}

	public Reset()
	{
		this.SetScore(0);
		this.SetStep(0);
	}
}