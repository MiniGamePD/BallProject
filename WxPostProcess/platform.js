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
}

class WxgameOpenDataContext {

    createDisplayObject(type,width,height){
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


    postMessage(data){
        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(data);
    }
}


window.platform = new WxgamePlatform();
