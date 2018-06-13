class GameView extends egret.DisplayObjectContainer implements IGameView
{
    protected mAdaptedStage: egret.DisplayObjectContainer;

    public CreateView(): void { }

    public UpdateView(deltaTime: number): void { }

    public ReleaseView(): void { }

    public GetDisplayObjectContainer(): egret.DisplayObjectContainer
    {
        return this;
    }
}