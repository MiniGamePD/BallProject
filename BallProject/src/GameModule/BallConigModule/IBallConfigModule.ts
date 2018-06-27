interface IBallConfigModule extends IModule 
{
    LoadBallConfig();

    GetCurBallConfig(): BallConfig;
}