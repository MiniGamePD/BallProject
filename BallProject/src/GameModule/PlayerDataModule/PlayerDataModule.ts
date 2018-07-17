class PlayerDataModule extends ModuleBase implements IPlayerDataModule
{
    private historyHighScore:number;
    private coin:number;
    private curMatchScore:number = 0; //当前比赛分数
    private myBallList:string;
    private expedBallList:string;
    private coinCurGame:number;
    private controlType:BallControllerType;
    private battleTimes:number;

    private saveDataVersion:number = 3; //常量值，请勿修改

    private breakRecordHistoryHighScore:boolean;

    private m_tLastLoginTime: number; //上一次登录时间

    private m_tTodayLotteryShareCnt: number ;// 当天抽奖分享次数

    //private static m_stTodayLotteryShareCntLimit 
    public OnLoginDone():void
    {
        if(CTimeHelper.IsNewDay(this.m_tLastLoginTime))
        {
            this.OnResetToday();
        }

        this.m_tLastLoginTime = CTimeHelper.Now();

        this.Save();
        return;
    }

    public  GetTodayLeftLotteryShowTipCnt():number
    {

        var networkConfigModule = <INetworkConfigModule>GameMain.GetInstance().GetModule(ModuleType.NETWORK_CONFIG);
        var networkConfig = networkConfigModule.GetNetWorkConfig();
        var Static_Limit = networkConfig.m_LotteryShareShowTipLimit;

        if(Static_Limit > this.m_tTodayLotteryShareCnt)
        {
            return Static_Limit - this.m_tTodayLotteryShareCnt;
        }

        return 0;
    }

    public IncreaseLotteryShowTipCnt() : void
    {
        this.m_tTodayLotteryShareCnt ++;
        this.Save();
        return;
    }

    public CanShowLotteryTips() : boolean
    {
        var networkConfigModule = <INetworkConfigModule>GameMain.GetInstance().GetModule(ModuleType.NETWORK_CONFIG);
        var networkConfig = networkConfigModule.GetNetWorkConfig();
        var Static_Limit = networkConfig.m_LotteryShareShowTipLimit;
        return networkConfig.EnableShare && this.m_tTodayLotteryShareCnt < Static_Limit; 
    } 

    private OnResetToday(): void
    {
        this.m_tTodayLotteryShareCnt = 0;
        return;
    }

    public Init():boolean
    {
        super.Init();

        this.breakRecordHistoryHighScore = false;


        return true;
    }

	public GetMyBall(): string
    {
        // this.myBallList = "5-3|1-1|2-1|3-2"
        return this.myBallList;
    }

    public SaveMyBall(ballListString: string)
    {
        this.myBallList = ballListString;
        this.Save();
    }

    public GetExpedBallList():string
    {
        return this.expedBallList;
    }

    public SetExpedBallList(list:string)
    {
        this.expedBallList = list;
    }

    public GetBattleTimes():number
    {
        return this.battleTimes;
    }

    public SetBattleTimes(times:number)
    {
        this.battleTimes = times;
        if(DEBUG)
            console.log("Set Battle Times:" + this.battleTimes);
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
            if(platform.canUseCloudStorage())
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
        if(this.coin >= coin)
        {
            this.coin -= coin;
            if(DEBUG)
                console.log("消耗了" + coin + "金币");
            return true;
        }
        return false;
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

    public SetControlType(type:BallControllerType)
    {
        this.controlType = type;
    }
    
    public GetControlType():BallControllerType
    {
        return this.controlType;
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

            //做个搂底，防止saveData损坏
            if(this.coin == undefined)
                this.coin = 0;
            if(this.historyHighScore == undefined)
                this.historyHighScore = 0;
            if(this.myBallList == undefined)
                this.myBallList = "1-1";
            if(this.expedBallList == undefined)
                this.expedBallList = "";
            if(this.controlType == undefined)
                this.controlType = BallControllerType.TouchPoint;
            if(this.battleTimes == undefined)
                this.battleTimes = 0;

            if(this.m_tLastLoginTime == undefined)
            {
                this.m_tLastLoginTime = 0;
            }

            if(this.m_tTodayLotteryShareCnt == undefined)
            {
                this.m_tTodayLotteryShareCnt = 0;
            }
        }
        else
        {
            //蛋总，这里是创建新的saveData的地方，新增的数据，一定要在这里初始化
            //没有就新建一个
            this.coin = 0;
            this.historyHighScore = 0;
            this.myBallList = "1-1";
            this.expedBallList = "";
            this.controlType = BallControllerType.TouchPoint;
            this.battleTimes = 0;
            this.m_tLastLoginTime = 0;
            this.m_tTodayLotteryShareCnt = 0;
            this.Save();
        }
    }

    public Save()
    {
        let jsonData = 
        {  
            version:this.saveDataVersion, //版本2，新增玩家操作模式的存档
            historyHighScore:this.historyHighScore , 
            coin:this.coin,
            myBallList:this.myBallList,
            controlType:this.controlType,
            expedBallList:this.expedBallList,
            battleTimes:this.battleTimes,
            LastLoginTime:this.m_tLastLoginTime,
            TodayLotteryShareCnt:this.m_tTodayLotteryShareCnt

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
                if(jsonObj.version == 1)
                {
                    //注意：如果新增了saveData的内容，需要在这里添加兼容
                    this.historyHighScore = jsonObj.historyHighScore;
                    this.coin = jsonObj.coin;
                    this.myBallList = jsonObj.myBallList;
                    this.expedBallList = "";
                    this.battleTimes = 0;
                    this.controlType = BallControllerType.TouchPoint;
                    this.m_tLastLoginTime = 0;//jsonObj.LastLoginTime;
                    this.m_tTodayLotteryShareCnt = 0;//jsonObj.TodayLotteryShareCnt;
                    this.Save();
                }
                else if(jsonObj.version == 2)
                {
                    //注意：如果新增了saveData的内容，需要在这里添加兼容
                    this.historyHighScore = jsonObj.historyHighScore;
                    this.coin = jsonObj.coin;
                    this.myBallList = jsonObj.myBallList;
                    this.controlType = jsonObj.controlType;
                    this.expedBallList = jsonObj.expedBallList;
                    this.battleTimes = jsonObj.battleTimes;
                    this.m_tLastLoginTime = 0;//jsonObj.LastLoginTime;
                    this.m_tTodayLotteryShareCnt = 0;//jsonObj.TodayLotteryShareCnt;
                    this.Save();
                }
                else if(jsonObj.version == 3)
                {
                    this.historyHighScore = jsonObj.historyHighScore;
                    this.coin = jsonObj.coin;
                    this.myBallList = jsonObj.myBallList;
                    this.controlType = jsonObj.controlType;
                    this.expedBallList = jsonObj.expedBallList;
                    this.battleTimes = jsonObj.battleTimes;
                    this.m_tLastLoginTime = jsonObj.LastLoginTime;//jsonObj.LastLoginTime;
                    this.m_tTodayLotteryShareCnt = jsonObj.TodayLotteryShareCnt;//
                    this.Save();      
                }
            }
            catch(e)
            {
                //这里是兼容最老版本的saveData
                if(DEBUG)
                    console.log(e);
                var temp:string[] = userData.split(',');
                this.historyHighScore = Number(temp[0]);
                this.coin = Number(temp[1]);
                this.myBallList = "1-1";
                this.expedBallList = "";
                this.controlType = BallControllerType.TouchPoint;
                this.battleTimes = 0;
                this.m_tLastLoginTime = 0;
                this.m_tTodayLotteryShareCnt = 0;
                this.Save();//存成新版本的数据格式
            }
        }
        else
        {
            //这里是没有saveData的时候，初始化数据的地方
            //蛋总，这里要注意初始化玩家的数据
            this.historyHighScore = 0;
            this.coin = 0;
            this.myBallList = "1-1";
            this.expedBallList = "";
            this.battleTimes = 0;
            this.controlType = BallControllerType.TouchPoint;
            this.m_tLastLoginTime = 0;
            this.m_tTodayLotteryShareCnt =0;
        }
        this.OnLoginDone();
    }

    public OnMatchBegin()
    {
        this.coinCurGame = 0;
    }
}