class BoxEliminateEvent extends egret.Event 
{
	public static EventName: string = "BoxEliminateEvent";
    public boxType:BoxType;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
    {
		super(BoxEliminateEvent.EventName, bubbles, cancelable);
	}
}