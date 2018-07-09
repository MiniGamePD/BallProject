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
    private lotteryCost: egret.TextField;

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
    private ballLevelDesBitmap: egret.Bitmap;
    private selectedBitmap: egret.Bitmap;

    private lockBgBitmap: egret.Bitmap;
    private lockText: egret.TextField;


    // 技能描述 -- begin
    private curLevelText: egret.TextField;
    private nextLevelText: egret.TextField;

    private attributeBg: egret.Bitmap;

    private attribute1_point: egret.Bitmap;
    private attribute1_Head: egret.TextField;
    private attribute1_value: egret.TextField;
    private attribute1_next: egret.Bitmap;
    private attribute1_nextValue: egret.TextField;

    private attribute2_point: egret.Bitmap;
    private attribute2_Head: egret.TextField;
    private attribute2_value: egret.TextField;
    private attribute2_next: egret.Bitmap;
    private attribute2_nextValue: egret.TextField;

    private attribute3_point: egret.Bitmap;
    private attribute3_Head: egret.TextField;
    private attribute3_value: egret.TextField;
    private attribute3_next: egret.Bitmap;
    private attribute3_nextValue: egret.TextField;
    // 技能描述 -- end


    private shopDesText: egret.TextField;
    private shopDesBitmap: egret.Bitmap;

    private lottyView: LotteryView;

    private adaptFactor: number;

    private hintFinger: egret.Bitmap;
    private dicountBitmap: egret.Bitmap;

    public constructor()
    {
        super();
        this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
        this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);

        this.adaptFactor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;

        this.CreateBgCover();
        // this.CreateTitle();
        // this.CreateDetail();
        this.CreateBack();

        this.RefreshCoinInfo();

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

    public OnOpenShop()
    {
        this.RefreshCoinInfo();
        this.RefreshBallInfo();
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

    private RefreshCoinInfo()
    {
        Tools.DetachDisplayObjFromParent(this.coinBitmap);
        Tools.DetachDisplayObjFromParent(this.coinText);

        this.coinBitmap = this.resModule.CreateBitmapByName("shopCoin");
        this.coinBitmap.x = 320 * this.adaptFactor;
        this.coinBitmap.y = 85;
        Tools.SetAnchor(this.coinBitmap, AnchorType.Center);
        this.addChild(this.coinBitmap);

        this.coinText = new egret.TextField();
        this.coinText.size = 40;
        this.coinText.textColor = 0xFFFFFF;
        this.coinText.textAlign = "center";
        this.coinText.width = 400;
        this.coinText.height = 100;
        this.coinText.x = 340 * this.adaptFactor;
        this.coinText.y = 115;
        this.coinText.text = this.playerDataModule.GetCoin().toString();
        Tools.SetAnchor(this.coinText, AnchorType.Center);
        this.addChild(this.coinText);
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
        Tools.DetachDisplayObjFromParent(this.lockBgBitmap);
        Tools.DetachDisplayObjFromParent(this.lockText);

        var widthMidX = 320;

        this.curShowBallId = this.GetShopViewBallIdByIndex(this.curShowBallPosIndex);
        var ballLevel = this.ballConfigModule.GetMyBallLevel(this.curShowBallId);
        var hasThisBall = ballLevel > 0;
        var curLevel = hasThisBall ? ballLevel : 1;
        var curLevelBallConfig = this.ballConfigModule.GetBallConfig(this.curShowBallId, curLevel);
        var isMaxLevel = curLevelBallConfig.level == curLevelBallConfig.maxLevel;

        this.ballIndexText = new egret.TextField();
        this.ballIndexText.size = 40;
        this.ballIndexText.textColor = 0xFFFFFF;
        this.ballIndexText.text = this.curShowBallPosIndex + "/" + this.totalBallCount;
        this.ballIndexText.textAlign = "center";
        this.ballIndexText.width = 400;
        this.ballIndexText.height = 100;
        Tools.SetAnchor(this.ballIndexText, AnchorType.Center);
        this.ballIndexText.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballIndexText.y = 210;
        this.addChild(this.ballIndexText);

        var ballWidth = 200; //curLevelBallConfig.ballRadius * 10;
        var ballPosy = 345;

        if (!hasThisBall)
        {
            this.lockBgBitmap = this.resModule.CreateBitmap("lockBg", GameMain.GetInstance().GetStageWidth() / 2, ballPosy - 2.5, this);
            this.lockBgBitmap.width = ballWidth + 30;
            this.lockBgBitmap.height = ballWidth + 30;
            Tools.SetAnchor(this.lockBgBitmap, AnchorType.Center);
        }

        this.ballBitmap = this.resModule.CreateBitmapByName(curLevelBallConfig.textureName);
        this.ballBitmap.width = ballWidth;
        this.ballBitmap.height = ballWidth;
        this.ballBitmap.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballBitmap.y = ballPosy;
        Tools.SetAnchor(this.ballBitmap, AnchorType.Center);
        this.addChild(this.ballBitmap);

        if (hasThisBall)
        {
            this.ballLevelBitmap = this.resModule.CreateBitmapByName("level" + curLevelBallConfig.level);
            this.ballLevelBitmap.x = (widthMidX + 200) * this.adaptFactor;
            this.ballLevelBitmap.y = 200;
            Tools.SetAnchor(this.ballLevelBitmap, AnchorType.Center);
            this.addChild(this.ballLevelBitmap);

            if (isMaxLevel)
            {
                this.ballLevelMaxBitmap = this.resModule.CreateBitmap("levelMax",
                    (widthMidX + 230) * this.adaptFactor, 230, this, AnchorType.Center);
            }
        }
        else
        {
            this.ballBitmap.alpha = 0.5;
        }

        this.ballNameText = new egret.TextField();
        this.ballNameText.size = 40;
        this.ballNameText.textColor = 0xFFFFFF;
        this.ballNameText.text = curLevelBallConfig.name;
        this.ballNameText.bold = true;
        this.ballNameText.strokeColor = 0xAAAAAA;
        this.ballNameText.stroke = 1;
        this.ballNameText.textAlign = "center";
        Tools.SetAnchor(this.ballNameText, AnchorType.Center);
        this.ballNameText.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballNameText.y = 500;
        this.selectBallRoot.addChild(this.ballNameText);

        this.ballSkillText = new egret.TextField();
        this.ballSkillText.size = GameMain.GetInstance().GetScreenRatio() > (16 / 9) ? 27 : 30;
        this.ballSkillText.textColor = 0xFFFFFF;
        this.ballSkillText.text = "- " + curLevelBallConfig.skillDes + " -";
        this.ballSkillText.textAlign = "center";
        this.ballSkillText.width = GameMain.GetInstance().GetStageWidth();
        Tools.SetAnchor(this.ballSkillText, AnchorType.Center);
        this.ballSkillText.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballSkillText.y = 560;
        this.selectBallRoot.addChild(this.ballSkillText);

        // 选球按钮
        Tools.DetachDisplayObjFromParent(this.selectBtn);
        Tools.DetachDisplayObjFromParent(this.selectedBitmap);
        var lottyBtnPosx = widthMidX;
        if (hasThisBall)
        {
            this.selectBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.SelectBall_OK",
                242 * this.adaptFactor, 79 * this.adaptFactor, 242 * this.adaptFactor, 79 * this.adaptFactor, this.OnClickSelectBtn, this);
            this.selectBtn.x = (widthMidX / 2) * this.adaptFactor;
            this.selectBtn.y = GameMain.GetInstance().GetStageHeight() - 100;
            this.addChild(this.selectBtn);

            if (this.curShowBallId == this.ballConfigModule.GetCurBallConfig().id)
            {
                this.selectedBitmap = this.resModule.CreateBitmap("selected",
                    widthMidX / 2 + 100, this.selectBtn.y - 20, this);
                Tools.AdapteDisplayObject(this.selectedBitmap);
                Tools.SetAnchor(this.selectedBitmap, AnchorType.Center);
            }
            lottyBtnPosx = widthMidX / 2 * 3 - 20;
        }

        if (this.lotteryBtn == null || this.lotteryBtn == undefined)
        {
            Tools.DetachDisplayObjFromParent(this.lotteryBtn);
            this.lotteryBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.lottyBtn",
                302 * this.adaptFactor, 79 * this.adaptFactor, 302 * this.adaptFactor, 79 * this.adaptFactor, this.OnClickLotteryBtn, this);
            this.addChild(this.lotteryBtn);
        }

        this.lotteryBtn.x = lottyBtnPosx * this.adaptFactor;
        this.lotteryBtn.y = GameMain.GetInstance().GetStageHeight() - 100;

        var enoughCoin = this.playerDataModule.GetCoin() >= Lotty_Ball_Cost;

        Tools.DetachDisplayObjFromParent(this.lotteryCost);
        this.lotteryCost = new egret.TextField();
        this.lotteryCost.size = 45;
        this.lotteryCost.textColor = enoughCoin ? 0xffffff : 0xd6340a;
        this.lotteryCost.textAlign = "center";
        this.lotteryCost.bold = true;
        this.lotteryCost.text = Lotty_Ball_Cost.toString();
        this.lotteryCost.x = (lottyBtnPosx + 100) * this.adaptFactor;
        this.lotteryCost.y = GameMain.GetInstance().GetStageHeight() - 100;
        // Tools.AdapteDisplayObject(this.lotteryCost);
        Tools.SetAnchor(this.lotteryCost, AnchorType.Center);
        this.addChild(this.lotteryCost);

        Tools.DetachDisplayObjFromParent(this.hintFinger);
        //首抽免费的手指
        if (this.ballConfigModule.IsNewPlayer() && this.lotteryBtn != null && this.lotteryBtn != undefined)
        {
            this.lotteryCost.textColor = 0xffffff;
            Tools.DetachDisplayObjFromParent(this.dicountBitmap);
            this.dicountBitmap = this.resModule.CreateBitmap("discount", this.lotteryCost.x, this.lotteryCost.y, this, AnchorType.Center);

            this.hintFinger = this.resModule.CreateBitmapByName("pd_res_json.finger");
            this.hintFinger.x = this.lotteryBtn.width / 2;
            this.hintFinger.y = this.lotteryBtn.height / 2;
            Tools.AdapteDisplayObject(this.hintFinger);
            this.lotteryBtn.addChild(this.hintFinger);

            var scaleParam = new PaScalingParam()
            scaleParam.displayObj = this.hintFinger;
            scaleParam.targetScaleX = 0.8;
            scaleParam.targetScaleY = 0.8;
            scaleParam.duration = 50000000;
            scaleParam.interval = 500;
            scaleParam.reverse = true;
            var scaleEvent = new PlayProgramAnimationEvent()
            scaleEvent.param = scaleParam;
            GameMain.GetInstance().DispatchEvent(scaleEvent);
        }

        this.CreateAttribute();
    }

    private CreateAttribute()
    {
        Tools.DetachDisplayObjFromParent(this.attributeBg);
        Tools.DetachDisplayObjFromParent(this.ballLevelDesBitmap);

        Tools.DetachDisplayObjFromParent(this.attribute1_point);
        Tools.DetachDisplayObjFromParent(this.attribute1_Head);
        Tools.DetachDisplayObjFromParent(this.attribute1_value);
        Tools.DetachDisplayObjFromParent(this.attribute1_next);
        Tools.DetachDisplayObjFromParent(this.attribute1_nextValue);

        Tools.DetachDisplayObjFromParent(this.attribute2_point);
        Tools.DetachDisplayObjFromParent(this.attribute2_Head);
        Tools.DetachDisplayObjFromParent(this.attribute2_value);
        Tools.DetachDisplayObjFromParent(this.attribute2_next);
        Tools.DetachDisplayObjFromParent(this.attribute2_nextValue);

        Tools.DetachDisplayObjFromParent(this.attribute3_point);
        Tools.DetachDisplayObjFromParent(this.attribute3_Head);
        Tools.DetachDisplayObjFromParent(this.attribute3_value);
        Tools.DetachDisplayObjFromParent(this.attribute3_next);
        Tools.DetachDisplayObjFromParent(this.attribute3_nextValue);

        var widthMidX = 320;

        this.curShowBallId = this.GetShopViewBallIdByIndex(this.curShowBallPosIndex);
        var ballLevel = this.ballConfigModule.GetMyBallLevel(this.curShowBallId);
        var hasThisBall = ballLevel > 0;
        var curLevel = hasThisBall ? ballLevel : 1;
        var curLevelBallConfig = this.ballConfigModule.GetBallConfig(this.curShowBallId, curLevel);
        var isMaxLevel = curLevelBallConfig.level == curLevelBallConfig.maxLevel;
        var hasSkill = curLevelBallConfig.skillHead != undefined && curLevelBallConfig.skillHead != "";
        var nextLevelBallConfig = null;
        if (!isMaxLevel)
        {
            nextLevelBallConfig = this.ballConfigModule.GetBallConfig(this.curShowBallId, curLevel + 1);
        }

        var posy = 630;

        this.attributeBg = this.resModule.CreateBitmapByName("attributeBg");
        this.attributeBg.width *= this.adaptFactor;
        this.attributeBg.x = widthMidX * this.adaptFactor;
        this.attributeBg.y = posy + this.attributeBg.height / 2;
        Tools.SetAnchor(this.attributeBg, AnchorType.Center);
        this.addChild(this.attributeBg);

        this.ballLevelDesBitmap = this.resModule.CreateBitmapByName(isMaxLevel ? "maxLevelDes" : "nextLevelDes");
        this.ballLevelDesBitmap.x = widthMidX;
        this.ballLevelDesBitmap.y = posy;
        Tools.AdapteDisplayObject(this.ballLevelDesBitmap);
        Tools.SetAnchor(this.ballLevelDesBitmap, AnchorType.Center);
        this.addChild(this.ballLevelDesBitmap);

        var row1Posy = posy + 50;
        var row2Posy = row1Posy + 40;
        var row3Posy = row2Posy + 40;
        if (!hasSkill)
        {
            row1Posy = posy + 70;
            row2Posy = row1Posy + 50;
        }

        var fontSize = GameMain.GetInstance().GetScreenRatio() > 16 / 9 ? 27 : 30;


        this.attribute1_point = this.resModule.CreateBitmapByName("point");
        Tools.SetAnchor(this.attribute1_point, AnchorType.Center);
        this.attribute1_point.x = 75 * this.adaptFactor;
        this.attribute1_point.y = row1Posy;
        this.addChild(this.attribute1_point);

        this.attribute1_Head = new egret.TextField();
        this.attribute1_Head.size = fontSize;
        this.attribute1_Head.textColor = 0xFFFFFF;
        this.attribute1_Head.textAlign = "left";
        this.attribute1_Head.text = "半径:";
        Tools.SetAnchor(this.attribute1_Head, AnchorType.Left);
        this.attribute1_Head.x = 115 * this.adaptFactor;
        this.attribute1_Head.y = row1Posy;
        this.addChild(this.attribute1_Head);

        this.attribute1_value = new egret.TextField();
        this.attribute1_value.size = fontSize;
        this.attribute1_value.textColor = 0xFFFFFF;
        this.attribute1_value.textAlign = "center";
        this.attribute1_value.text = curLevelBallConfig.ballRadius.toString();
        Tools.SetAnchor(this.attribute1_value, AnchorType.Left);
        this.attribute1_value.x = 255 * this.adaptFactor;
        this.attribute1_value.y = row1Posy;
        this.addChild(this.attribute1_value);

        if (!isMaxLevel)
        {
            this.attribute1_next = this.resModule.CreateBitmapByName("skillArrow");
            Tools.SetAnchor(this.attribute1_next, AnchorType.Center);
            this.attribute1_next.x = 420 * this.adaptFactor;
            this.attribute1_next.y = row1Posy;
            this.addChild(this.attribute1_next);

            this.attribute1_nextValue = new egret.TextField();
            this.attribute1_nextValue.size = fontSize;
            this.attribute1_nextValue.textColor = 0xf1be22;
            this.attribute1_nextValue.textAlign = "center";
            this.attribute1_nextValue.text = nextLevelBallConfig.ballRadius.toString();
            Tools.SetAnchor(this.attribute1_nextValue, AnchorType.Left);
            this.attribute1_nextValue.x = 520 * this.adaptFactor;
            this.attribute1_nextValue.y = row1Posy;
            this.addChild(this.attribute1_nextValue);
        }

        // 第二排
        this.attribute2_point = this.resModule.CreateBitmapByName("point");
        Tools.SetAnchor(this.attribute2_point, AnchorType.Center);
        this.attribute2_point.x = 75 * this.adaptFactor;
        this.attribute2_point.y = row2Posy;
        this.addChild(this.attribute2_point);

        this.attribute2_Head = new egret.TextField();
        this.attribute2_Head.size = fontSize;
        this.attribute2_Head.textColor = 0xFFFFFF;
        this.attribute2_Head.textAlign = "left";
        this.attribute2_Head.text = "速度:";
        Tools.SetAnchor(this.attribute2_Head, AnchorType.Left);
        this.attribute2_Head.x = 115 * this.adaptFactor;
        this.attribute2_Head.y = row2Posy;
        this.addChild(this.attribute2_Head);

        this.attribute2_value = new egret.TextField();
        this.attribute2_value.size = fontSize;
        this.attribute2_value.textColor = 0xFFFFFF;
        this.attribute2_value.textAlign = "center";
        this.attribute2_value.text = curLevelBallConfig.emitSpeed.toString();
        Tools.SetAnchor(this.attribute2_value, AnchorType.Left);
        this.attribute2_value.x = 255 * this.adaptFactor;
        this.attribute2_value.y = row2Posy;
        this.addChild(this.attribute2_value);

        if (!isMaxLevel)
        {
            this.attribute2_next = this.resModule.CreateBitmapByName("skillArrow");
            Tools.SetAnchor(this.attribute2_next, AnchorType.Center);
            this.attribute2_next.x = 420 * this.adaptFactor;
            this.attribute2_next.y = row2Posy;
            this.addChild(this.attribute2_next);

            this.attribute2_nextValue = new egret.TextField();
            this.attribute2_nextValue.size = fontSize;
            this.attribute2_nextValue.textColor = 0xf1be22;
            this.attribute2_nextValue.textAlign = "center";
            this.attribute2_nextValue.text = nextLevelBallConfig.emitSpeed.toString();
            Tools.SetAnchor(this.attribute2_nextValue, AnchorType.Left);
            this.attribute2_nextValue.x = 520 * this.adaptFactor;
            this.attribute2_nextValue.y = row2Posy;
            this.addChild(this.attribute2_nextValue);
        }

        // 第三排
        if (hasSkill)
        {
            this.attribute3_point = this.resModule.CreateBitmapByName("point");
            Tools.SetAnchor(this.attribute3_point, AnchorType.Center);
            this.attribute3_point.x = 75 * this.adaptFactor;
            this.attribute3_point.y = row3Posy;
            this.addChild(this.attribute3_point);

            this.attribute3_Head = new egret.TextField();
            this.attribute3_Head.size = fontSize;
            this.attribute3_Head.textColor = 0xFFFFFF;
            this.attribute3_Head.textAlign = "left";
            this.attribute3_Head.text = curLevelBallConfig.skillHead + ":";
            Tools.SetAnchor(this.attribute3_Head, AnchorType.Left);
            this.attribute3_Head.x = 115 * this.adaptFactor;
            this.attribute3_Head.y = row3Posy;
            this.addChild(this.attribute3_Head);

            this.attribute3_value = new egret.TextField();
            this.attribute3_value.size = fontSize;
            this.attribute3_value.textColor = 0xFFFFFF;
            this.attribute3_value.textAlign = "center";
            this.attribute3_value.text = curLevelBallConfig.skillLevellDes.toString();
            Tools.SetAnchor(this.attribute3_value, AnchorType.Left);
            this.attribute3_value.x = 255 * this.adaptFactor;
            this.attribute3_value.y = row3Posy;
            this.addChild(this.attribute3_value);

            if (!isMaxLevel)
            {
                this.attribute3_next = this.resModule.CreateBitmapByName("skillArrow");
                Tools.SetAnchor(this.attribute3_next, AnchorType.Center);
                this.attribute3_next.x = 420 * this.adaptFactor;
                this.attribute3_next.y = row3Posy;
                this.addChild(this.attribute3_next);

                this.attribute3_nextValue = new egret.TextField();
                this.attribute3_nextValue.size = fontSize;
                this.attribute3_nextValue.textColor = 0xf1be22;
                this.attribute3_nextValue.textAlign = "center";
                this.attribute3_nextValue.text = nextLevelBallConfig.skillLevellDes.toString();
                Tools.SetAnchor(this.attribute3_nextValue, AnchorType.Left);
                this.attribute3_nextValue.x = 520 * this.adaptFactor;
                this.attribute3_nextValue.y = row3Posy;
                this.addChild(this.attribute3_nextValue);
            }
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
        this.back = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.shopReturn", 65, 65, 65, 65, this.OnClickBack, this);
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
        this.previousBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.ballLeft", 200, 200, 92, 92, this.OnClickPreviousBtn, this);
        this.previousBtn.x = 100;
        this.previousBtn.y = 350;
        this.addChild(this.previousBtn);

        Tools.DetachDisplayObjFromParent(this.nextBtn);
        this.nextBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.ballLeft", 200, 200, 92, 92, this.OnClickNextBtn, this);
        this.nextBtn.x = GameMain.GetInstance().GetStageWidth() - 100;
        this.nextBtn.rotation = 180;
        this.nextBtn.y = 350;
        this.addChild(this.nextBtn);

        Tools.DetachDisplayObjFromParent(this.shopDesBitmap);
        this.shopDesBitmap = this.resModule.CreateBitmapByName("shopDes");
        Tools.SetAnchor(this.shopDesBitmap, AnchorType.Right);
        this.shopDesBitmap.x = GameMain.GetInstance().GetStageWidth() - 10;
        this.shopDesBitmap.y = GameMain.GetInstance().GetStageHeight() - 180;
        this.addChild(this.shopDesBitmap);

        Tools.DetachDisplayObjFromParent(this.shopDesText);
        this.shopDesText = new egret.TextField();
        this.shopDesText.text = this.ballConfigModule.IsNewPlayer ? "首次抽球免费哦！" : "抽到相同的球升一级哦！";
        this.shopDesText.size = 28;
        this.shopDesText.anchorOffsetX = this.shopDesText.width / 2;
        this.shopDesText.anchorOffsetY = this.shopDesText.height / 2;
        this.shopDesText.textAlign = "center";
        this.shopDesText.bold = false;
        this.shopDesText.x = GameMain.GetInstance().GetStageWidth() - 235;
        this.shopDesText.y = GameMain.GetInstance().GetStageHeight() - 234;
        this.shopDesText.textColor = 0xFFFFFF;
        this.addChild(this.shopDesText);
    }

    private OnClickPreviousBtn(callbackObj: any)
    {
        if (callbackObj.curShowBallPosIndex > 1)
        {
            --callbackObj.curShowBallPosIndex;
        }
        else
        {
            callbackObj.curShowBallPosIndex = callbackObj.totalBallCount;
        }
        callbackObj.RefreshBallInfo();
    }

    private OnClickNextBtn(callbackObj: any)
    {
        if (callbackObj.curShowBallPosIndex < callbackObj.totalBallCount)
        {
            ++callbackObj.curShowBallPosIndex;
        }
        else
        {
            callbackObj.curShowBallPosIndex = 1;
        }
        callbackObj.RefreshBallInfo();
    }

    private OnClickSelectBtn(callbackObj: any)
    {
        var ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
        ballConfigModule.ChangeSelectBall(callbackObj.curShowBallId);
        // callbackObj.curShowBallPosIndex = 1;
        callbackObj.RefreshBallInfo();

        // 退回大厅
        callbackObj.callbackFun(callbackObj.callbackObj);
    }

    private OnClickLotteryBtn(callbackObj: any)
    {
        callbackObj.TryLottyBall();
    }

    private TryLottyBall()
    {
        var result = this.ballConfigModule.IsNewPlayer() 
                    || this.playerDataModule.CostCoin(Lotty_Ball_Cost);
        if (result)
        {
            this.playerDataModule.Save();
            this.lottyView = new LotteryView();
            this.lottyView.Init(this.OnCloseLotteryView, this);
            this.addChild(this.lottyView);
        }
        else
        {
            var networkConfigModule = <INetworkConfigModule>GameMain.GetInstance().GetModule(ModuleType.NETWORK_CONFIG);
            var networkConfig = networkConfigModule.GetNetWorkConfig();
            var tips = "糟糕，金币不够!\n游戏中击破金币道具可以获得金币。";
            if (networkConfig.EnableShare)
            {
                tips += "\n分享好友，金币可以翻倍哦~"
            }
            this.ShowTips(GameMain.GetInstance().GetStageWidth() / 2,
                 GameMain.GetInstance().GetStageHeight() / 2, tips);
        }
    }

    private tips: egret.TextField;
    private tipsShapeBg: egret.Shape;
    public ShowTips(posx: number, posy:number, tipString: string)
    {
        Tools.DetachDisplayObjFromParent(this.tips);
        Tools.DetachDisplayObjFromParent(this.tipsShapeBg);

        this.tips = new egret.TextField();
        this.tips.text = tipString;
        this.tips.size = 28;
        this.tips.anchorOffsetX = this.tips.width / 2;
        this.tips.anchorOffsetY = this.tips.height / 2;
        this.tips.textAlign = "center";
        this.tips.bold = false;
        // tips.strokeColor = 0x000000;
        // tips.stroke = 2;
        this.tips.x = posx;
        this.tips.y = posy;
        this.tips.textColor = 0x11fdff;

		this.tipsShapeBg = new egret.Shape();
		this.tipsShapeBg.graphics.lineStyle(2, 0x000000);
		this.tipsShapeBg.graphics.beginFill(0x6B6B6B, 1);
		this.tipsShapeBg.graphics.drawRect(0, 0, this.tips.width + 40, this.tips.height + 50);
		this.tipsShapeBg.graphics.endFill();
		this.tipsShapeBg.x = posx
		this.tipsShapeBg.y = posy
		this.tipsShapeBg.width = this.tips.width + 40;
		this.tipsShapeBg.height = this.tips.height + 50;
		Tools.SetAnchor(this.tipsShapeBg, AnchorType.Center);
        this.addChild(this.tipsShapeBg)

        this.addChild(this.tips);

        var moveParam = new PaMovingParam()
        moveParam.displayObj = this.tips;
        moveParam.duration = 5000;
        moveParam.targetPosX = this.tips.x;
        moveParam.targetPosY = this.tips.y - 60;
        moveParam.needRemoveOnFinish = true;
        var moveEvent = new PlayProgramAnimationEvent();
        moveEvent.param = moveParam;
        GameMain.GetInstance().DispatchEvent(moveEvent);

        var moveParam = new PaMovingParam()
        moveParam.displayObj = this.tipsShapeBg;
        moveParam.duration = 5000;
        moveParam.targetPosX = this.tips.x;
        moveParam.targetPosY = this.tips.y - 60;
        moveParam.needRemoveOnFinish = true;
        var moveEvent = new PlayProgramAnimationEvent();
        moveEvent.param = moveParam;
        GameMain.GetInstance().DispatchEvent(moveEvent);
    }

    private OnCloseLotteryView(callbackObj: any, ballInfo: RandomBallInfo)
    {
        egret.log("OnCloseLotteryView");
        if (ballInfo != null)
        {
            callbackObj.SetFocusBall(ballInfo.id);
        }
        callbackObj.OnOpenShop();
    }

    private SetFocusBall(ballId: number)
    {
        for (var i = 1; i <= this.ballConfigModule.GetTotalBallCount(); ++i)
        {
            if (this.GetShopViewBallIdByIndex(i) == ballId)
            {
                this.curShowBallPosIndex = i;
                break;
            }
        }
    }
}