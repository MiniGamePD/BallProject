class BallMatchView extends GameView
{
    private hud:MatchHUD;
    private playerLv:egret.TextField;
    private battleGround:egret.DisplayObjectContainer;

    public CreateView(): void
    {
        var bg = new FullScreenCover(0x000000, 1);
        bg.touchEnabled = true;
        this.addChild(bg);

        this.CreateBattleGround();
        this.CreatePlayerLv();
        this.CreateHUD();
    }

    public ReleaseView(): void 
    {
        this.DeletePlayerLv();
        this.DeleteHUD();
    }

    private CreatePlayerLv()
    {
        this.playerLv = new egret.TextField();
        this.playerLv.text = "Lv. 1";
        this.playerLv.size = 30;
        this.playerLv.width = 200;
        this.playerLv.height = 60;
        this.playerLv.anchorOffsetX = this.playerLv.width / 2;
        this.playerLv.anchorOffsetY = this.playerLv.height / 2;
        this.playerLv.textAlign = "center";
        this.playerLv.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.playerLv.y = GameMain.GetInstance().GetStageHeight() / 2 + 100;
        this.addChild(this.playerLv);

        this.playerLv.touchEnabled = true;
        this.playerLv.addEventListener(egret.TouchEvent.TOUCH_TAP, this.GameOver, this);
    }

    private CreateBattleGround()
    {
        this.battleGround = new egret.DisplayObjectContainer();
        this.battleGround.width = this.width;
        this.battleGround.height = this.height;
        this.addChild(this.battleGround);
    }

    public GetBattleGround():egret.DisplayObjectContainer
    {
        return this.battleGround;
    }

    private GameOver()
    {
        let event = new GameOverEvent();            
        GameMain.GetInstance().DispatchEvent(event);
    }

    private DeletePlayerLv()
    {
        this.removeChild(this.playerLv);
        this.playerLv = null;
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

    public SetLevel(level:number)
    {
        this.playerLv.text = "Lv. " + level;
    }
} 