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
					myBall.maxLevel = config.maxLevel;
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
		this.curBallConfig = this.GetBallConfig(this.curBallId, this.curBallLevel);

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

	// 拥有的球的数量
    public GetMyBallCount(): number
	{
		return this.myBallList.length;
	}

	// 是否拥有这个球, 返回null，代表没有这个球。
    public GetMyBallInfo(id: number): MyBallInfo
	{
		for (var i = 0; i < this.myBallList.length; ++i)
		{
			if (id == this.myBallList[i].id)
			{
				return this.myBallList[i];
			}
		}
		return null;
	}

	// 获取我的球的等级, 返回0，代码没有这个球。
    public GetMyBallLevel(id: number): number
	{
		var ballInfo = this.GetMyBallInfo(id);
		return ballInfo != null ? ballInfo.level : 0;
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

	public GetTotalBallCount(): number
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

	// 根据球的ID，返回配置
    public GetBallConfig(id: number, level: number): BallConfig
	{
		var jsonConfig = this.GetBallJsonConfig(id);
		if (jsonConfig != null && level > 0 && level <= jsonConfig.maxLevel)
		{
			var ballConfig = new BallConfig();
			ballConfig.InitByConfig(jsonConfig, level);
			return ballConfig;
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

	// 换球
    public ChangeSelectBall(id: number)
	{
		var level = this.GetMyBallLevel(id);
		if (level > 0)
		{
			this.curBallId = id;
			this.curBallLevel = level;
			this.LoadCurBallConfig();
			this.SaveMyBall();
		}
	}

	// 根据配置概率随机一个球的ID
	private RandomBallIdByProbability(): number
	{
		var ranBallId = 0;
		var totalProbability = 0;
		for (var i = 0; i < this.ballConfigList.length; ++i)
		{
			totalProbability += this.ballConfigList[i].probability;
		}
		var ranProbability = Math.random() * totalProbability;
		for (var i = 0; i < this.ballConfigList.length; ++i)
		{
			ranProbability -= this.ballConfigList[i].probability;
			if (ranProbability <= 0)
			{
				ranBallId = this.ballConfigList[i].id;
				break;
			}
		}
		return ranBallId;
	}

	// 抽取一个球
    public RandomBall(): RandomBallInfo
	{
		var newBall = new RandomBallInfo();
		newBall.id = this.RandomBallIdByProbability();
		var myBallInfo = this.GetMyBallInfo(newBall.id);
		if (myBallInfo != null)
		{
			if (myBallInfo.level < myBallInfo.maxLevel)
			{
				myBallInfo.level += 1;
				if (myBallInfo.id == this.curBallId)
				{
					this.curBallLevel += 1;
					this.curBallConfig = this.GetBallConfig(this.curBallId, this.curBallLevel)
				}
				newBall.level = myBallInfo.level;
				newBall.randomBallType = RandomBallType.NewLevel;
			}
			else
			{
				newBall.level = myBallInfo.maxLevel;
				newBall.randomBallType = RandomBallType.OldMaxLevelBall;
			}
		}
		else
		{
			newBall.level = 1;
			newBall.randomBallType = RandomBallType.NewBall;

			var config = this.GetBallConfig(newBall.id, 1)
			if (config != null)
			{
				var myBall = new MyBallInfo();
				myBall.id = config.id;
				myBall.level = 1;
				myBall.maxLevel = config.maxLevel;
				this.myBallList.push(myBall)
			}
		}
		this.SaveMyBall();
		return newBall;
	}
}

class MyBallInfo
{
	public id: number;
	public level: number;
	public maxLevel: number;
}


class RandomBallInfo
{
    public id: number;
    public level: number;
    public randomBallType: RandomBallType; // 全新的球
}

enum RandomBallType
{
	NewBall,
	NewLevel,
	OldMaxLevelBall,
}