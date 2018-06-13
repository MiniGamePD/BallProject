class BallMatchView extends GameView
{
    public constructor()
    {
        super();
        var bg = new FullScreenCover(0x000000, 1);
        this.addChild(bg);
    }
} 