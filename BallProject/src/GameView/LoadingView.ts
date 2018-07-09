class LoadingView extends GameView
{
    private textField: egret.TextField;
	private loadingText: egret.TextField;

    public CreateView(): void
    {
        this.InitBackGround();
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
        this.loadingText.text = "Loading...";
        this.loadingText.x = 0;
        this.loadingText.y = stageHeight / 2;
        this.loadingText.textAlign = egret.HorizontalAlign.CENTER;
        this.loadingText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.loadingText.width = stageWidth;
        this.loadingText.height = 100;
        this.addChild(this.loadingText);
	}

	public SetProgress(rate: number)
	{
        if(this.hasError)
            return;
            
		var text = "Loading... " + rate.toFixed(0) + "%";
		this.loadingText.text = text
		// egret.log(text);
	}

    private hasError:boolean = false;
    public SetError(err:string)
    {
        this.hasError = true;
        this.loadingText.text += "\n" + err;
    }
}