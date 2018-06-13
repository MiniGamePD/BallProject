class SceneElementMoveUpEvent extends egret.Event
{
    public static EventName:string = "SceneElementMoveUpEvent";  
	
	public isMoveSuccess: boolean = true;
	public moveUpValue: number = 0;

    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementMoveUpEvent.EventName,bubbles,cancelable);  
		this.isMoveSuccess = true;
		this.moveUpValue = 0;
    }
}