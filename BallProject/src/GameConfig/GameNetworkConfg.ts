class GameNetworkConfig
{


public Init()
{
    //默认值
    this.m_stShareUrl = "";
    this.LoadUrlData();
}

private LoadUrlData(): void
{
    var httpRequest = new egret.HttpRequest;

    httpRequest.responseType = egret.HttpResponseType.TEXT;
    httpRequest.open(GameNetworkConfig.m_SLoadUrl,egret.HttpMethod.GET);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send();
    httpRequest.addEventListener(egret.Event.COMPLETE,this.OnLoadUrlDataSucceed,this);
}

public GetShareUrlString() : string
{
    return this.m_stShareUrl;
}


private OnLoadUrlDataSucceed(event: egret.Event):void
{
    var request = <egret.HttpRequest>event.currentTarget;
    console.log("get data:", request.response);

    var Config = JSON.parse(request.response);

    this.m_stShareUrl = Config["ShareUrl"];
    return;
}

private OnLoadUrlDataFail(event: egret.IOErrorEvent): void
{
    console.log("get error for reason :" + event);
}

//配置数据声明
private m_stShareUrl : string; //分享url 地址

private static m_SLoadUrl = "https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/WebConfig.json"; //拉取 配置默认url


}