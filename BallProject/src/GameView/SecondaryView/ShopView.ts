class ShopView extends egret.DisplayObjectContainer
{
    private bgCover: FullScreenCover;
    private noGoodsTitle: egret.TextField;
    private noGoodsDetail: egret.TextField;
    private back: ShapeBgButton;
    private callbackObj: any;
    private callbackFun: Function;

    private previousBtn: ShapeBgButton;
    private nextBtn: ShapeBgButton;
    private selectBtn: ShapeBgButton;
    private lotteryBtn: ShapeBgButton;

    private resModule: IResModule;
    private ballConfigModule: IBallConfigModule;
    private playerDataModule: IPlayerDataModule;

    private curShowBallPosIndex: number;
    private curShowBallId: number;
    private totalBallCount: number;

    private coinBitmap: egret.Bitmap;
    private coinText: egret.TextField;

    private selectBallRoot: egret.DisplayObjectContainer;
    private ballBitmap: egret.Bitmap;
    private ballIndexText: egret.TextField;
    private ballLevelBitmap: egret.Bitmap;
    private ballLevelMaxBitmap: egret.Bitmap;
    private ballNameText: egret.TextField;
    private ballSkillText: egret.TextField;
    private curLevelText: egret.TextField;
    private nextLevelText: egret.TextField;

    private lottyView: LotteryView;

    public constructor()
    {
        super();
        this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
        this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);

        this.CreateBgCover();
        // this.CreateTitle();
        // this.CreateDetail();
        this.CreateBack();

        this.CreateCoin();

        this.curShowBallPosIndex = 1;
        this.totalBallCount = this.ballConfigModule.GetTotalBallCount();

        this.CreateSelectBallView();
    }

    private CreateSelectBallView()
    {
        this.selectBallRoot = new egret.DisplayObjectContainer();
        this.selectBallRoot.x = 0;
        this.selectBallRoot.y = 0;
        this.addChild(this.selectBallRoot);

        this.CreateSelectViewButton();

        this.RefreshBallInfo();
    }

    public Init(callbackFun: Function, callbackObj: any)
    {
        this.callbackFun = callbackFun;
        this.callbackObj = callbackObj;
    }

    public Release()
    {

    }

    private CreateBgCover()
    {
        this.bgCover = new FullScreenCover(0x000000, 1);
        this.bgCover.touchEnabled = true;
        this.addChild(this.bgCover);
    }

    private CreateCoin()
    {
        Tools.DetachDisplayObjFromParent(this.coinBitmap);
        Tools.DetachDisplayObjFromParent(this.coinText);

        this.coinText = new egret.TextField();
        this.coinText.size = 40;
        this.coinText.textColor = 0xFFFFFF;
        this.coinText.text = this.playerDataModule.GetCoin().toString();
        this.coinText.textAlign = "center";
        this.coinText.width = 400;
        this.coinText.height = 100;
        Tools.SetAnchor(this.coinText, AnchorType.Center);
        this.coinText.x = GameMain.GetInstance().GetStageWidth() - 100;
        this.coinText.y = 130;
        this.addChild(this.coinText);

        this.coinBitmap = this.resModule.CreateBitmapByName("shopCoin");
        Tools.SetAnchor(this.coinBitmap, AnchorType.Center);
        this.coinBitmap.x = GameMain.GetInstance().GetStageWidth() - this.coinBitmap.width / 2 - 15;
        this.coinBitmap.y = 100;
        this.addChild(this.coinBitmap);

    }

    private RefreshBallInfo()
    {
        Tools.DetachDisplayObjFromParent(this.ballIndexText);
        Tools.DetachDisplayObjFromParent(this.ballBitmap);
        Tools.DetachDisplayObjFromParent(this.ballNameText);
        Tools.DetachDisplayObjFromParent(this.curLevelText);
        Tools.DetachDisplayObjFromParent(this.nextLevelText);
        Tools.DetachDisplayObjFromParent(this.ballSkillText);
        Tools.DetachDisplayObjFromParent(this.ballLevelBitmap);
        Tools.DetachDisplayObjFromParent(this.ballLevelMaxBitmap);

        this.curShowBallId = this.GetShopViewBallIdByIndex(this.curShowBallPosIndex);
        var ballLevel = this.ballConfigModule.GetMyBallLevel(this.curShowBallId);
        var hasThisBall = ballLevel > 0;
        var curLevel = hasThisBall ? ballLevel : 1;
        var curLevelBallConfig = this.ballConfigModule.GetBallConfig(this.curShowBallId, curLevel);

        this.ballIndexText = new egret.TextField();
        this.ballIndexText.size = 40;
        this.ballIndexText.textColor = 0xFFFFFF;
        this.ballIndexText.text = this.curShowBallPosIndex + "/" + this.totalBallCount;
        this.ballIndexText.textAlign = "center";
        this.ballIndexText.width = 400;
        this.ballIndexText.height = 100;
        Tools.SetAnchor(this.ballIndexText, AnchorType.Center);
        this.ballIndexText.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballIndexText.y = 130;
        this.selectBallRoot.addChild(this.ballIndexText);

        this.ballBitmap = this.resModule.CreateBitmapByName(curLevelBallConfig.textureName);
        this.ballBitmap.width = curLevelBallConfig.ballRadius * 10;
        this.ballBitmap.height = curLevelBallConfig.ballRadius * 10;
        Tools.SetAnchor(this.ballBitmap, AnchorType.Center);
        this.ballBitmap.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballBitmap.y = 300;
        this.selectBallRoot.addChild(this.ballBitmap);

        this.ballLevelBitmap = this.resModule.CreateBitmapByName("level" + curLevelBallConfig.level);
        Tools.SetAnchor(this.ballLevelBitmap, AnchorType.Center);
        this.ballLevelBitmap.x = GameMain.GetInstance().GetStageWidth() / 2 + 200;
        this.ballLevelBitmap.y = 180;
        this.selectBallRoot.addChild(this.ballLevelBitmap);

        if (curLevelBallConfig.level == curLevelBallConfig.maxLevel)
        {
            this.ballLevelMaxBitmap = this.resModule.CreateBitmapByName("levelMax");
            Tools.SetAnchor(this.ballLevelMaxBitmap, AnchorType.Center);
            this.ballLevelMaxBitmap.x = GameMain.GetInstance().GetStageWidth() / 2 + 230;
            this.ballLevelMaxBitmap.y = 210;
            this.selectBallRoot.addChild(this.ballLevelMaxBitmap);
        }


        this.ballNameText = new egret.TextField();
        this.ballNameText.size = 40;
        this.ballNameText.textColor = 0xFFFFFF;
        this.ballNameText.text = curLevelBallConfig.name;
        this.ballNameText.textAlign = "center";
        this.ballNameText.width = 400;
        this.ballNameText.height = 300;
        Tools.SetAnchor(this.ballNameText, AnchorType.Center);
        this.ballNameText.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballNameText.y = 600;
        this.selectBallRoot.addChild(this.ballNameText);

        this.ballSkillText = new egret.TextField();
        this.ballSkillText.size = 30;
        this.ballSkillText.textColor = 0xFFFFFF;
        this.ballSkillText.text = "- " + curLevelBallConfig.skillDes + " -";
        this.ballSkillText.textAlign = "center";
        this.ballSkillText.width = GameMain.GetInstance().GetStageWidth();
        this.ballSkillText.height = 300;
        Tools.SetAnchor(this.ballSkillText, AnchorType.Center);
        this.ballSkillText.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballSkillText.y = 650;
        this.selectBallRoot.addChild(this.ballSkillText);


        this.curLevelText = new egret.TextField();
        this.curLevelText.size = 40;
        this.curLevelText.textColor = 0xFFFFFF;
        this.curLevelText.textFlow = <Array<egret.ITextElement>>
            [
                { text: "等级" + curLevel + "\n", style: { "textColor": 0xFFC900, "size": 40 } },
                { text: "半径: " + curLevelBallConfig.ballRadius + "\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "速度: " + curLevelBallConfig.emitSpeed + "\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "技能: ", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: curLevelBallConfig.Describe, style: { "textColor": 0x00EC00, "size": 30 } },
            ]
        this.curLevelText.textAlign = "left";
        this.curLevelText.width = GameMain.GetInstance().GetStageWidth() / 3;
        this.curLevelText.height = 600;
        Tools.SetAnchor(this.curLevelText, AnchorType.Center);
        this.curLevelText.x = hasThisBall ? GameMain.GetInstance().GetStageWidth() / 4 : GameMain.GetInstance().GetStageWidth() / 2;
        this.curLevelText.y = 1000;
        this.selectBallRoot.addChild(this.curLevelText);

        if (hasThisBall)
        {
            var nextLevel = curLevel + 1;
            var nextLevelBallConfig = this.ballConfigModule.GetBallConfig(this.curShowBallId, nextLevel);
            this.nextLevelText = new egret.TextField();
            this.nextLevelText.size = 40;
            this.nextLevelText.textColor = 0xFFFFFF;
            if (nextLevelBallConfig != null)
            {
                this.nextLevelText.textAlign = "left";
                this.nextLevelText.textFlow = <Array<egret.ITextElement>>
                    [
                        { text: "等级" + nextLevel + "\n", style: { "textColor": 0xFFC900, "size": 40 } },
                        { text: "半径: " + nextLevelBallConfig.ballRadius + "\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                        { text: "速度: " + nextLevelBallConfig.emitSpeed + "\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                        { text: "技能: ", style: { "textColor": 0xFFFFFF, "size": 30 } },
                        { text: curLevelBallConfig.Describe, style: { "textColor": 0x00EC00, "size": 30 } },
                    ]
            }
            else
            {
                this.nextLevelText.textAlign = "center";
                this.nextLevelText.textFlow = <Array<egret.ITextElement>>
                    [
                        { text: "已满级", style: { "textColor": 0xFFC900, "size": 50 } },
                    ]
            }

            this.nextLevelText.width = GameMain.GetInstance().GetStageWidth() / 3;
            this.nextLevelText.height = 600;
            Tools.SetAnchor(this.nextLevelText, AnchorType.Center);
            this.nextLevelText.x = GameMain.GetInstance().GetStageWidth() / 4 * 3;
            this.nextLevelText.y = 1000;
            this.selectBallRoot.addChild(this.nextLevelText);
        }
    }

    // 根据商店展示优先级获得球的ID（index从1开始）
    public GetShopViewBallIdByIndex(index: number): number
    {
        var myBallCount = this.ballConfigModule.GetMyBallList().length;
        if (index <= myBallCount)
        {
            var myBallList = this.ballConfigModule.GetMyBallList();
            return myBallList[index - 1].id;
        }
        else
        {
            var leftIndex = index - myBallCount;
            for (var id = 1; id <= this.ballConfigModule.GetTotalBallCount(); ++id)
            {
                if (this.ballConfigModule.GetMyBallInfo(id) == null)
                {
                    leftIndex--;
                    if (leftIndex == 0)
                    {
                        return id;
                    }
                }
            }
        }
        return 1;
    }

    private CreateDetail()
    {
        this.noGoodsDetail = new egret.TextField();
        this.noGoodsDetail.size = 40;
        this.noGoodsDetail.textColor = 0xFFFFFF;

        this.noGoodsDetail.textFlow = <Array<egret.ITextElement>>
            [
                { text: "在商店里，你可以使用弹球游戏中获得的", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "金币", style: { "textColor": 0xFFC900, "size": 30 } },
                { text: "购买", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "炫酷且具有特殊技能", style: { "textColor": 0xFFC900, "size": 30 } },
                { text: "的弹球\n\n但是店里没有存货了\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "兔女郎", style: { "textColor": 0xB90086, "size": 30 } },
                { text: "已经出门进货了\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "所以敬请期待吧~", style: { "textColor": 0xFFFFFF, "size": 30 } },
            ]

        this.noGoodsDetail.textAlign = "center";
        this.noGoodsDetail.width = 400;
        this.noGoodsDetail.height = 600;
        this.noGoodsDetail.anchorOffsetX = this.noGoodsDetail.width / 2;
        this.noGoodsDetail.anchorOffsetY = this.noGoodsDetail.height / 2;
        this.noGoodsDetail.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.noGoodsDetail.y = 700;
        this.addChild(this.noGoodsDetail);
    }

    private CreateTitle()
    {
        this.noGoodsTitle = new egret.TextField();
        this.noGoodsTitle.size = 80;
        this.noGoodsTitle.textColor = 0xB90086;
        this.noGoodsTitle.text = "敬请期待";
        this.noGoodsTitle.textAlign = "center";
        this.noGoodsTitle.width = 400;
        this.noGoodsTitle.height = 100;
        this.noGoodsTitle.anchorOffsetX = this.noGoodsTitle.width / 2;
        this.noGoodsTitle.anchorOffsetY = this.noGoodsTitle.height / 2;
        this.noGoodsTitle.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.noGoodsTitle.y = 300;
        //设置描边属性
        this.noGoodsTitle.strokeColor = 0xFFFFFF;
        this.noGoodsTitle.stroke = 2;
        this.addChild(this.noGoodsTitle);
    }

    private CreateBack()
    {
        this.back = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.return", 39, 64, 39, 64, this.OnClickBack, this);
        this.back.x = 50;
        this.back.y = 80;
        this.addChild(this.back);
    }

    private OnClickBack(callbackObj: any)
    {
        callbackObj.callbackFun(callbackObj.callbackObj);
    }

    private CreateSelectViewButton()
    {
        Tools.DetachDisplayObjFromParent(this.previousBtn);
        this.previousBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.ballLeft", 92, 92, 92, 92, this.OnClickPreviousBtn, this);
        this.previousBtn.x = 50 + this.previousBtn.width / 2;
        this.previousBtn.y = 300;
        this.addChild(this.previousBtn);

        Tools.DetachDisplayObjFromParent(this.nextBtn);
        this.nextBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.ballLeft", 92, 92, 92, 92, this.OnClickNextBtn, this);
        this.nextBtn.x = GameMain.GetInstance().GetStageWidth() - 50 - this.nextBtn.width / 2;
        this.nextBtn.rotation = 180;
        this.nextBtn.y = 300;
        this.addChild(this.nextBtn);

        Tools.DetachDisplayObjFromParent(this.selectBtn);
        this.selectBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.SelectBall_OK", 143, 91, 143, 91, this.OnClickSelectBtn, this);
        this.selectBtn.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.selectBtn.y = 600;
        this.addChild(this.selectBtn);

        Tools.DetachDisplayObjFromParent(this.lotteryBtn);
        this.lotteryBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.lottyBtn", 302, 73, 302, 73, this.OnClickLotteryBtn, this);
        this.lotteryBtn.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.lotteryBtn.y = GameMain.GetInstance().GetStageHeight() - 150;
        this.addChild(this.lotteryBtn);
    }

    private OnClickPreviousBtn(callbackObj: any)
    {
        if (callbackObj.curShowBallPosIndex > 1)
        {
            --callbackObj.curShowBallPosIndex;
            callbackObj.RefreshBallInfo();
        }
    }

    private OnClickNextBtn(callbackObj: any)
    {
        if (callbackObj.curShowBallPosIndex < callbackObj.totalBallCount)
        {
            ++callbackObj.curShowBallPosIndex;
            callbackObj.RefreshBallInfo();
        }
    }

    private OnClickSelectBtn(callbackObj: any)
    {
        var ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
        ballConfigModule.ChangeSelectBall(callbackObj.curShowBallId);
        // callbackObj.curShowBallPosIndex = 1;
        callbackObj.RefreshBallInfo();
    }

    private OnClickLotteryBtn(callbackObj: any)
    {
        callbackObj.lottyView = new LotteryView();
        callbackObj.lottyView.Init(callbackObj.OnCloseLotteryView, callbackObj);
        callbackObj.addChild(callbackObj.lottyView);
    }

    private OnCloseLotteryView(callbackObj: any)
    {
        egret.log("OnCloseLotteryView");
    }
}