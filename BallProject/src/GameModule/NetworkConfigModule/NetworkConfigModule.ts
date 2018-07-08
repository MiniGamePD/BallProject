class NetworkConfigModule extends ModuleBase implements INetworkConfigModule
{
    private static m_SLoadUrl = "https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/WebConfig.json"; //拉取 配置默认url

    private netWorkConfig: NetWorkConfig;
    private hasLoadNetWorkConfig = false;

    public Init():boolean
	{
		super.Init();
        this.netWorkConfig = new NetWorkConfig();
        this.hasLoadNetWorkConfig = false;
        this.LoadUrlData();
		return true;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
		this.isForeground = true;
	}

    private LoadUrlData(): void
    {
        var httpRequest = new egret.HttpRequest;

        httpRequest.responseType = egret.HttpResponseType.TEXT;
        httpRequest.open(NetworkConfigModule.m_SLoadUrl, egret.HttpMethod.GET);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send();
        httpRequest.addEventListener(egret.Event.COMPLETE, this.OnLoadUrlDataSucceed, this);
    }

    public HasLoadNetWorkConfig(): boolean
    {
        return this.hasLoadNetWorkConfig;
    }

    public GetNetWorkConfig(): NetWorkConfig
    {
        return this.netWorkConfig;
    }

    private OnLoadUrlDataSucceed(event: egret.Event): void
    {
        var request = <egret.HttpRequest>event.currentTarget;
        console.log("get data:", request.response);

        var Config = JSON.parse(request.response);

        this.netWorkConfig.SetConfigByJson(Config);
        this.hasLoadNetWorkConfig = true;

        return;
    }

    private OnLoadUrlDataFail(event: egret.IOErrorEvent): void
    {
        console.log("get error for reason :" + event);
    }
}