$(document).ready(function () {
    let username = getusername();
    new Vue({
        el: '#username',
        data: {
            message: username
        }
    });
    fetch("./getCaseList",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(response => {
        if (response.status !== 200) {
            console.log("存在一个问题，状态码为：" + response.status);
            return false;
        }
        else
            return response.json();
    }).then(
        json => {
            let model_list = json["model_list"];
            let case_list = json["case_list"];
            let case_app = new Vue({
                props: ['todo'],
                el: '#nav-slide-case',
                data: {
                    caseList: case_list
                }
            });
            let slide_app = new Vue({
                props: ['todo'],
                el: '#nav-slide',
                data: {
                    modelList: model_list
                }
            });
            $('.collapsible').collapsible();
            $(".collapsible-body li").click(function () {
                //guide 显示到隐藏，root-case从隐藏到显示
                $("#root-guide"
                ).hide();
                $("#root-case").show();
                $(".collapsible-body .active").removeClass("active");
                $(event.currentTarget).addClass("active");
                // let casepath = $(event.currentTarget).children("a").attr("case-role").split("/");
                let casefullname = $(event.currentTarget).children("a").attr("case-role");
                $("#casepath").attr("casepath", casefullname);//给自定义casepath属性设置为路径全名
                //设置标题显示用例类名+方法名
                let caseclassname = casefullname.split(":")[1];
                $("#case_sumary_name").text(caseclassname);
                //读取用例文件,并设置codeContent
                let caseNamePathList = casefullname.split("/");//获取用例路径，解析内容
                let caseNamePath = caseNamePathList[caseNamePathList.length - 1].split(":")[0].split(".").join("/") + ".py";
                document.getElementById("code-content").style.fontSize = "14px";
                let codeContent = ace.edit("code-content");
                codeContent.setTheme("ace/theme/github");
                codeContent.setReadOnly(true);//设置只读
                codeContent.session.setMode("ace/mode/python");
                setBtn("edit");
                /*查询可编辑状态*/
                new ValidateEditWebSocket(caseNamePath);
                let xhr = new XMLHttpRequest();
                xhr.open('GET', '/static/' + caseNamePath, true);
                xhr.setRequestHeader("If-Modified-Since", "0");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        codeContent.setValue(xhr.responseText, -1);//设置显示内容，并将光标移动到start处
                        //文件加载成功后，监听按钮点击
                        $("#run").unbind('click').click(function () {
                            const storage = window.localStorage;
                            if (!storage['token']) {
                                window.location.href = "login";
                            }
                            RunWebSocketTest();
                            $('#modal_log').modal('open');
                        });
                        let edit_selector = $("#edit");
                        //编辑
                        edit_selector.unbind('click').click(function () {
                            const storage = window.localStorage;
                            if (!storage['token']) {
                                window.location.href = "login";
                            }
                            let codeContent = ace.edit("code-content");
                            if (edit_selector.find("span").text() === "编辑") {
                                new ValidateEditWebSocket();
                                /* 根据返回的结果处理*/
                                codeContent.setReadOnly(false);//设置为可编辑模式
                                codeContent.setTheme("ace/theme/chrome");//设置可编辑状态主题
                                return setBtn("save");
                            } else if ($("#edit").find("span").text() === "保存") {
                                //点击保存，不刷新按钮，调后端保存文件，成功后返回
                                //打开保存进度框
                                let modalConfig = {
                                    dismissible: false, // Modal can be dismissed by clicking outside of the modal
                                    opacity: .7,
                                    complete: function () {
                                        $("#pro-loading" + " > div").html("");
                                    } // Callback for Modal close// Opacity of modal background
                                };
                                /*设置保存模态框效果*/
                                $("#modal-save").modal("open", modalConfig);
                                //设置正常速度魔兽进度条加载
                                doProgress();

                                let newCodeContent = codeContent.getValue();
                                fetch("/arbiter/save/",
                                    {
                                        method: "POST",
                                        credentials: "same-origin",
                                        headers: {
                                            "X-CSRFToken": getCookie("csrftoken"),
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({casepath: casefullname, content: newCodeContent})
                                    }).then(function (response) {
                                    if (response.status !== 200) {
                                        console.log("存在一个问题，状态码为：" + response.status);
                                        return;
                                    }
                                    //检查响应文本
                                    response.json().then(function (data) {
                                        if (data['result'] === "ok") {
                                            process_speed = 1;

                                        } else {
                                            alert("保存失败！");
                                        }
                                    });
                                }).catch(function (err) {
                                    console.log("Fetch错误:" + err);

                                })
                            }
                        });
                    }
                };
                xhr.send(null);
            });
            $("#logout").click(function (e) {

                e.preventDefault(e);
                deleteAllCookies();
                let storage = window.localStorage;
                storage.clear();
                window.location.href = ".";
            });
        }
    );

});