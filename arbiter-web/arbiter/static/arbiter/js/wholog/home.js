/**
 * Created by Administrator on 2017/8/6.
 */

$(document).ready(function() {

    /*设置默认值*/
    setDefaultDateTime();
    /**/
    var startDate = $('#start-date').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        format: 'yyyy-mm-dd',
        today: '今天',
        clear: '清除',
        close: '确定',
        closeOnSelect: false, // Close upon selecting a date,
    });
    /*时间选择*/
    var startTime = $('#start-time').pickatime({
        default: '', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: '确定', // text for done-button
        cleartext: '清除', // text for clear-button
        canceltext: '取消', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: false, // make AM PM clickable
        aftershow: function () {
        } //Function for after opening timepicker
    });
    /**/
    var endDate = $('#end-date').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        format: 'yyyy-mm-dd',
        today: '今天',
        clear: '清除',
        close: '确定',
        closeOnSelect: false, // Close upon selecting a date,
    });

    /*时间选择*/
    var endTime = $('#end-time').pickatime({
        default: '', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        format: 'hh:mm',
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: '确定', // text for done-button
        cleartext: '清除', // text for clear-button
        canceltext: '取消', // Text for cancel-button
        autoclose: true, // automatic close timepicker
        ampmclickable: false, // make AM PM clickable
        aftershow: function(){} //Function for after opening timepicker
    });

    var xmlHttp;
    function createXMLHttpRequest() {
        if (window.ActiveXObject)
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        else if (window.XMLHttpRequest)
            xmlHttp = new XMLHttpRequest();
    }
    function startRequest() {
        createXMLHttpRequest();
        xmlHttp.open('GET', '../wholog/search?author=hui', true);  //GET发送数据的方式
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)//判断返回码
                /*连接成功，设置数据*/
                loadData(JSON.parse(xmlHttp.responseText))
        };
        xmlHttp.send(null);                                    //GET发送的内容不再send(）中
    }
    $("#search-btn").click(function () {
        //startRequest()
        //loadData();
        console.log(getStartTime());

    });


});/*ready end*/
function setDefaultDateTime() {
        /*设置默认日期和时间*/
    var defaultDate=new Array();
    var currentTime = new Date();

    defaultDate[0] = currentTime.getFullYear();
    defaultDate[1] = currentTime.getMonth()+1;//0-11,要+1
    defaultDate[2] = currentTime.getDate();
    var startDate = defaultDate[0]+'-'+defaultDate[1]+'-'+defaultDate[2];
    var endDate = defaultDate[0]+'-'+defaultDate[1]+'-'+(defaultDate[2]+1);

    $('#start-date').val(startDate)
    $('#end-date').val(endDate);

    $('#start-time').val('00:00')
    $('#end-time').val('00:00');

}
//获取开始时间，2017-09-07 18:07
function getStartTime() {
    var date =  $('#start-date').val();
    var time =  $('#end-time').val();
    return date+" " + time;
}
//获取开始时间，2017-09-07 18:07
function getEndTime() {

}
function loadData() {
     /*init datatables*/

     var logtable = $('#tb-log').DataTable({
         destroy: true,
         dom: 'lrtip',
         //开启服务端模式
         serviceSide:true,
         paging: true,
         lengthChange: false,//是否允许改变每页显示记录数
         processing: true,//载入数据的时候是否显示
         searching: true,
         pagingType: "full_numbers",
         columns: [
            { data: 'fields.log_id' },
            { data: "fields.case_name" },
            { data: "fields.author" },
            { data: "fields.run_time" }
         ],
        //使用ajax请求
         ajax:{
             type:'GET',
             url:'../wholog/getAllLog',
             dataSrc: ''
         },

         language: {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'search': '检索:',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '暂无数据',
                'paginate': {
                    'first':      '首页',
                    'last':       '最后页',
                    'next':       '',
                    'previous':   ''
                },
                'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
                'infoEmpty': '没有数据',
                'infoFiltered': '(过滤总条数 _MAX_ 条)'
            }


     });/*table end*/
 // Apply the search
    $('#log_search_input').on( 'keyup', function () {
        logtable.search( this.value ).draw();
    } );

}/*load Data end*/

/* 
function search(logdata) {
    var data = logdata['res'];
    $.each(data, function (i, n) {
        var row = $("#logData").clone();
        row.find("#id").text(n.id);
        row.find("#case-name").text(n.caseName);
        row.find("#log-data").text(n.logData);
        row.find("#author").text(n.author);
        row.find("#begin-time").text(n.beginTime);
        row.appendTo("#tb-log");//添加到模板的容器中
    });
}
*/




