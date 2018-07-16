class NetWorkConfig
{
	public EnableShare = false; // 是否打开分享复活

	public m_LotteryShareShowTipLimit = 3;

	public SetConfigByJson(jsonConfig)
	{
		this.EnableShare = this.ReadConfigInJson(jsonConfig.EnableShare, false);
		this.m_LotteryShareShowTipLimit = this.ReadConfigInJson(jsonConfig.LotteryShareShowTimeTipLimit, 3);
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