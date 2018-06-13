abstract class ModuleBase extends egret.EventDispatcher
{	
	protected isForeground:boolean = false;	

	public Init():boolean{return true}

	public Update(deltaTime: number):void{}

	public Release():void{}

	public SwitchToForeground(from: GameStateType, to: GameStateType):void{}
	public SwitchToBackground(from: GameStateType, to: GameStateType):void{}

	abstract SwitchForeOrBack(from: GameStateType, to: GameStateType):void;

	public IsForeground():boolean{return this.isForeground}
}