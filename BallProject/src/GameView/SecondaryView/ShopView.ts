class ShopView extends egret.DisplayObjectContainer
{
    private bgCover:FullScreenCover;
    private noGoodsTitle:egret.TextField;
    private noGoodsDetail:egret.TextField;
    private back:ShapeBgButton;
    private callbackObj:any;
    private callbackFun:Function;
    

    public constructor()
    {
        super();
        this.CreateBgCover();
        this.CreateTitle();
        this.CreateDetail();
        this.CreateBack();
    }

    public Init(callbackFun:Function, callbackObj:any)
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

    private CreateDetail()
    {
        this.noGoodsDetail = new egret.TextField();
        this.noGoodsDetail.size = 40;
        this.noGoodsDetail.textColor = 0xFFFFFF;

        this.noGoodsDetail.textFlow = <Array<egret.ITextElement>>
        [
            { text:"在商店里，你可以使用弹球游戏中获得的", style:{"textColor":0xFFFFFF, "size":30} },
            { text:"金币", style:{"textColor":0xFFC900, "size":30} },
            { text:"购买", style:{"textColor":0xFFFFFF, "size":30} },
            { text:"炫酷且具有特殊技能", style:{"textColor":0xFFC900, "size":30} },
            { text:"的弹球\n\n但是店里没有存货了\n", style:{"textColor":0xFFFFFF, "size":30} },
            { text:"兔女郎", style:{"textColor":0xB90086, "size":30}},
            { text:"已经出门进货了\n", style:{"textColor":0xFFFFFF, "size":30}},
            { text:"所以尽请期待吧~", style:{"textColor":0xFFFFFF, "size":30}},
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
        this.noGoodsTitle.text = "尽请期待";
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
        this.back.y = 50;
        this.addChild(this.back);
    }

    private OnClickBack(callbackObj:any)
    {
        callbackObj.callbackFun(callbackObj.callbackObj);
    }
}