class BallConfigModule extends ModuleBase implements IBallConfigModule
{
	private resModule: IResModule;
	private playerDataModule: IPlayerDataModule;

	private ballConfigList: any[];
	private totalBallCount: number;

	private myBallString: string;
	private myBallList: MyBallInfo[];

	private curBallId: number;
	private curBallLevel: number;
	private curBallConfig: BallConfig;

	private expBallList: number[] = [2, 3, 4, 11];//波，鸡，鸣，炸
	private expedBallList: number[];

	public Init(): boolean
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
		this.LoadExpedBall();
	}

	private LoadExpedBall()
	{
		this.expedBallList = [];
		var expedBallStr = this.playerDataModule.GetExpedBallList();
		if (expedBallStr != undefined && expedBallStr != null && expedBallStr != "")
		{
			var temp = expedBallStr.split("|");
			for (var i = 0; i < temp.length; ++i)
			{
				this.expedBallList.push(Number(temp[i]));
			}
		}
	}

	private SaveExpedBall()
	{
		var expedBallStr = "";
		for (var i = 0; i < this.expedBallList.length; ++i)
		{
			if (expedBallStr == "")
				expedBallStr += this.expedBallList[i];
			else
				expedBallStr += "|" + this.expedBallList[i];
		}

		this.playerDataModule.SetExpedBallList(expedBallStr);
		this.playerDataModule.Save();
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
		// this.myBallString = "12-1"; // 调试代码

		var ballList: string[] = this.myBallString.split('|');
		for (var i = 0; i < ballList.length; ++i)
		{
			var temp: string[] = ballList[i].split('-');
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
		if (DEBUG)
		{
			egret.log("<Ball> myBallCount= " + this.myBallList.length);
		}
	}

	private LoadCurBallConfig()
	{
		this.curBallConfig = this.GetBallConfig(this.curBallId, this.curBallLevel);

		if (DEBUG)
		{
			egret.log("<Ball> id = " + this.curBallConfig.id
				+ ", level = " + this.curBallConfig.level
				+ ", maxLevel = " + this.curBallConfig.maxLevel
				+ ", textureName = " + this.curBallConfig.textureName
				+ ", ballRadius = " + this.curBallConfig.ballRadius);
		}
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
		if (DEBUG)
		{
			egret.log("<SaveBall> oldStr= " + this.myBallString + ", newStr= " + ballListStr);
		}
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
		var ballProbability = this.GetBallProbability();
		var totalProbability = 0;
		for (var i = 0; i < this.ballConfigList.length; ++i)
		{
			totalProbability += ballProbability[i];
		}
		var ranProbability = Math.random() * totalProbability;
		for (var i = 0; i < this.ballConfigList.length; ++i)
		{
			ranProbability -= ballProbability[i];
			if (ranProbability <= 0)
			{
				ranBallId = this.ballConfigList[i].id;
				break;
			}
		}
		return ranBallId;
	}

	private GetBallProbability(): number[]
	{
		var ballProbability = [];
		if (this.IsNewPlayer())
		{
			for (var i = 0; i < this.ballConfigList.length; ++i)
			{
				ballProbability.push(this.ballConfigList[i].firstBallProbability);
			}
		}
		else
		{
			for (var i = 0; i < this.ballConfigList.length; ++i)
			{
				var level = this.GetMyBallLevel(this.ballConfigList[i].id);
				var p = Tools.GetConfigInList(this.ballConfigList[i].probability, level + 1, 0);
				ballProbability.push(p);
			}
		}
		return ballProbability;
	}

	// 抽取一个球
	public RandomBall(): RandomBallInfo
	{
		var randomBallId = this.RandomBallIdByProbability();
		return this.BuyOrUpgradeBall(randomBallId);
	}

	// 购买或者升级一个球
	public BuyOrUpgradeBall(ballId): RandomBallInfo
	{
		var newBall = new RandomBallInfo();
		newBall.id = ballId;
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

	public GetExpBall(): RandomBallInfo
	{
		var battleTimes = this.playerDataModule.GetBattleTimes();
		var isExpBattleTimes: boolean = battleTimes > 0 && (battleTimes == 3 || battleTimes % 10 == 0)

		if (isExpBattleTimes && this.expBallList.length > this.expedBallList.length)
		{
			//整理还有哪些球没有体验过
			var tobeExp: number[] = [];
			for (var i = 0; i < this.expBallList.length; ++i)
			{
				var id = this.expBallList[i];
				if (this.expedBallList.indexOf(id) < 0)
				{
					tobeExp.push(id);
				}
			}

			//随机一个
			if (tobeExp.length > 0)
			{
				var ranProbability = Math.floor(Math.random() * tobeExp.length);
				ranProbability = Math.min(ranProbability, tobeExp.length - 1);
				ranProbability = Math.max(ranProbability, 0);

				var tobeExpId = tobeExp[ranProbability];
				this.expedBallList.push(tobeExpId);
				this.SaveExpedBall();

				var expBall = new RandomBallInfo();
				expBall.id = tobeExpId;
				expBall.level = 3;
				expBall.randomBallType = RandomBallType.Experience;
				return expBall;
			}
		}
		return null;
	}

	public IsNewPlayer(): boolean
	{
		if (this.myBallList != null && this.myBallList != undefined && this.myBallList.length == 1)
		{
			//只有一个球
			var ballInfo: MyBallInfo = this.myBallList[0];
			if (ballInfo != null && ballInfo != undefined && ballInfo.level == 1)
			{
				return true;
			}
		}
		return false;
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
	Experience,
}