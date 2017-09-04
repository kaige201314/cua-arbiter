function deleteAllCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}



$(document).ready(function () {



});

/**
 * 验证是否可编辑
 * @constructor
 */
function ValidateEditWebSocket(fileName) {
    if ("WebSocket" in window) {
        let socket = new WebSocket("ws://" + window.location.host + "/arbiter/");
        socket.onmessage = function (e) {
            console.log(e.data);

        };
        socket.onopen = function () {
            //发送validateEdit 0 查询
            socket.send("validateEdit 0 " + fileName);
        };
        // Call onopen directly if socket is already open
        if (socket.readyState === WebSocket.OPEN)
            socket.onopen();
    }
    else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
}

function RunWebSocketTest() {
    let casename = getCaseName();
    if ("WebSocket" in window) {
        let socket = new WebSocket("ws://" + window.location.host + "/arbiter/");
        socket.onmessage = function (e) {
            document.getElementById("insert").innerHTML += "<li><a>" + e.data + "</a></li>";

        };
        socket.onopen = function () {
            socket.send("runCase " + casename);
        };
        // Call onopen directly if socket is already open
        if (socket.readyState === WebSocket.OPEN)
            socket.onopen();
    }
    else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
}

/**
 * 获取caseName
 * @returns {jQuery}
 */
function getCaseName() {
    return $("#casepath").attr("casepath");

}

function setBtn(type) {
    if (type === "save") {
        //设置为保存按钮状态
        $("#edit").find("span").text("保存");
        $("#save-edit-icon").text("done");
    }
    if (type === "edit") {
        //设置为保存按钮状态
        $("#edit").find("span").text("编辑");
        $("#save-edit-icon").text("mode_edit");
    }
}

let process_value = 0;
let process_speed = 0;//0正常，1代表收到保存成功，加快
function doProgress() {
    if (process_speed === 0) {
        if (process_value === 95) {//正常速度下，如果进度95%，则不继续加载
            setTimeout(doProgress, 300);
            setProgress(process_value);
        } else if (process_value < 65) {
            setTimeout(doProgress, 300);
            setProgress(process_value);
            process_value++;
        } else if (process_value < 85) {
            setTimeout(doProgress, 100);
            setProgress(process_value);
            process_value++;
        } else if (process_value < 95) {
            setTimeout(doProgress, 300);
            setProgress(process_value);
            process_value++;
        }

    } else if (process_speed === 1) {//保存成功信号，加快速度
        //如果加到100，stop
        if (process_value === 100) {
            setProgress(process_value);
            $(".modal-save-footer").show();
            let timeoutid = setTimeout(doProgress, 300);
            clearTimeout(timeoutid);
            process_value = 0;
            process_speed = 0;
        } else {
            setProgress(process_value);
            setTimeout(doProgress, 10);
            process_value++;
        }

    }
}

/**
 * 解决csrf问题
 * @param name
 * @returns {*}
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/*进度条*/
function setProgress(progress) {
    let progress_id = "pro-loading";
    if (progress) {
        let jq_progress_id = $("#" + progress_id + " > div");
        jq_progress_id.css("width", String(progress) + "%"); //控制#loading div宽度
        // $("#" + progress_id + " > div").html(String(progress) + "%"); //显示百分比
        jq_progress_id.html("保存中");
    }
}
