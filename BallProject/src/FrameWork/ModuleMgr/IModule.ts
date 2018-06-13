interface IModule
{
	/**
	 * 初始化
	 */
	Init():boolean;

	/**
	 * 更新
	 */
	Update(deltaTime: number):void;

	/**
	 * 释放
	 */
	Release():void;

	/**
	 * 游戏状态机更新
	 */
	SwitchToForeground(from: GameStateType, to: GameStateType):void;
	SwitchToBackground(from: GameStateType, to: GameStateType):void;

	/**
	 * 切换前台/后台
	 */
	SwitchForeOrBack(from: GameStateType, to: GameStateType):void;

	/**
	 * 获取前台/后台
	 */
	IsForeground():boolean;
}