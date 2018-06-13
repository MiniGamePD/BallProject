class GameModuleComponentBase extends egret.EventDispatcher
{
    protected isWorking:boolean = false;

    public Work(param?:any):any
    {
        this.isWorking = true;
    }

    public Sleep()
    {
        this.isWorking = false;
    }

    public Update(deltaTime:number)
    {
        if(this.isWorking)
		{
            this.UpdateInternal(deltaTime);
        }
    }

    protected UpdateInternal(deltaTime:number)
    {
    }
}

class GameplayControlWorkParam
{
    public difficulty:number;
    public turn:number;
}