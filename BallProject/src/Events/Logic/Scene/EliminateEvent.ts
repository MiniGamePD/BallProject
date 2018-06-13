class EliminateEvent  extends egret.Event
{
	public static EventName: string = "EliminateEvent";
	public eliminateInfo: EliminateInfo;

	public constructor(bubbles: boolean = false, cancelable: boolean = false)
	{
		super(EliminateEvent.EventName, bubbles, cancelable);
	}
}
