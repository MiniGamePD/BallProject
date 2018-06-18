class MatchScoreItem extends egret.DisplayObjectContainer
{
	private scoreText: egret.TextField;
	private historyHighScoreText: egret.TextField;

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

		//得分数字
		this.scoreText = new egret.TextField();
		this.scoreText.x = 220;
		this.scoreText.y = 70;
		this.scoreText.width = 200;
		this.scoreText.height = 100;
		this.scoreText.size = 30;
		this.scoreText.text = "得分：0";
		this.scoreText.textAlign = "center";
		this.addChild(this.scoreText);

		//历史最高分数字
		this.historyHighScoreText = new egret.TextField();
		this.historyHighScoreText.x = 220;
		this.historyHighScoreText.y = 30;
		this.historyHighScoreText.width = 200;
		this.historyHighScoreText.height = 100;
		this.historyHighScoreText.size = 30;
		this.historyHighScoreText.text = "纪录：0";
		this.historyHighScoreText.textAlign = "center";
		this.addChild(this.historyHighScoreText);

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

	private AddScore(score: number)
	{
		var newScore = this.targetScore + score;
		if(newScore > this.playerData.GetHistoryHighScore())
		{
			this.playerData.SetHistoryHighScore(newScore);
			this.SetHistoryHighScore(newScore);
		}	

		this.SetScore(newScore);	
	}

	private OnBoxEliminateEvent(evt: BoxEliminateEvent): void
	{
		if (evt != null)
		{
			this.AddScore(ScorePerBox);
		}
	}

	public Release()
	{
		GameMain.GetInstance().RemoveEventListener(BoxEliminateEvent.EventName, this.OnBoxEliminateEvent, this);
	}
}