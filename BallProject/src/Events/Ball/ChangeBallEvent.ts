class ChangeBallEvent extends egret.Event 
{
	public static EventName: string = "ChangeBallEvent";
    public ballId:number;
	public ballLevel:number;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
	{
		super(ChangeBallEvent.EventName, bubbles, cancelable);
	}
}