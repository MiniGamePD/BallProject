interface INetworkConfigModule extends IModule 
{
    // 是否拉到了CDN数据
    HasLoadNetWorkConfig(): boolean;

    // 获取服务器拉取配置，如果没有拉完或拉取失败，返回的是默认值。
    GetNetWorkConfig(): NetWorkConfig;
}