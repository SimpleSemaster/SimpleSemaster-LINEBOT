//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
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
	    
            //使用者傳來的學號
            const no = event.message.text;
          
            //呼叫API取得學生資料
            course.fetchCourse(no).then(data => {  
                if (data == -1){
                    event.reply('找不到資料');
                }else if(data == -9){                    
                    event.reply('執行錯誤');
                }else{
                    event.reply([
                        {'type':'text', 'text':data.courseno},
                        {'type':'text', 'text':data.coursename},
                        {'type':'text', 'text':data.teacherno},
                        {'type':'text', 'text':data.whichday},
                        {'type':'text', 'text':data.coursetime}]
                    );  
                }  
            })  
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