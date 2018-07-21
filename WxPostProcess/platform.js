/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */

var nickName = "unknow";

class WxgamePlatform 
{
    name = 'wxgame'

     login() 
     {
      wx.showShareMenu({
        withShareTicket: 'false',
        success() {
          console.log('成功开启分享')
          wx.onShareAppMessage(function () {
            // 用户点击了“转发”按钮
            return {
              title: '00后都在秀恩爱了，你还在玩老式弹球？',
              imageUrl: 'https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/Share1.png',
              success()
              {
                console.log("share success");
              }
            }
          })
        },
        fail(data) {
          console.log(data);
        }
      });


      return new Promise((resolve, reject) => {
        wx.checkSession(
          {
            success: function () 
            {
              //session 未过期，并且在本生命周期一直有效
              wx.getUserInfo({
                    withCredentials: true,
                    success: function (res) {
                        var userInfo = res.userInfo
                        nickName = userInfo.nickName
                        console.log("nickName " + nickName);
                        var avatarUrl = userInfo.avatarUrl
                        var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        var province = userInfo.province
                        var city = userInfo.city
                        var country = userInfo.country
                        resolve(userInfo);
                    }
                })
            },
            fail: function () 
            {
              //登录态过期
              wx.login(
                {
                  success: (res) => {
                    resolve(res)
                    wx.getUserInfo({
                        withCredentials: true,
                        success: function (res) {
                            var userInfo = res.userInfo
                            nickName = userInfo.nickName
                            console.log("nickName " + nickName);
                            var avatarUrl = userInfo.avatarUrl
                            var gender = userInfo.gender //性别 0：未知、1：男、2：女
                            var province = userInfo.province
                            var city = userInfo.city
                            var country = userInfo.country
                            resolve(userInfo);
                }
            })
                  }
                })
            }
          })
      })
    }

    // getUserInfo() {
    //     return new Promise((resolve, reject) => {
            
    //     })
    // }

    shareAppMsg1() 
    {
        wx.shareAppMessage({
            title: '00后都在秀恩爱了，你还在玩老式弹球？',
            imageUrl: 'https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/Share1.png',
            success()
            {
                console.log("share success");
            }
        })
    }

    shareAppMsg2() 
    {
        wx.shareAppMessage({
            title: '每次上厕所，都玩到站不起来',
            imageUrl: 'https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/Share2.png',
            success()
            {
                console.log("share success");
            }
        })
    }

    shareAppMsg3() 
    {
        wx.shareAppMessage({
            title: '不和这货分出胜负，没完！',
            imageUrl: 'https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/Share3.png',
            success()
            {
                console.log("share success");
            }
        })
    }

    shareAppMsgRevive() 
    {
        wx.shareAppMessage({
            title: '又被围攻啦，快来救我！',
            imageUrl: 'https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/Share4.png',
            success()
            {
                console.log("share success");
            }
        })
    }

    shareAppMsgRank(score) 
    {
        wx.shareAppMessage({
            title: '我的纪录是'+score+'分，不服来战！',
            imageUrl: 'https://littlegame-1257022815.cos.ap-shanghai.myqcloud.com/Share5.png',
            success()
            {
                console.log("share success");
            }
        })
    }

    saveUserData(userData)
    {
        const fs = wx.getFileSystemManager();
        fs.writeFileSync(`${wx.env.USER_DATA_PATH}/UserData.txt`, userData, 'ascii');
    }

    loadUserData()
    {
        const fs = wx.getFileSystemManager();
        var userData = fs.readFileSync(`${wx.env.USER_DATA_PATH}/UserData.txt`, 'ascii');
        return userData;
    }

    hasUserData()
    {
        const fs = wx.getFileSystemManager();
        return fs.accessSync(`${wx.env.USER_DATA_PATH}/UserData.txt`);
    }

    openDataContext = new WxgameOpenDataContext();

    createOpenDataBitmap(width, height)
    {
        if(this.isWxVersionSatisfy(10992))
        {
            return this.openDataContext.createDisplayObject(width, height);
        }
        return null;
    }

    setUserCloudStorage(storageKey, storageValue)
    {
        let gameScoreData = 
        { 
            wxgame: 
            { 
                score:  storageValue , 
                update_time:  new   Date ().getTime(), 
            }
        } 

        let userKVData = 
        { 
            key:   storageKey, 
            value: JSON.stringify(gameScoreData), 
        } 

        wx.setUserCloudStorage({ 
            KVDataList: [userKVData], 
            success:  function   (res) 
            { 
                //console.log("--success res:", res); 
                //console.log('设置CloudStorage:' + storageKey + '-' + storageValue + "成功");
            }, 
            fail:  function   (res) 
            { 
                console.log( '--fail res:' , res); 
            }, 
            complete:  function   (res) 
            { 
                //console.log( '--complete res:' , res); 
            }, 
        }); 
    }

    getFriendCloudStorage(storageKey)
    {
        this.openDataContext.postMessage("getFriendCloudStorage", storageKey);
    }

    canUseCloudStorage()
    {
       return this.isWxVersionSatisfy(10992);
    }

    isWxVersionSatisfy(limitVersion)
    {
        try
        {
            var sysInfo = wx.getSystemInfoSync();
            var version = sysInfo.SDKVersion;
            var temp = version.split(".");
            var mainVer = 0;
            if(temp.length > 0)
                mainVer = parseInt(temp[0]);
            var subVer = 0;
            if(temp.length > 1)
                subVer = parseInt(temp[1]);
            var thirdVer = 0;
            if(temp.length > 2)
                thirdVer = parseInt(temp[2]);

            var version = mainVer*10000+subVer*100+thirdVer;
            //console.log(version);
            return version >= limitVersion;
        }
        catch (e)
        {
            return false;
        }
    }

    rankTurnPage(dir)
    {
        if(this.isWxVersionSatisfy(10992))
        {
            this.openDataContext.postMessage("rankTurnPage", dir);
        }
    }

    vibrateShort()
    {
        wx.vibrateShort();
    }

    renderGameOverRank(key)
    {
        if(this.isWxVersionSatisfy(10992))
        {
            //console.log("renderGameOverRank " + nickName);
            this.openDataContext.postMessage("renderGameOverRank", nickName);
        }
    }
}

class WxgameOpenDataContext {

    createDisplayObject(width,height)
    {
        //console.log("createDisplayObject:" + width + "," + height);
        sharedCanvas.width = width;
        sharedCanvas.height = height;
        const bitmapdata = new egret.BitmapData(sharedCanvas);
        bitmapdata.$deleteSource = false;
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        const bitmap = new egret.Bitmap(texture);
        bitmap.width = width;
        bitmap.height = height;

        egret.startTick((timeStarmp) => {
            egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
            bitmapdata.webGLTexture = null;
            return false;
        }, this);
        return bitmap;
    }


    postMessage(userCommand, userData){
        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({command:userCommand, data:userData});
    }
}


window.platform = new WxgamePlatform();
