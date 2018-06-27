class BallConfigModule extends ModuleBase implements IBallConfigModule
{
	private resModule: IResModule;
	private playerDataModule : IPlayerDataModule;

	private ballConfigList: any[];
	private totalBallCount: number;

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

		this.LoadCurBallConfig();
	}

	public LoadCurBallConfig()
	{
		this.curBallId = 2;
		this.curBallLevel = 1;

		this.curBallConfig = new BallConfig();
		this.curBallConfig.InitByConfig(this.GetBallJsonConfig(this.curBallId), this.curBallLevel);

		egret.log("<Ball> id = " + this.curBallConfig.id 
		+ ", level = " + this.curBallConfig.level 
		+ ", maxLevel = " + this.curBallConfig.maxLevel
		+ ", textureName = " + this.curBallConfig.textureName
		+ ", ballRadius = " + this.curBallConfig.ballRadius);
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