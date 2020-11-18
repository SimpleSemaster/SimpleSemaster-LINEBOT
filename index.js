//----------------------------------------
// 載入必要的模組
//----------------------------------------
var express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const {Text, Card, Image, Suggestion, Payload} = require('dialogflow-fulfillment'); 
const app = express();


//增加引用函式
const teacher = require('./utility/teacher');
const course = require('./utility/course');
const credits = require('./utility/credits');

/*
//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1654206823',
    channelSecret: '13539dd66169e8c2a548d9f206a69851',
    channelAccessToken: 'qiYcWUMLVg5qA8FLI192DseDohHH/K473s3XK0jjFgkSv1Gx1sxFhFXGAcjCyDnXL/uN2rTsvPmESiaJDBZJ1uWx6eND/JhjL/pvV49jvUfsmsaJFaVGbsd4EoVDTRp8c74x4KeQ6rqKyASyAjjHfgdB04t89/1O/w1cDnyilFU='
});*/

//--------------------------------
// 機器人接受訊息的處理
//--------------------------------
app.post('/dialogflow', express.json(), (req, res) => {
    //------------------------------------
    // 處理請求/回覆的Dialogflow代理人
    //------------------------------------  
    const agent = new WebhookClient({request: req, response: res});

    //------------------------------------
    // 處理歡迎意圖
    //------------------------------------     
    function welcome(){
        agent.add('歡迎你!!!');
    }

    function SearchTeacher() {
        var teacherno = req.body.queryResult.parameters.teacherno;
        
        return teacher.fetchTeacher(teacherno).then(data => {  
            if (data == -1){
                agent.add('找不到老師資料');
            }else if(data == -9){                    
                agent.add('執行錯誤');
            }else{
                agent.add('找到老師資料');
                /*
                for(var i=0; i<data.length; i++){
                    agent.add(data[i].course + ":" + data[i].score + "分");
                }  
                let msg='';
                let firstLine = true; 
                data.forEach(item => {
                if(firstLine){                            
                    firstLine=false;
                }else{
                    msg = msg + '\n';
                }
                office = item.office;
                msg = msg + "課程名稱：" + item.coursename + "\n星期" + item.whichday + "\n從第" + item.starttime + "節課("+ item.periodstarttime.slice(0,-3) + ")到第" + item.endtime + "節課("+ item.periodendtime.slice(0,-3) + ")\n教室："+item.classroom + "\n";
                });
                agent.add({type:'text', text: teachername+"老師的辦公室為："+office+"\n老師的課表如下："+ msg +"\n詳細課表以學校官網為主：\nhttp://ntcbadm.ntub.edu.tw/pub/Cur_Teachers.aspx"});
            */}  
        })
    }
            
            
           /* if (event.message.text.includes("查詢")&&event.message.text.includes("老師")) {
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
                        office = item.office;
                        msg = msg + "課程名稱：" + item.coursename + "\n星期" + item.whichday + "\n從第" + item.starttime + "節課("+ item.periodstarttime.slice(0,-3) + ")到第" + item.endtime + "節課("+ item.periodendtime.slice(0,-3) + ")\n教室："+item.classroom + "\n";
                        });
                        event.reply({type:'text', text: teachername+"老師的辦公室為："+office+"\n"+ msg +"\n詳細以學校官網為主：\nhttp://ntcbadm.ntub.edu.tw/pub/Cur_Teachers.aspx"});
                    }  
                })
            }else if (event.message.text.includes("查詢")&&event.message.text.includes("學年度")&&event.message.text.includes("畢業門檻")) {
                //使用者傳來的學號
                const year = event.message.text.slice(2,-9);
                const schoolsys = event.message.text.slice(8,-4);
                //呼叫API取得學生資料
                credits.fetchCredits(year,schoolsys).then(data => {  
                    if (data == -1){
                        event.reply('找不到畢業門檻資料');
                    }else if(data == -9){                    
                        event.reply('執行錯誤');
                    }else{
                        event.reply([
                            {'type':'text', 'text':"必修：學校每學期會安排必修課，不用自己選。\n安排的必修課都要過才能畢業。\n\n專業選修：在選課網上有標註【專選】之課程，\n需要自己選課並計算學分數，\n專選學分若未達指定門檻，\n即使總學分有超過畢業門檻也無法畢業。\n\n其餘課程(通識、一般選修等)與必修、專選學分相加後超過總學分即達成畢業門檻。\n\n"+
                            data.year + data.schoolsys +"的總學分數為" + data.minicre + "，\n其中專選學分數為" + data.minielecre +"。"},
                            {'type':'text', 'text':"詳情可上教務處網站查詢：https://acad.ntub.edu.tw/p/412-1004-1718.php?Lang=zh-tw"},
                            {'type':'text', 'text':"另有英語能力及專業證照之畢業門檻，請上以下網站查詢：https://imd.ntub.edu.tw/p/412-1043-1051.php"},]
                        );  
                    }
                })
            }else if(event.message.text.includes("查詢教師資訊")){
                event.reply("請輸入【查詢(老師名字)老師】，例如：查詢葉明貴老師");
            }else if(event.message.text.includes("查詢畢業門檻")){
                event.reply("請輸入【查詢(學年度)學年度(學制)畢業門檻】，例如：查詢105學年度五專畢業門檻");           
            }else if(event.message.text.includes("查詢選課學分")){
                event.reply([
                    {'type':'text', 'text':"二技一年級及四技一至三年級：16~25學分\n二技二年級及四技四年級：9~25學分\n\n五專前三學年：20~34學分\n五專後二學年：12~28學分\n\n夜二技及夜四技：9~25學分"},
                    {'type':'text', 'text':"詳細選課規定請參閱教務處網站：https://acad.ntub.edu.tw/p/412-1004-185.php"}]
                );           
            }else if(event.message.text.includes("本系特色")){
                event.reply({
                    "type": "image",
                    "originalContentUrl": "https://i.imgur.com/wbi3pAs.png",
                    "previewImageUrl": "https://i.imgur.com/wbi3pAs.png"
                });	            
            }else if(event.message.text.includes("展望")){            
                return event.reply({
                    "type": "image",
                    "originalContentUrl": "https://i.imgur.com/7CTvWkv.png",
                    "previewImageUrl": "https://i.imgur.com/7CTvWkv.png"
                });	            
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
                            {'type':'text', 'text':data.coursename+"\n指導老師："+data.teachername+"\n星期"+data.whichday+"\n從第"+ data.starttime + "節課("+ data.periodstarttime.slice(0,-3) + ")到第" + data.endtime + "節課("+ data.periodendtime.slice(0,-3)+")\n教室："+data.classroom},]
                        );  
                    }  
                })
            }*/
    let intentMap = new Map();
    //------------------------------------
    intentMap.set('SearchTeacher', SearchTeacher)
    intentMap.set('Default Welcome Intent', welcome);
    //------------------------------------
    agent.handleRequest(intentMap);         
});

   

//----------------------------------------
// 監聽3000埠號, 
// 或是監聽Heroku設定的埠號
//----------------------------------------
var server = app.listen(process.env.PORT || 3000, function() {
    const port = server.address().port;
    console.log("正在監聽埠號:", port);
});