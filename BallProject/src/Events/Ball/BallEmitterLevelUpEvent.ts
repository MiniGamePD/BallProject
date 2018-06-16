class BallEmitterLevelUpEvent extends egret.Event 
{
	public static EventName: string = "BallEmitterLevelUpEvent";
    public curLevel: number;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
    {
		super(BallEmitterLevelUpEvent.EventName, bubbles, cancelable);
	}
}