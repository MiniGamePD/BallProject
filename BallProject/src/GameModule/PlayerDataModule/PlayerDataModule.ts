class PlayerDataModule extends ModuleBase implements IPlayerDataModule
{
    private historyHighScore:number;
    private coin:number;
    private curMatchScore:number = 0; //当前比赛分数
    private myBallList: string;

    private breakRecordHistoryHighScore:boolean;

    public Init():boolean
    {
        super.Init();

        this.breakRecordHistoryHighScore = false;

        return true;
    }

	public GetMyBall(): string
    {
        this.myBallList = "5-3|1-1|2-1|3-2"
        return this.myBallList;
    }

    public SaveMyBall(ballListString: string)
    {
        this.myBallList = ballListString;
    }

    public SetHistoryHighScore(score:number)
    {
        if(this.historyHighScore < score)
        {
            this.historyHighScore = score;
            this.breakRecordHistoryHighScore = true;
        }    
    }

    public GetHistoryHighScore():number
    {
        return this.historyHighScore;
    }

    public UploadHistoryHighScore()
    {
        if(this.breakRecordHistoryHighScore)
        {
            this.breakRecordHistoryHighScore = false;
            platform.setUserCloudStorage("HighScore", this.historyHighScore.toString());
        }
    }

    public SetCoin(coin:number)
    {
        this.coin = coin;
    }

    public GetCoin():number
    {
        return this.coin;
    }

    public SetCurMatchScore(score:number)
    {
        this.curMatchScore = score;
    }

    public GetCurMatchScore()
    {
        return this.curMatchScore;
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
		this.isForeground = true;
	}

    public InitUserData()
    {
        if(GameMain.GetInstance().HasUserData())
        {
            //有就加载
            this.Load();
        }
        else
        {
            //没有就新建一个
            this.coin = 0;
            this.historyHighScore = 0;
            this.Save();
        }
    }

    public Save()
    {
        var userData:string = this.historyHighScore + "," + this.coin;
        GameMain.GetInstance().SaveUserData(userData);
    }

    public Load()
    {
        var userData = GameMain.GetInstance().LoadUserData();
        if(userData != null && userData != undefined)
        {
            var temp:string[] = userData.split(',');
            this.historyHighScore = Number(temp[0]);
            this.coin = Number(temp[1]);
        }
        else
        {
            this.historyHighScore = 0;
            this.coin = 0;
        }
    }
}