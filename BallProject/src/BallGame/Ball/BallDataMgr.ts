class BallDataMgr
{
	public ballConfig: BallConfig;

	public Init()
	{
		var ballConfigMdl = <IBallConfigModule> GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
		this.ballConfig  = ballConfigMdl.GetCurBallConfig();
	}

	public ChangeBall(ballId: number, level: number)
	{
		var ballConfigMdl = <IBallConfigModule> GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
		this.ballConfig = ballConfigMdl.GetBallConfig(ballId, level);
	}

	public GetBallEmitRadius()
	{
		if (this.ballConfig.skill_ScaleOnEmitter_Rate > 0 
			&& this.ballConfig.skill_ScaleOnEmitter_Scale > 0
			&& Math.random() <= this.ballConfig.skill_ScaleOnEmitter_Rate)
		{
			return this.ballConfig.ballRadius * this.ballConfig.skill_ScaleOnEmitter_Scale;
		}
		else
		{
			return this.ballConfig.ballRadius;
		}
	}

	public IsTriggerSkill_ScaleOnHit()
	{
		if (this.ballConfig.skill_ScaleOnHit_Rate > 0 
			&& this.ballConfig.skill_ScaleOnHit_Scale > 0
			&& Math.random() <= this.ballConfig.skill_ScaleOnHit_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public IsTriggerSkill_SplitBallOnHit()
	{
		if (this.ballConfig.skill_SplitBallOnHit_Rate > 0 
			&& this.ballConfig.skill_SplitBallOnHit_Count > 0
			&& Math.random() <= this.ballConfig.skill_SplitBallOnHit_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public IsTriggerSkill_CreateBallOnBoxEliminate()
	{
		if (this.ballConfig.skill_CreateBallOnBoxEliminate_Rate > 0 
			&& this.ballConfig.skill_CreateBallOnBoxEliminate_Count > 0
			&& Math.random() <= this.ballConfig.skill_CreateBallOnBoxEliminate_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public IsTriggerSkill_PauseBoxOnHit()
	{
		if (this.ballConfig.skill_PauseBoxOnHit_Rate > 0 
			&& this.ballConfig.skill_PauseBoxOnHit_Time > 0
			&& Math.random() <= this.ballConfig.skill_PauseBoxOnHit_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public IsTriggerSkill_BoomOnHit()
	{
		if (this.ballConfig.skill_BoomOnHit_Rate > 0 
			&& this.ballConfig.skill_BoomOnHit_Range > 0
			&& this.ballConfig.skill_BoomOnHit_Damage > 0
			&& Math.random() <= this.ballConfig.skill_BoomOnHit_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public IsTriggerSkill_CriticalStrike()
	{
		if (this.ballConfig.skill_CriticalStrike_Rate > 0 
			&& this.ballConfig.skill_CriticalStrike_Damage > 0
			&& Math.random() <= this.ballConfig.skill_CriticalStrike_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}