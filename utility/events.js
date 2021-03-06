'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');
//------------------------------------------
// 由學號查詢學生成績
//------------------------------------------
var fetchEvents = async function(){
    //存放結果
    let result;  

    //讀取資料庫
    await query('select * from events')
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows.slice(-3);  //成績資料(清單)
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
module.exports = {fetchEvents};