class GoldCoinBox extends SkillCricleBoxBase
{
	public GetBoxType(): BoxType
	{
		return BoxType.GoldCoin;
	}

	public GetSkillBitmapName(): string
	{
		return "Skill_GoldCoin";
	}
}