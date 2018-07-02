/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */

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
              title: '快来和小章鱼一起玩弹球吧~',
              imageUrl: 'resource/assets/Share.png',
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
            success: function () {
              //session 未过期，并且在本生命周期一直有效
            },
            fail: function () {
              //登录态过期
              wx.login(
                {
                  success: (res) => {
                    resolve(res)
                  }
                })
            }
          })
      })
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    resolve(userInfo);
                }
            })
        })
    }

    shareAppMsg() 
    {
        wx.shareAppMessage({
            title: '快来和小章鱼一起玩弹球吧~',
            imageUrl: 'resource/assets/Share.png',
            success()
            {
                console.log("share success");
            }
        })
    }

    shareAppMsgRevive() 
    {
        wx.shareAppMessage({
            title: '我的小章鱼被围攻啦，快来救我！',
            imageUrl: 'resource/assets/Share.png',
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
            imageUrl: 'resource/assets/Share.png',
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
        return this.openDataContext.createDisplayObject(width, height);
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
                console.log("--success res:", res); 
                console.log('设置CloudStorage:' + storageKey + '-' + storageValue + "成功");
            }, 
            fail:  function   (res) 
            { 
                console.log( '--fail res:' , res); 
            }, 
            complete:  function   (res) 
            { 
                console.log( '--complete res:' , res); 
            }, 
        }); 
    }

    getFriendCloudStorage(storageKey)
    {
        this.openDataContext.postMessage("getFriendCloudStorage", storageKey);
    }

    rankTurnPage(dir)
    {
        this.openDataContext.postMessage("rankTurnPage", dir);
    }

    vibrateShort()
    {
        wx.vibrateShort();
    }
}

class WxgameOpenDataContext {

    createDisplayObject(width,height)
    {
        console.log("createDisplayObject:" + width + "," + height);
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
