class LoadingView extends GameView
{
    private textField: egret.TextField;
	private loadingText: egret.TextField;
    private textDebug: egret.TextField;
    private debugTime:number;
    private error:string;
    private loaded:number;
    private total:number;
    private fakeLoadingRate:number;

    public CreateView(): void
    {
        this.InitBackGround();
        if(DEBUG)
        {
            this.textDebug = new egret.TextField;
            this.textDebug.x = 0;
            this.textDebug.y = 0;
            this.textDebug.size = 20;
            this.addChild(this.textDebug);

            this.debugTime = 0;
            this.error = "";
            this.loaded = 0;
            this.total = 0;

            this.fakeLoadingRate = 0;
        }
    }

    public UpdateView(deltaTime: number): void 
    {
        if(DEBUG)
        {
            this.debugTime += deltaTime;   
            this.textDebug.text = this.debugTime.toString() + "\n" + this.error;
        }

        // this.fakeLoadingRate += 10;
        // this.fakeLoadingRate = Math.min(100, this.fakeLoadingRate);
        // this.SetProgress(this.fakeLoadingRate);
    }

	private InitBackGround()
	{
		let stageWidth = GameMain.GetInstance().GetStageWidth();
        let stageHeight = GameMain.GetInstance().GetStageHeight();

        // var bg = new FullScreenCover(0x000000, 1);
        // this.addChild(bg);

        // this.textField = new egret.TextField();
        // this.textField.x = 0;
        // this.textField.y = stageHeight / 4;
        // this.textField.width = stageWidth;
        // this.textField.height = 100;
        // this.textField.rotation = -5;
        // this.textField.fontFamily = "Impact";
        // this.textField.size *= 2;
        // this.textField.textAlign = "center";
        // this.textField.text = "Pocket Doctor";
        // this.addChild(this.textField);

        this.loadingText = new egret.TextField();
        this.loadingText.text = "加载中...马上就好哦~";
        this.loadingText.x = 0;
        this.loadingText.y = stageHeight / 2;
        this.loadingText.textAlign = egret.HorizontalAlign.CENTER;
        this.loadingText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.loadingText.width = stageWidth;
        this.loadingText.height = 100;
        this.addChild(this.loadingText);
	}

	// public SetProgress(rate: number)
	// {
	// 	var text = "Loading... " + rate.toFixed(0) + "%";
	// 	this.loadingText.text = text
	// }

    // public SetGroupDebugInfo(loaded:number, total:number)
    // {
    //     this.loaded = loaded;
    //     this.total = total;
    // }

    public SetError(err:string)
    {
        this.error += "\n" + err;
    } 
}