var result,month;

function compute(month){
  return new Promise(resolve=>{
    chrome.extension.sendMessage({url: document.URL,month}, function (response) {
      console.log(response);
      result = response;
      resolve(response)
    });
  })
  
}

chrome.runtime.onMessage.addListener(//监听扩展程序进程或内容脚本发送请求的请求
    function (request, sender, sendResponse) {
        month = request.month
        if (request.action == "send") {
            compute(month).then(res=>{
              setTimeout(() => {
                sendResponse(result)
              }, 100);
            });
        }
        return true;
      } 
)