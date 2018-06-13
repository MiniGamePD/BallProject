class InputEvent extends egret.Event
{
    public static EventName:string = "InputEvent";
    public Key: InputKey;
	public StageX: number;
	public StageY: number;
    public constructor(inputkey: InputKey, stageX: number, stageY: number, bubbles:boolean=false, cancelable:boolean=false)
    {
        super(InputEvent.EventName,bubbles,cancelable);
        this.Key = inputkey;
		this.StageX = stageX;
		this.StageY = stageY;
    }
}
