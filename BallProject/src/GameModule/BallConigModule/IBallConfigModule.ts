interface IBallConfigModule extends IModule 
{
    LoadBallConfig();

    // 总球数
    GetTotalBallCount(): number; 

    // 当前所选的球
    GetCurBallConfig(): BallConfig;

    // 换球
    ChangeSelectBall(id: number);

    // 拥有的球的列表
    GetMyBallList(): MyBallInfo[];

    // 拥有的球的数量
    GetMyBallCount(): number; 

    // 是否拥有这个球, 返回null，代码没有这个球。
    GetMyBallInfo(id: number): MyBallInfo;

    // 获取我的球的等级, 返回0，代码没有这个球。
    GetMyBallLevel(id: number): number;

    // 根据球的ID，返回配置
    GetBallConfig(id: number, level: number): BallConfig;
}