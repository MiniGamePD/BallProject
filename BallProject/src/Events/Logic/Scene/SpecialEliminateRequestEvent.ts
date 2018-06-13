class SpecialEliminateRequestEvent extends egret.Event
{
    public static EventName:string = "SpecialEliminateRequestEvent";
	public triggerElement: SceneElementBase;
    public targetPosList:number[];
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SpecialEliminateRequestEvent.EventName,bubbles,cancelable);           
    }
}