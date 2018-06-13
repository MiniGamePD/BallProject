abstract class NpcElement extends GameplayElementBase
{
    public bornType:NpcBornType;
    protected bornSound:string;

    public MoveTo(posx:number, posy:number){}

    public PlayAnim(animTYpe:NpcAnimType){}

    public PlaySound(soundType:NpcSoundType)
    {
        if(soundType == NpcSoundType.Born)
        {
            this.PlaySoundInternal(this.bornSound);
        }
    }

    private PlaySoundInternal(soundName:string)
    {
		let event = new PlaySoundEvent(soundName, 1);
        GameMain.GetInstance().DispatchEvent(event);
    }

    public SkillType():NpcSkillType
    {
        return NpcSkillType.None;
    }
}

enum NpcBornType
{
    Normal, //普通出生方式，寻找一个足够大的空位出生
    DestroyObstruction, //霸道的出生方式，销毁即将出生位置的所有东西后出生
}

enum NpcAnimType
{
    Born,
    Idel,
    UseSkill,
}

enum NpcSoundType
{
    Born,
}

enum NpcSkillType
{
    None,
    AddShieldForVirus,
    ChangePillToVirus,
    ChangeVirusColor
}