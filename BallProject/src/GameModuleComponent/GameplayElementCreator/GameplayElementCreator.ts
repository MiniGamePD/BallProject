abstract class GameplayElementCreator
{
    private gameplayElementFactory:GameplayElementFactory;
    protected paramDic:InternalCreatorBase[][];

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        this.gameplayElementFactory = gameplayElementFactory;
    }

    public CreateElement(param:CreatorWorkParam):any
    {
        let paramIndex:number = param.paramIndex;
        let createParams = this.paramDic[paramIndex];

        let element:GameplayElementBase = null;
		let random = Math.random();
        for(var i = 0; i < createParams.length; ++i)
        {
            let internalCreator:InternalCreatorBase = createParams[i];
            if(internalCreator.ProbabilityMatch(random))
            {
                if(param.createNum == 1)
                {
                    return internalCreator.CreateElement(this.gameplayElementFactory);
                }
                else
                {
                    let result:GameplayElementBase[] = [];
                    for(var i = 0; i < param.createNum; ++i)
                    {
                        result.push(internalCreator.CreateElement(this.gameplayElementFactory));
                    }
                    return result;
                }
            }
        }

		console.error("Can't Create GameplayElement for " + param.paramIndex);
    }
}

class CreatorWorkParam
{
    public paramIndex:number;
    public createNum:number;
}

interface InternalCreatorBase
{
    ProbabilityMatch(randomNum:number):boolean;
    CreateElement(gameplayElementFactory:GameplayElementFactory):GameplayElementBase;
}

class InternalCreator<T extends GameplayElementBase> implements InternalCreatorBase
{
    private objConstructor:{new(): T; };
    public probabilityBegin:number;
    public probabilityEnd:number;
    public elementColor:GameElementColor;
    //add more..

    public constructor(probabilityBegin:number, probabilityEnd:number, elementColor:GameElementColor, c:{new(): T; })
    {
        this.probabilityBegin = probabilityBegin;
        this.probabilityEnd = probabilityEnd;
        this.elementColor = elementColor;
        this.objConstructor = c;
    }

    public ProbabilityMatch(randomNum:number):boolean
    {
        return (randomNum >= this.probabilityBegin && randomNum < this.probabilityEnd);
    }

    public CreateElement(gameplayElementFactory:GameplayElementFactory):GameplayElementBase
    {
        return gameplayElementFactory.CreateGameplayElement(this.objConstructor);
    }
}