class PlayerDataModule extends ModuleBase implements IPlayerDataModule
{
    private historyHighScore:number;
    private coin:number;
    private curMatchScore:number = 0; //当前比赛分数
    private myBallList: string;
    private coinCurGame:number;

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

    public AddCoin(coin:number)
    {
        if(coin > 300)
        {
            if(DEBUG)
                console.log("一次性添加" + coin + "金币，作弊了吗？限制在最大金币范围内");
            coin = 300;
        }

        this.coin += coin;
        this.coinCurGame += coin;
    }

    public CostCoin(coin:number):boolean
    {
        // if(this.coin >= coin)
        // {
        //     this.coin -= coin;
        //     if(DEBUG)
        //         console.log("消耗了" + coin + "金币");
        //     return true;
        // }
        // return false;
        return true;
    }

    public GetCoin():number
    {
        return this.coin;
    }

    public GetCoinCurGame():number
    {
        return this.coinCurGame;
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
        let jsonData = 
        {  
            version:1,
            historyHighScore:this.historyHighScore , 
            coin:this.coin,
        } 
        var jsonDataStr:string = JSON.stringify(jsonData);
        GameMain.GetInstance().SaveUserData(jsonDataStr);
    }

    public Load()
    {
        var userData = GameMain.GetInstance().LoadUserData();
        if(userData != null && userData != undefined)
        {
            try
            {
                //蛋总，如果新增需要保存的内容，一定要注意兼容老版本的saveData
                var jsonObj = JSON.parse(userData);
                this.historyHighScore = jsonObj.historyHighScore;
                this.coin = jsonObj.coin;
            }
            catch(e)
            {
                //兼容老版本的saveData
                if(DEBUG)
                    console.log(e);
                var temp:string[] = userData.split(',');
                this.historyHighScore = Number(temp[0]);
                this.coin = Number(temp[1]);
                this.Save();//存成新版本的数据格式
            }
        }
        else
        {
            //蛋总，这里要注意初始化玩家的数据
            this.historyHighScore = 0;
            this.coin = 0;
        }
    }

    public OnMatchBegin()
    {
        this.coinCurGame = 0;
    }
}