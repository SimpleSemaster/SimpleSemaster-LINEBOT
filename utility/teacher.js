'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');

//------------------------------------------
// 由學號查詢學生資料
//------------------------------------------
var fetchTeacher = async function(teachername){
    //存放結果
    let result;  

    //讀取資料庫
    await query('select * from teacher,course where teachername = $1', [teachername])
        .then((data) => {
            if(data.rows.length > 0){
                for (var i = 0; i < data.rows.length; i++) {
                    result = data.rows[2];
                  } //學生資料(物件)
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
module.exports = {fetchTeacher};