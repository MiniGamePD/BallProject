class BallConfigModule extends ModuleBase implements IBallConfigModule
{
	private resModule: IResModule;
	private playerDataModule : IPlayerDataModule;

	private ballConfigList: any[];
	private totalBallCount: number;

	private myBallString: string;
	private myBallList: MyBallInfo[];

	private curBallId: number;
	private curBallLevel: number;
	private curBallConfig: BallConfig;

	public Init():boolean
	{
		super.Init();

		return true;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
		this.isForeground = true;
	}

	public LoadBallConfig()
	{
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);

		this.LoadBallJsonConfig();
		this.LoadMyBall();
		this.LoadCurBallConfig();
	}

	private LoadBallJsonConfig()
	{
		this.ballConfigList = [];
		var id = 1;
		while (true)
		{
			var jsonFileName = "BallConfig_" + id + "_json";
			var config = this.resModule.GetRes(jsonFileName);
			if (config)
			{
				this.ballConfigList.push(config);
				++id;
			}
			else
			{
				break;
			}
		}

		this.totalBallCount = this.ballConfigList.length;
	}

	private LoadMyBall()
	{
		this.myBallList = [];
		this.myBallString = this.playerDataModule.GetMyBall();
		if (this.myBallString == undefined
			|| this.myBallString == null
			|| this.myBallString == "")
		{
			this.myBallString = "1-1"; // 初始球
		}

		var ballList:string[] = this.myBallString.split('|');
		for (var i = 0; i < ballList.length; ++i)
		{
			var temp:string[] = ballList[i].split('-');
			if (temp.length == 2)
			{
				var id = Number(temp[0]);
				var level = Number(temp[1]);
				var config = this.GetBallJsonConfig(id)
				if (id > 0 && level > 0 && config != null)
				{
					var myBall = new MyBallInfo();
					myBall.id = id;
					myBall.level = level;
					myBall.maxLevel = config;
					this.myBallList.push(myBall)
				}
			}
		}

		this.curBallId = this.myBallList[0].id;
		this.curBallLevel = this.myBallList[0].level;

		egret.log("<Ball> myBallCount= " + this.myBallList.length);
	}

	private LoadCurBallConfig()
	{
		this.curBallConfig = new BallConfig();
		this.curBallConfig.InitByConfig(this.GetBallJsonConfig(this.curBallId), this.curBallLevel);

		egret.log("<Ball> id = " + this.curBallConfig.id 
		+ ", level = " + this.curBallConfig.level 
		+ ", maxLevel = " + this.curBallConfig.maxLevel
		+ ", textureName = " + this.curBallConfig.textureName
		+ ", ballRadius = " + this.curBallConfig.ballRadius);
	}

	public GetMyBallList()
	{
		return this.myBallList;
	}

	public SaveMyBall()
	{
		var ballListStr = this.curBallId + "-" + this.curBallLevel;
		for (var i = 0; i < this.myBallList.length; ++i)
		{
			if (this.myBallList[i].id != this.curBallId)
			{
				ballListStr += "|" + this.myBallList[i].id + "-" + this.myBallList[i].level;
			}
		}
		egret.log("<SaveBall> oldStr= " + this.myBallString + ", newStr= " + ballListStr);
		this.myBallString = ballListStr;
		this.playerDataModule.SaveMyBall(this.myBallString);
	}

	public GetTotalBallCount()
	{
		return this.ballConfigList.length;
	}

	private GetBallJsonConfig(id: number)
	{
		if (id > 0 && id <= this.ballConfigList.length)
		{
			return this.ballConfigList[id - 1];
		}
		else
		{
			return null;
		}
	}

	public GetCurBallConfig(): BallConfig
	{
		return this.curBallConfig;
	}
}

class MyBallInfo
{
	public id: number;
	public level: number;
	public maxLevel: number;
}