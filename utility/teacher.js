'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');

//------------------------------------------
// 由學號查詢學生資料
//------------------------------------------
var fetchTeacher = async function(teachername){
    //存放結果
    var result =[];  

    //讀取資料庫
    await query('select teachername,* from teacher,course where teachername = $1 and course.teacherno = teacher.teacherno', [teachername])
        .then((data) => {
            if(data.rows.length > 0){
                for (var i = 0; i < data.rows.length; i++) {
                    result.add(data.rows[i]);
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