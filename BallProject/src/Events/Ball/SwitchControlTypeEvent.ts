class SwitchControlTypeEvent extends egret.Event 
{
	public static EventName: string = "SwitchControlTypeEvent";
    public newControlType:BallControllerType;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
	{
		super(SwitchControlTypeEvent.EventName, bubbles, cancelable);
	}
}