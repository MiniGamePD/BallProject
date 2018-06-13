class StateMgr implements IStateMgr
{
	// 当前状态
	private mCurState: GameStateType;

	public Init():void
	{
		this.mCurState = GameStateType.None;
	}

	public Update(deltaTime: number):void
	{

	}

	public Release():void
	{
		
	}

	public SwitchGameState(toState: GameStateType): boolean 
	{
		if (this.mCurState != toState) 
		{
			this.mCurState = toState;
			return true;
		}
		return false;
	}

	public CurGameState(): GameStateType 
	{
		return this.mCurState;
	}
}