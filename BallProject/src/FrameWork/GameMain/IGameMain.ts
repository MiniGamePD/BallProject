interface IGameMain {
	/**
	 * 获取
	 */
	GetCureGameState();

	/**
	 * 场景主舞台
	 */
	GetGameStage():egret.Stage;

	/**
	 * 获取模块
	 */
	GetModule(moduleType: ModuleType): IModule;

}