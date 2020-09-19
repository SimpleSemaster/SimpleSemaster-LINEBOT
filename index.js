//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const teacher = require('./utility/teacher');
const course = require('./utility/course');


//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1654206823',
    channelSecret: '13539dd66169e8c2a548d9f206a69851',
    channelAccessToken: 'qiYcWUMLVg5qA8FLI192DseDohHH/K473s3XK0jjFgkSv1Gx1sxFhFXGAcjCyDnXL/uN2rTsvPmESiaJDBZJ1uWx6eND/JhjL/pvV49jvUfsmsaJFaVGbsd4EoVDTRp8c74x4KeQ6rqKyASyAjjHfgdB04t89/1O/w1cDnyilFU='
});

//--------------------------------
// 機器人接受訊息的處理
//--------------------------------
bot.on('message', function(event) {    
    event.source.profile().then(
        function (profile) {
            //取得使用者資料
            const userName = profile.displayName;
            const userId = profile.userId;
	    
            
            if (event.message.text.includes("查詢")&&event.message.text.includes("老師")) {
                //使用者傳來的學號
                const teachername = event.message.text.slice(2,-2);
                //呼叫API取得學生資料
                teacher.fetchTeacher(teachername).then(data => {  
                    if (data == -1){
                        event.reply('找不到老師資料');
                    }else if(data == -9){                    
                        event.reply('執行錯誤');
                    }else{
                        event.reply({
                            "type": "template",
                            "altText": "這是按鈕樣板",
                            "template": {
                                "type": "buttons",
                                "thumbnailImageUrl": "https://tomlin-app-1.herokuapp.com/imgs/p01.jpg",
                                "imageAspectRatio": "rectangle",
                                "imageSize": "cover",
                                "imageBackgroundColor": "#FFFFFF",
                                "title": "梵谷-星夜",
                                "text": "荷蘭後印象派畫家文森特·梵谷於1890年在法國聖雷米的一家精神病院裏創作的一幅著名油畫",
                                "defaultAction": {
                                    "type": "uri",
                                    "label": "詳細資料",
                                    "uri": "https://zh.wikipedia.org/wiki/%E6%98%9F%E5%A4%9C"
                                },
                                "actions": [
                                    {
                                      "type": "postback",
                                      "label": "買了",
                                      "data": "action=buy&itemid=123"
                                    },
                                    {
                                      "type": "postback",
                                      "label": "加入購物車",
                                      "data": "action=add&itemid=123"
                                    },
                                    {
                                      "type": "uri",
                                      "label": "詳細資料",
                                      "uri": "https://zh.wikipedia.org/wiki/%E6%98%9F%E5%A4%9C"
                                    }
                                ]
                            }
                          });  
                    }  
                })
            }else if (event.message.text.includes("查詢")) {
                //使用者傳來的學號
                const coursename = event.message.text.substr(2);
                //呼叫API取得學生資料
                course.fetchCourse(coursename).then(data => {  
                    if (data == -1){
                        event.reply('找不到資料');
                    }else if(data == -9){                    
                        event.reply('執行錯誤');
                    }else{
                        event.reply([
                            {'type':'text', 'text':data.coursename+"\n指導老師："+data.teachername+"\n星期"+data.whichday+"\n從第"+data.courseStartTime+"節課到第"+data.courseEndTime+"節課"},]
                        );  
                    }  
                })
            }
        }
    );
});

//----------------------------------------
// 建立一個網站應用程式app
// 如果連接根目錄, 交給機器人處理
//----------------------------------------
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//----------------------------------------
// 可直接取用檔案的資料夾
//----------------------------------------
app.use(express.static('public'));

//----------------------------------------
// 監聽3000埠號, 
// 或是監聽Heroku設定的埠號
//----------------------------------------
var server = app.listen(process.env.PORT || 3000, function() {
    const port = server.address().port;
    console.log("正在監聽埠號:", port);
});