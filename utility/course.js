'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');

//------------------------------------------
// 由學號查詢學生資料
//------------------------------------------
var fetchCourse = async function(coursename){
    //存放結果
    let result;  

    //讀取資料庫
    await query('select teachername,*,*,* from teacher as a,course as b,periodstarttime as c,periodendtime as d where coursename = $1 and b.teacherno = a.teacherno and b.starttime = c.periodstartno and b.daynight = c.daynight and b.endtime = d.periodendno and b.daynight = d.daynight', [coursename])
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows[0];  //學生資料(物件)
            }else{
                result = -1;  //找不到資料
            }    
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
    return result;  
}
//------------------------------------------

//匯出
module.exports = {fetchCourse};