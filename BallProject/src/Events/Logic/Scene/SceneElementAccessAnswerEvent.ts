class SceneElementAccessAnswerEvent extends egret.Event
{
    public static EventName:string = "SceneElementAccessAnswerEvent";
    public accessType:SceneElementType;
    public answerType:SceneElementAccessAnswerType;
    public queryAnswerArray:any;//返回查询结果
    public accesser:egret.EventDispatcher;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementAccessAnswerEvent.EventName,bubbles,cancelable);           
    }
}
