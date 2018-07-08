class ModuleMgr implements IModuleMgr 
{
	//模块列表
	private mModuleList: IModule[];

	//模块数量
	private mModuleCount: number;

	public Init(): void 
	{
		this.CreateModule();
		this.InitModule();
	}

	private CreateModule() 
	{
		this.mModuleList = [];
		this.mModuleList.push(new ResModule);		
		this.mModuleList.push(new LoadingModule);
		this.mModuleList.push(new InputModule);
		this.mModuleList.push(new SoundModule);
		this.mModuleList.push(new ProgrameAnimationModule);
		this.mModuleList.push(new LobbyModule);
		this.mModuleList.push(new BallMatchModule);
		this.mModuleList.push(new PlayerDataModule);
		this.mModuleList.push(new BallConfigModule);
		this.mModuleList.push(new NetworkConfigModule);

		this.mModuleCount = this.mModuleList.length;
	}

	private InitModule()
	{
		for (var i = 0; i < this.mModuleCount; ++i)
		{
			this.mModuleList[i].Init();
		}
	}

	public Update(deltaTime: number): void 
	{
		for (var i = 0; i < this.mModuleCount; ++i) 
		{
			if(this.mModuleList[i].IsForeground())
				this.mModuleList[i].Update(deltaTime);
		}
	}

	public Release(): void 
	{
		for (var i = 0; i < this.mModuleCount; ++i) 
		{
			this.mModuleList[i].Release();
		}
	}

	public GetModule(moduleType: ModuleType): IModule 
	{
		return this.mModuleList[moduleType];
	}

	public OnGameStateChange(from: GameStateType, to: GameStateType): void 
	{
		for (var i = 0; i < this.mModuleCount; ++i)
		{
			let iModule = this.mModuleList[i];
			let lastForegroundStat = iModule.IsForeground();
			iModule.SwitchForeOrBack(from, to);
			if(lastForegroundStat != iModule.IsForeground())
			{
				if(lastForegroundStat)
				{
					iModule.SwitchToBackground(from, to);
				}
				else
				{
					iModule.SwitchToForeground(from, to);
				}
			}
		}
	}
}