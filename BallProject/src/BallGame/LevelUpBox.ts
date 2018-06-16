class LevelUpBox extends SkillCricleBoxBase
{
	public GetBoxType(): BoxType
	{
		return BoxType.LevelUp;
	}

	public GetSkillBitmapName(): string
	{
		return "Skill_LvUp";
	}
}