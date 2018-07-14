class MatchScoreItem extends egret.DisplayObjectContainer
{
	private scoreText: egret.TextField;
	private historyHighScoreText: egret.TextField;
	private earnCoin:egret.TextField;

	private curShowScore: number;
	private targetScore: number;
	private curShowHistoryHighScore:number;
	private targetHistoryHighScore:number;

	private lerpTime = 500;
	private deltaScore = 0;
	private minDeltaScorePreSecond = 30;
	private deltaHistoryHighScore = 0;
	private minDeltaHistoryHighScorePreSecond = 30;

	private playerData:IPlayerDataModule;

	public Init()
	{
		this.curShowScore = 0;
		this.targetScore = 0;

		this.playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
		this.playerData.SetCurMatchScore(this.targetScore);
		
		//得分数字
		this.scoreText = new egret.TextField();
		this.scoreText.x = 320 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
		this.scoreText.y = 142;
		this.scoreText.width = 200;
		this.scoreText.height = 100;
		this.scoreText.size = 30;
		this.scoreText.text = "得分：0";
		this.scoreText.textAlign = "center";
		this.scoreText.anchorOffsetX = this.scoreText.width / 2;
		this.scoreText.anchorOffsetY = this.scoreText.height / 2;
		this.addChild(this.scoreText);

		//历史最高分数字
		this.historyHighScoreText = new egret.TextField();
		this.historyHighScoreText.x = 320 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
		this.historyHighScoreText.y = 107;
		this.historyHighScoreText.width = 200;
		this.historyHighScoreText.height = 100;
		this.historyHighScoreText.size = 30;
		this.historyHighScoreText.text = "纪录：0";
		this.historyHighScoreText.textAlign = "center";
		this.historyHighScoreText.anchorOffsetX = this.historyHighScoreText.width / 2;
		this.historyHighScoreText.anchorOffsetY = this.historyHighScoreText.height / 2;
		this.addChild(this.historyHighScoreText);

		//本局获得的分数
		this.earnCoin = new egret.TextField();
		this.earnCoin.x = 590 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
		this.earnCoin.y = 142;
		this.earnCoin.width = 200;
		this.earnCoin.height = 100;
		this.earnCoin.size = 30;
		this.earnCoin.text = "金币：0";
		this.earnCoin.textAlign = "right";
		this.earnCoin.anchorOffsetX = this.earnCoin.width;
		this.earnCoin.anchorOffsetY = this.earnCoin.height / 2;
		this.addChild(this.earnCoin);

		this.Reset();

		GameMain.GetInstance().AddEventListener(BoxEliminateEvent.EventName, this.OnBoxEliminateEvent, this);
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
			this.scoreText.text = "得分：" + Math.floor(this.curShowScore).toString();
		}
		
		if (this.curShowHistoryHighScore < this.targetHistoryHighScore)
		{
			this.curShowHistoryHighScore += (deltaTime / 1000) * this.deltaHistoryHighScore;
			if (this.curShowHistoryHighScore > this.targetHistoryHighScore)
			{
				this.curShowHistoryHighScore = this.targetHistoryHighScore;
			}
			this.historyHighScoreText.text = "纪录：" + Math.floor(this.curShowHistoryHighScore).toString();
		}
	}

	public SetScore(score: number)
	{
		this.targetScore = score;
		this.playerData.SetCurMatchScore(this.targetScore);

		if(this.targetScore > this.playerData.GetHistoryHighScore())
		{
			this.playerData.SetHistoryHighScore(this.targetScore);
			this.SetHistoryHighScore(this.targetScore);
		}	

		this.deltaScore = (this.targetScore - this.curShowScore) / (this.lerpTime / 1000);
		if (this.deltaScore < this.minDeltaScorePreSecond)
		{
			this.deltaScore = this.minDeltaScorePreSecond;
		}
	}

	public SetHistoryHighScore(score: number)
	{
		this.targetHistoryHighScore = score;
		this.deltaHistoryHighScore = (this.targetHistoryHighScore - this.curShowHistoryHighScore) / (this.lerpTime / 1000);
		if (this.deltaHistoryHighScore < this.minDeltaHistoryHighScorePreSecond)
		{
			this.deltaHistoryHighScore = this.minDeltaHistoryHighScorePreSecond;
		}
	}

	public Reset()
	{
		this.curShowScore = 0;
		this.SetScore(0);
		this.curShowHistoryHighScore = this.playerData.GetHistoryHighScore() - 1;
		this.SetHistoryHighScore(this.playerData.GetHistoryHighScore());
	}

	public AddScore(score: number)
	{
		var newScore = this.targetScore + score;
		this.SetScore(newScore);	
	}

	public RefreshCoin()
	{
		var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
		this.earnCoin.text = "金币：" + playerData.GetCoinCurGame();
	}

	private OnBoxEliminateEvent(evt: BoxEliminateEvent): void
	{
		// if (evt != null)
		// {
		// 	this.AddScore(ScorePerBox);
		// }
	}

	public Release()
	{
		GameMain.GetInstance().RemoveEventListener(BoxEliminateEvent.EventName, this.OnBoxEliminateEvent, this);
	}
}