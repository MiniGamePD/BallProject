class BallDataMgr
{
	public constructor()
	{
	}

	public ballConfig: BallConfig;

	// public skill_ScaleOnEmitter_Rate = 0; 		// 技能1：发射放大概率
	// public skill_ScaleOnEmitter_Scale = 2; 		// 技能1：发射放大倍数
	
	// public skill_ScaleOnHit_Rate = 0;			// 技能2：碰撞放大概率
	// public skill_ScaleOnHit_Scale = 1.5;			// 技能2：碰撞放大倍数
	// public skill_ScaleOnHit_BallRadius = 50;		// 技能2：碰撞放大最大半径

	// public skill_SplitBallOnHit_Rate = 0;		// 技能3：碰撞分裂概率
	// public skill_SplitBallOnHit_Count = 3;		// 技能3：碰撞分裂数量
	// public skill_SplitBallOnHit_Angle = 30;		// 技能3：碰撞分裂角度

	// public skill_CreateBallOnBoxEliminate_Rate = 0;	 	// 技能4：盒子消除分裂球概率
	// public skill_CreateBallOnBoxEliminate_Count = 10;	// 技能4：盒子消除分裂球数量

	// public skill_PauseBoxOnHit_Rate = 0;	 	// 技能5：打击盒子定身的概率
	// public skill_PauseBoxOnHit_Time = 1000;		// 技能5：打击盒子定身的时长

	// public Box_Effect_Pause_Time = 5000;		// 定时道具的持续时间
	// public Box_Effect_MultipleDirections_Time = 5000; // 变身道具的持续时间
	// public Box_Effect_FireUp_Time = 5000;		// 全力开火的持续时间

	public Init()
	{
		var ballConfigMdl = <IBallConfigModule> GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
		this.ballConfig  = ballConfigMdl.GetCurBallConfig();
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
}