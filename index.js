//----------------------------------------
// 載入必要的模組
//----------------------------------------
var express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const app = express();


//增加引用函式
const teacher = require('./utility/teacher');
const course = require('./utility/course');
const credits = require('./utility/credits');
const semcredits = require('./utility/semcredits');
const event = require('./utility/event');


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
        var teachername = req.body.queryResult.parameters.teachername;
        console.log(teachername);
        return teacher.fetchTeacher(teachername).then(data => {  
            if (data == -1){
                agent.add('找不到老師資料');
            }else if(data == -9){                    
                agent.add('執行錯誤');
            }else{
                var msg='';
                data.forEach(item => {
                    office = item.office;
                    msg = msg + "課程名稱：" + item.coursename + "\n星期" + item.whichday + "\n從第" + item.starttime + "節課("+ item.periodstarttime.slice(0,-3) + ")到第" + item.endtime + "節課("+ item.periodendtime.slice(0,-3) + ")\n教室："+item.classroom + "\n\n";
                })
                agent.add(teachername+"老師的辦公室為："+office+"\n\n老師的課表如下："+ msg +"\n詳細課表以學校官網為主：\nhttp://ntcbadm.ntub.edu.tw/pub/Cur_Teachers.aspx");
            };
        })
    }  
    
    

    function SearchCourse(){
        var coursename = req.body.queryResult.parameters.coursename;
        console.log(coursename);
        return course.fetchCourse(coursename).then(data => {  
            if (data == -1){
                agent.add('找不到資料');
            }else if(data == -9){                    
                agent.add('執行錯誤');
            }else{
                agent.add(data.coursename+'\n指導老師：'+data.teachername+'\n星期'+data.whichday+'\n從第'+ data.starttime + '節課('+ data.periodstarttime.slice(0,-3) + ')到第' + data.endtime + '節課('+ data.periodendtime.slice(0,-3)+')\n教室：'+data.classroom);  
            }  
        })
    }
     
    function SearchCredits(){
        var year = req.body.queryResult.parameters.year;
        var schoolsys = req.body.queryResult.parameters.schoolsys;
        
        return credits.fetchCredits(year,schoolsys).then(data => {  
            if (data == -1){
                agent.add('找不到畢業門檻資料');
            }else if(data == -9){                    
                agent.add('執行錯誤');
            }else{
                agent.add("必修：學校每學期會安排必修課，不用自己選。\n安排的必修課都要過才能畢業。\n\n專業選修：在選課網上有標註【專選】之課程，\n需要自己選課並計算學分數，\n專選學分若未達指定門檻，\n即使總學分有超過畢業門檻也無法畢業。\n\n其餘課程(通識、一般選修等)與必修、專選學分相加後超過總學分即達成畢業門檻。\n\n"+
                    data.year + data.schoolsys +"的總學分數為" + data.minicre + "，\n其中專選學分數為" + data.minielecre +"。\n\n詳情可上教務處網站查詢：https://acad.ntub.edu.tw/p/412-1004-1718.php?Lang=zh-tw\n\n另有英語能力及專業證照之畢業門檻，請上以下網站查詢：https://imd.ntub.edu.tw/p/412-1043-1051.php"
                )
            }
        })
    }

    function SearchSemesterCredits() {
        var schoolsys = req.body.queryResult.parameters.schoolsys;
        var grade = req.body.queryResult.parameters.grade;

        return semcredits.fetchSemCredits(schoolsys,grade).then(data => {  
            if (data == -1){
                agent.add('找不到學制資料');
            }else if(data == -9){                    
                agent.add('執行錯誤');
            }else{
                agent.add(data.schoolsys+data.grade+"年級的最低選課學分為："+ data.minsemcre + "\n最高選課學分為："+data.maxsemcre);
            };
        })
    }  

    function SearchEvent() {
        return event.fetchEvent().then(data => {  
            if (data == -1){
                agent.add('找不到活動資料');
            }else if(data == -9){                    
                agent.add('執行錯誤');
            }else{
                var msg='';
                data.forEach(item => {
                    msg = msg +"活動名稱："+item.eventname+"\n活動網址："+item.eventlink;
                })
                agent.add(msg);
            }
        })
        
    }        

    
    let intentMap = new Map();
    //------------------------------------
    intentMap.set('SearchTeacher', SearchTeacher)
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('SearchCourse', SearchCourse);SearchCredits
    intentMap.set('SearchCredits', SearchCredits);
    intentMap.set('SearchSemesterCredits', SearchSemesterCredits);
    intentMap.set('SearchEvent', SearchEvent);
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