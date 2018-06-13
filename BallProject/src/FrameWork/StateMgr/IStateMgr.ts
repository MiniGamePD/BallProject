interface IStateMgr {
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
	 * 切到目标状态
	 * @returns 是否进行了切换
	 */
	SwitchGameState(toState: GameStateType): boolean;

	/**
	 * 获取当前游戏状态
	 */
	CurGameState(): GameStateType;
}

enum GameStateType
{
	None,
	Init,
	Lobby,
	Match,
	Result
}