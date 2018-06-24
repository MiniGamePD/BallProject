class BallDataMgr
{
	public constructor()
	{
	}
	
	public ballTextureName: string = "Ball_White";
	public emitSpeed: number = 1000; 	//球速
	public ballMass: number = 1;		//球的质量
	public ballRadius: number = 15;		//球的半径

	public skill_ScaleOnEmitter_Rate = 0; 		// 技能1：发射放大概率
	public skill_ScaleOnEmitter_Scale = 0; 		// 技能1：发射放大倍数
	
	public skill_ScaleOnHit_Rate = 0;			// 技能2：碰撞放大概率
	public skill_ScaleOnHit_Scale = 0;			// 技能2：碰撞放大倍数

	public skill_CreateBallOnHit_Rate = 0;		// 技能3：碰撞分裂概率
	public skill_CreateBallOnHit_Count = 0;		// 技能3：碰撞分裂数量
	public skill_CreateBallOnHit_Angle = 0;		// 技能3：碰撞分裂角度

	public skill_CreateBallOnBoxEliminate_Rate = 0;	 	// 技能4：盒子消除分裂球概率
	public skill_CreateBallOnBoxEliminate_Count = 0;	// 技能4：盒子消除分裂球数量

	public skill_PauseBoxOnHit_Rate = 0;	 	// 技能5：打击盒子定身的概率
	public skill_PauseBoxOnHit_Time = 0;		// 技能5：打击盒子定身的时长

	public Init()
	{

	}

	public GetBallEmitRadius()
	{
		if (this.skill_ScaleOnEmitter_Rate > 0 
			&& this.skill_ScaleOnEmitter_Scale > 0
			&& Math.random() <= this.skill_ScaleOnEmitter_Rate)
		{
			return this.ballRadius * this.skill_ScaleOnEmitter_Scale;
		}
		else
		{
			return this.ballRadius;
		}
	}

	public IsTriggerSkill_ScaleOnHit()
	{
		if (this.skill_ScaleOnHit_Rate > 0 
			&& this.skill_ScaleOnHit_Scale > 0
			&& Math.random() <= this.skill_ScaleOnHit_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public IsTriggerSkill_CreateBallOnHit()
	{
		if (this.skill_CreateBallOnHit_Rate > 0 
			&& this.skill_CreateBallOnHit_Count > 0
			&& Math.random() <= this.skill_CreateBallOnHit_Rate)
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
		if (this.skill_CreateBallOnBoxEliminate_Rate > 0 
			&& this.skill_CreateBallOnBoxEliminate_Count > 0
			&& Math.random() <= this.skill_CreateBallOnBoxEliminate_Rate)
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
		if (this.skill_PauseBoxOnHit_Rate > 0 
			&& this.skill_PauseBoxOnHit_Time > 0
			&& Math.random() <= this.skill_PauseBoxOnHit_Rate)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}