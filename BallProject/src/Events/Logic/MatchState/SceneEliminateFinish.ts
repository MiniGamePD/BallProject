class SceneEliminateFinishEvent extends egret.Event
{
    public static EventName:string = "SceneEliminateFinishEvent";    
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneEliminateFinishEvent.EventName,bubbles,cancelable);           
    }
}