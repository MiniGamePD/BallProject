class NpcElementCreator extends GameplayElementCreator
{
    public readonly randomVirusParams:InternalCreatorBase[];
    public readonly randomSuperVirusParams:InternalCreatorBase[];

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super(gameplayElementFactory);
        this.paramDic = [];
        this.paramDic.length = NpcElementCreateType.Count;

        this.randomVirusParams = [];
        this.randomVirusParams.push(new InternalCreator<Virus>(0, 2, GameElementColor.random, Virus));
        this.paramDic[NpcElementCreateType.RandomVirus] = this.randomVirusParams;

        this.randomSuperVirusParams = [];
        this.randomSuperVirusParams.push(new InternalCreator<SuperVirus>(0, 2, GameElementColor.random, SuperVirus));
        this.paramDic[NpcElementCreateType.RandomSuperVirus] = this.randomSuperVirusParams;
    }
}

enum NpcElementCreateType
{
    RandomVirus,
    RandomSuperVirus,
    Count,
}