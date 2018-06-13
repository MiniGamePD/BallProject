class SceneElementControlFailedEvent extends egret.Event
{
    public static EventName:string = "SceneElementControlFailedEvent";
    public controlType:SceneElementControlType;
    public moveDir:Direction;
    public moveStep:number;
    public playerControl:boolean;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementControlFailedEvent.EventName,bubbles,cancelable);           
    }
}