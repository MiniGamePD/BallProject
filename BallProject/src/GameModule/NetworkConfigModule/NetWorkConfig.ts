class NetWorkConfig
{
	public EnableShare = false; // 是否打开分享复活

	public SetConfigByJson(jsonConfig)
	{
		this.EnableShare = this.ReadConfigInJson(jsonConfig.EnableShare, false);
	}

	private ReadConfigInJson(value, defaultValue)
	{
		if (value != undefined)
		{
			return value;
		}
		return defaultValue;
	}
}