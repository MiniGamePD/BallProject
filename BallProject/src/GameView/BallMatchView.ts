class BallMatchView extends GameView
{
    private hud:MatchHUD;
    private ballEmitterSprite:egret.Bitmap;

    public CreateView(): void
    {
        var bg = new FullScreenCover(0x000000, 1);
        bg.touchEnabled = true;
        this.addChild(bg);

        this.CreateBallEmitterSprite();

        this.CreateHUD();
    }

    public ReleaseView(): void 
    {
        this.DeleteBallEmitterSprite();
        this.DeleteHUD();
    }

    private CreateBallEmitterSprite()
    {
        var res = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

        this.ballEmitterSprite = res.CreateBitmapByName("pd_res_json.Virus_Blue_Idle1");
        this.ballEmitterSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballEmitterSprite.y = GameMain.GetInstance().GetStageHeight() / 2;
        this.ballEmitterSprite.anchorOffsetX = this.ballEmitterSprite.width / 2;
        this.ballEmitterSprite.anchorOffsetY = this.ballEmitterSprite.height / 2;
        this.addChild(this.ballEmitterSprite);

        this.ballEmitterSprite.touchEnabled = true;
        this.ballEmitterSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.GameOver, this);
    }

    private GameOver()
    {
        let event = new GameOverEvent();            
        GameMain.GetInstance().DispatchEvent(event);
    }

    private DeleteBallEmitterSprite()
    {
        this.removeChild(this.ballEmitterSprite);
        this.ballEmitterSprite = null;
    }

    private CreateHUD()
    {
        this.hud = new MatchHUD();
        this.hud.width = GameMain.GetInstance().GetStageWidth();
        this.hud.height = GameMain.GetInstance().GetStageHeight();
        this.hud.x = this.hud.y = 0;
        this.hud.Init();
        this.addChild(this.hud);
    }

    private DeleteHUD()
    {
        this.hud.Release();
        this.hud = null;
    }
} 