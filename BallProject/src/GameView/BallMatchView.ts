class BallMatchView extends GameView
{
    public constructor()
    {
        super();
        var bg = new FullScreenCover(0x000000, 1);
        bg.touchEnabled = true;
        this.addChild(bg);
    }
} 