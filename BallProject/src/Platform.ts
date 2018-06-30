/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform 
{
    getUserInfo(): Promise<any>;

    login(): Promise<any>

    shareAppMsg();

    shareAppMsgRevive();

    shareAppMsgRank(score:number);

    saveUserData(userData:string);

    loadUserData():string;

    hasUserData():boolean;

    createOpenDataBitmap(width:number, height:number):egret.Bitmap;

    setUserCloudStorage(key:string, value:string);

    getFriendCloudStorage(key:string);

    rankTurnPage(dir:number);
}

class DebugPlatform implements Platform 
{
    async getUserInfo() 
    {
        return { nickName: "username" }
    }

    async login() 
    {

    }

    public shareAppMsgRevive()
    {
        console.log("Share App Msg Revive");
    }

    public shareAppMsg()
    {
        console.log("Share App Msg");
    }

    public shareAppMsgRank(score:number)
    {
        console.log("Share App Msg Rank");
    }

    public saveUserData(userData:string)
    {

    }

    public loadUserData():string
    {
        return "10,100";
    }

    public hasUserData():boolean
    {
        return true;
    }

    public createOpenDataBitmap(width:number, height:number):egret.Bitmap
    {
        return null;
    }

    public setUserCloudStorage(key:string, value:string)
    {
        console.log("保存云端数据:" + key + "-" + value);
    }

    public getFriendCloudStorage(key:string)
    {
        console.log("获取云端数据:" + key);
    }

    public rankTurnPage(dir:number)
    {
        console.log("排行榜翻页" + dir);
    }
}

if (!window.platform) 
{
    window.platform = new DebugPlatform();
}

declare let platform: Platform;

declare interface Window 
{
    platform: Platform
}





