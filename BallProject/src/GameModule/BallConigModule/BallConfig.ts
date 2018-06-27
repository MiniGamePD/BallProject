class BallConfig
{
	public constructor()
	{
	}

	public id : number = 0;
	public textureName: string = "Ball_White";
	public level: number = 0;
	public maxLevel: number = 0;
	public emitSpeed: number = 1000; 	//球速
	public ballMass: number = 1;		//球的质量
	public ballRadius: number = 15;		//球的半径

	public skill_ScaleOnEmitter_Rate = 0; 		// 技能1：发射放大概率
	public skill_ScaleOnEmitter_Scale = 0; 		// 技能1：发射放大倍数
	
	public skill_ScaleOnHit_Rate = 0;			// 技能2：碰撞放大概率
	public skill_ScaleOnHit_Scale = 0;			// 技能2：碰撞放大倍数
	public skill_ScaleOnHit_BallRadius = 0;		// 技能2：碰撞放大最大半径

	public skill_SplitBallOnHit_Rate = 0;		// 技能3：碰撞分裂概率
	public skill_SplitBallOnHit_Count = 0;		// 技能3：碰撞分裂数量
	public skill_SplitBallOnHit_Angle = 0;		// 技能3：碰撞分裂角度

	public skill_CreateBallOnBoxEliminate_Rate = 0;	 	// 技能4：盒子消除分裂球概率
	public skill_CreateBallOnBoxEliminate_Count = 0;	// 技能4：盒子消除分裂球数量

	public skill_PauseBoxOnHit_Rate = 0;	 	// 技能5：打击盒子定身的概率
	public skill_PauseBoxOnHit_Time = 0;		// 技能5：打击盒子定身的时长

	public Box_Effect_Pause_Time = 5000;		// 定时道具的持续时间
	public Box_Effect_MultipleDirections_Time = 5000; // 变身道具的持续时间
	public Box_Effect_FireUp_Time = 5000;		// 全力开火的持续时间

	public Describe: string;  // 描述

	public InitByConfig(config, level)
	{
		this.id = config.id;
		this.textureName = config.textureName;
		this.level = level;
		this.maxLevel = config.maxLevel;

		this.emitSpeed = this.GetConfigInList(config.emitSpeed, level, 1000);
		this.ballMass = this.GetConfigInList(config.ballMass, level, 1);
		this.ballRadius = this.GetConfigInList(config.ballRadius, level, 15);

		this.skill_ScaleOnEmitter_Rate = this.GetConfigInList(config.skill_ScaleOnEmitter_Rate, level, 0);
		this.skill_ScaleOnEmitter_Scale = this.GetConfigInList(config.skill_ScaleOnEmitter_Scale, level, 0);

		this.skill_ScaleOnHit_Rate = this.GetConfigInList(config.skill_ScaleOnHit_Rate, level, 0);
		this.skill_ScaleOnHit_Scale = this.GetConfigInList(config.skill_ScaleOnHit_Scale, level, 0);
		this.skill_ScaleOnHit_BallRadius = this.GetConfigInList(config.skill_ScaleOnHit_BallRadius, level, 0);

		this.skill_SplitBallOnHit_Rate = this.GetConfigInList(config.skill_SplitBallOnHit_Rate, level, 0);
		this.skill_SplitBallOnHit_Count = this.GetConfigInList(config.skill_SplitBallOnHit_Count, level, 0);
		this.skill_SplitBallOnHit_Angle = this.GetConfigInList(config.skill_SplitBallOnHit_Angle, level, 0);

		this.skill_CreateBallOnBoxEliminate_Rate = this.GetConfigInList(config.skill_CreateBallOnBoxEliminate_Rate, level, 0);
		this.skill_CreateBallOnBoxEliminate_Count = this.GetConfigInList(config.skill_CreateBallOnBoxEliminate_Count, level, 0);

		this.skill_PauseBoxOnHit_Rate = this.GetConfigInList(config.skill_PauseBoxOnHit_Rate, level, 0);
		this.skill_PauseBoxOnHit_Time = this.GetConfigInList(config.skill_PauseBoxOnHit_Time, level, 0);

		this.Box_Effect_Pause_Time = this.GetConfigInList(config.Box_Effect_Pause_Time, level, 5000);
		this.Box_Effect_MultipleDirections_Time = this.GetConfigInList(config.Box_Effect_MultipleDirections_Time, level, 5000);
		this.Box_Effect_FireUp_Time = this.GetConfigInList(config.Box_Effect_FireUp_Time, level, 5000);

		this.Describe = this.GetConfigInList(config.Describe, level, "默认");
	}

	private GetConfigInList(list: any[], level: number, defaultValue: any): any
	{
		if (list != undefined && list != null && list.length > 0)
		{
			if (level > 0 && level < list.length)
			{
				return list[level - 1];
			}
			else if (level >= list.length)
			{
				return list[list.length - 1];
			}
			else
			{
				return defaultValue
			}
		}
		return defaultValue;
	}
}