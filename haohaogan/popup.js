
$(function(){
    var state = $('#state');
    var telnet = $('#telnet');
    var log = $('#log');

    $('#send').click(function () {//给对象绑定事件
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {//获取当前tab
            //向tab发送请求
            chrome.tabs.sendMessage(tab[0].id, { 
                action: "send",
                month: $('#month').val(),
            }, function (response) {
                console.log(response);
                telnet.html(response.time);
                log.html(response.log);
            });
        });
    });
})
