class PauseBox extends SkillCricleBoxBase
{
	public GetBoxType(): BoxType
	{
		return BoxType.Pause;
	}

	public GetSkillBitmapName(): string
	{
		return "Skill_Pause";
	}
}