class ControlableElementCreator extends GameplayElementCreator
{
    public readonly normalParams:InternalCreatorBase[];
    public readonly allRandomPillParams:InternalCreatorBase[];
    public readonly randomEliminateTool:InternalCreatorBase[];

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super(gameplayElementFactory);
        this.paramDic = [];
        this.paramDic.length = ControlableElementCreateType.Count;

        this.allRandomPillParams = [];
        this.allRandomPillParams.push(new InternalCreator<Pill>(0, 2, GameElementColor.random, Pill));
        this.paramDic[ControlableElementCreateType.AllRandomPill] = this.allRandomPillParams;

        this.normalParams = [];
        this.normalParams.push(new InternalCreator<Pill>(0, 0.96, GameElementColor.random, Pill));
        this.normalParams.push(new InternalCreator<Boom>(0.96, 0.97, GameElementColor.random, Boom));
        this.normalParams.push(new InternalCreator<RowEliminater>(0.97, 0.98, GameElementColor.random, RowEliminater));
        this.normalParams.push(new InternalCreator<ColumnEliminater>(0.98, 0.99, GameElementColor.random, ColumnEliminater));
        this.normalParams.push(new InternalCreator<CrossEliminater>(0.99, 1, GameElementColor.random, CrossEliminater));
        this.paramDic[ControlableElementCreateType.Normal] = this.normalParams;

        this.randomEliminateTool = [];
        this.randomEliminateTool.push(new InternalCreator<Boom>(0.0, 0.2, GameElementColor.random, Boom)); //20%
        this.randomEliminateTool.push(new InternalCreator<CrossEliminater>(0.2, 0.4, GameElementColor.random, CrossEliminater)); //20%
        this.randomEliminateTool.push(new InternalCreator<RowEliminater>(0.4, 0.7, GameElementColor.random, RowEliminater)); //30%
        this.randomEliminateTool.push(new InternalCreator<ColumnEliminater>(0.7, 1, GameElementColor.random, ColumnEliminater)); //30%
        this.paramDic[ControlableElementCreateType.RandomEliminateTool] = this.randomEliminateTool;
    }
}

enum ControlableElementCreateType
{
    AllRandomPill,
    Normal,
    RandomEliminateTool,
    Count,
}