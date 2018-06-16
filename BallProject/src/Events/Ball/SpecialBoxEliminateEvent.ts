class SpecialBoxEliminateEvent extends egret.Event 
{
	public static EventName: string = "SpecialBoxEliminateEvent";
    public boxType:BoxType;
    public param:any;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
    {
		super(SpecialBoxEliminateEvent.EventName, bubbles, cancelable);
	}
}