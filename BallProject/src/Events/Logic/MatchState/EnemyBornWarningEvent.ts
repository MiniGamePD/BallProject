class EnemyBornWarningEvent extends egret.Event
{
    public static EventName:string = "EnemyBornWarningEvent";
    public enemyLine:number;
    public bornCountDown:number;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(EnemyBornWarningEvent.EventName,bubbles,cancelable);           
    }
}