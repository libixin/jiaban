
// var kw = $('#kw');
// var form = $('#form');
var webpwd,mac;
chrome.extension.sendMessage({'username': 'wuxi','password':'wuxi2','url':document.location.origin},function(response){
    console.log(response); // 将返回信息打印到控制台里
    webpwd = response.webpwd;
    mac = response.mac;
});
// chrome.runtime.sendMessage({'webpwd':webpwd},function(response){
//     // console.log(response); // 将返回信息打印到控制台里
//     // webpwd = response.webpwd
// });
function login(name,pass){
    try{
        document.getElementById("logout").click();
        document.getElementsByClassName("fy-alert-btn")[0].click();
        return
    }catch{
    }
    
    try{
        document.getElementById("loginBtn").click();
    }catch{
        
    }
    setTimeout(() => {

        document.getElementById("username").value=name;
        document.getElementById("passwd").value=pass;
        document.getElementById("btnLogin").click();
    }, 500);
}
chrome.runtime.onMessage.addListener(//监听扩展程序进程或内容脚本发送请求的请求
    function (request, sender, sendResponse) {
        if (request.action == "submit") {
            login('admin','admin');
            sendResponse({state:'普通登录'})
        }
        if (request.action == "submit2") {
            login('senior','123456');
            sendResponse({state:'高级登录'})
        }
        if (request.action == "submit3") {
            login('gztzadmin','83583000');
            sendResponse({state:'超级登录'})
        }
        if (request.action == "submit4") {
            login('root','admin');
            sendResponse({state:'高级登录'})
        }
        if (request.action == "submit5") {
            login('superadmin',webpwd);
            sendResponse({state:'超级登录'})
        }
        if (request.action == "submit7") {
            login('admin','admin');
            sendResponse({state:'普通登录'})
        }
        if (request.action == "submit8") {
            login('Gztz@83583#',webpwd);
            sendResponse({state:'X28超级登录'})
        }
        if (request.action == "submit9") {
            login('gztzadmin',mac);
            sendResponse({state:'S90超级登录'})
        }
        if (request.action == "send") {
            sendResponse({webpwd:webpwd})
        }
        if (request.action == "send2") {
            sendResponse({mac:mac})
        }
        if (request.action == "submit6") {
            login(request.name,request.pass);
            sendResponse({state:'自定义账号登录'})
        }
    }
);