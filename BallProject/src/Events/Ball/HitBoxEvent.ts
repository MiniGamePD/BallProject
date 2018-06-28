class HitBoxEvent extends egret.Event 
{
	public static EventName: string = "HitBoxEvent";
	public box: Box;
	public ballPhyBody: p2.Body;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
	{
		super(HitBoxEvent.EventName, bubbles, cancelable);
	}
}