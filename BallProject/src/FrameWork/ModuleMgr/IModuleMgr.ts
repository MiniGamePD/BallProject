interface IModuleMgr {
	/**
	 * 初始化
	 */
	Init():void;

	/**
	 * 更新
	 */
	Update(deltaTime: number):void;

	/**
	 * 释放
	 */
	Release():void;

	/**
	 * 获取模块
	 */
	GetModule(moduleType: ModuleType): IModule;

	/**
	 * 游戏状态机更新
	 */
	OnGameStateChange(from: GameStateType, to: GameStateType):void;
}

enum ModuleType{
	RES = 0,
	LOADING,
	INPUT,
	SOUND,
	PROGRAM_ANIMATION,
	LOBBY,
	MATCH,
	PLAYER_DATA,
	BALL_CONFIG,
	NETWORK_CONFIG,
	MAX
}