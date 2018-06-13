//和gameplay相关的对象的封装，可能包含一个或多个SceneElement
abstract class GameplayElementBase
{
    public posx:number;
    public posy:number;
    public blockWidth:number = 1;
    public blockHeight:number = 1;

    protected sceneElements:SceneElementBase[] = [];
    private sceneElementFilled:boolean = false;

    protected hp:number; //生命值
    protected maxHp:number; //最大生命值
    protected shield:number; //护甲值
    protected hasReduceHpThisRound:boolean = false;

    public color:GameElementColor;

    public constructor()
    {
        GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateTurnFinish, this);
    }

    public GetSceneElements():SceneElementBase[]
    {
        if(!this.sceneElementFilled)
        {
            this.FillSceneElementArray();
            this.sceneElementFilled = true;
        }    

        return this.sceneElements;
    }

    protected abstract FillSceneElementArray();

    protected RandomColor(): GameElementColor 
    {
        return GameElementColorGenerator.RandomColor();    
    }

    public Update(deltaTime:number){}

    public PlayEliminateAnim(){}

    public OnEliminate():boolean
    {
        //一回合只受到一次伤害
        if(this.hasReduceHpThisRound)
        {
            return false;
        }

        this.hasReduceHpThisRound = true;
        if(this.shield > 0)
        {
            this.shield--;
            return true;
        }

        if(this.hp > 0)
        {
            this.hp--;
            
            if(!this.IsAlive())
            {
                GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateTurnFinish, this);
            }

            return true;
        }

        return false;
    }

    public IsAlive():boolean
    {
        return this.shield > 0 || this.hp > 0;
    }

    public GetRemainHpPercentage():number
    {
        return this.hp / this.maxHp;
    }

    public HasShield():boolean
    {
        return this.shield > 0;
    }

    public AddShield(shield:number)
    {
        this.shield += shield;
    }

    //一次大回合中的一个消除回合（多次连消算多个消除回合）
    public OnEliminateTurnFinish(event:EliminateEvent)
    {
        if(event.eliminateInfo.EliminateRound > 0)
            this.hasReduceHpThisRound = false;
    }

    public Kill()
    {
        this.hp = 0;
        this.shield = 0;
        GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateTurnFinish, this);
    }
}
