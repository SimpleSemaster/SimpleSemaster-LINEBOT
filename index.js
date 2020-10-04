//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const teacher = require('./utility/teacher');
const course = require('./utility/course');
const whichday = require('./utility/whichday');


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
                        let msg='';
                        let firstLine = true; 
                        data.forEach(item => {
                        if(firstLine){                            
                            firstLine=false;
                        }else{
                            msg = msg + '\n';
                        }
                        var t = item.starttime;
                        msg = msg + "課程名稱：" + item.coursename + "\n星期" + item.whichday + "\n從第" + item.starttime + "節課("+ item.periodstarttime.slice(0,-3) + ")到第" + item.endtime + "節課("+ item.periodendtime.slice(0,-3) + ")\n";
                        });
                    event.reply({type:'text', text: msg + "\nhttp://ntcbadm.ntub.edu.tw/pub/Cur_Teachers.aspx"});
                        /*event.reply('要查詢星期幾呢？');
                        if (event.message.text.includes("星期")) {
                            const whichday = event.message.text.substr(2);
                            whichday.fetchWhichday(whichday).then(data => {  
                                if (data == -1){
                                    event.reply('找不到資料');
                                }else if(data == -9){                    
                                    event.reply('執行錯誤');
                                }else{
                                    event.reply([
                                        {'type':'text', 'text':"星期"+data.whichday},]
                                    );  
                                }
                            })      
                        }*/     
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
                            {'type':'text', 'text':data.coursename+"\n指導老師："+data.teachername+"\n星期"+data.whichday+"\n從第"+ data.starttime + "節課("+ data.periodstarttime.slice(0,-3) + ")到第" + data.endtime + "節課("+ data.periodendtime.slice(0,-3)+"節課\n教室："+data.classroom},]
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