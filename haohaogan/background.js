chrome.extension.onMessage.addListener(
  (request, sender, sendResponse) => {
var data,cookieHeader;

    console.log(request);
    new Promise((resolve,reject)=>{
      chrome.cookies.getAll({
        url: request.url
      },  async (cks) => {
        console.log(cks,333333333);
        let cookies = cks.map((item) => {
            return item.name + "=" + item.value
          }).join(";") + ";";
          console.log(cookies);
          try {
            data = await getData(cookies,request.month).then(res=>{
              return res
            });

          } catch (error) {
            data = "别乱输！！!"
          }
        
        setTimeout(() => {
          sendResponse(data);
          
        }, 100);
      });
    })
    return true; //至关重要
  });

  function getData(cookies,month) {
	  var year = new Date().getFullYear();
     return new Promise((resolve, reject) => {
      $.ajax({
        url: 'http://113.98.195.201:8998/api/kq/myattendance/getHrmKQMonthReportInfo',
        type: 'POST',
        data: `typevalue=${year}-${month}&loaddata=1&type=2&`,
        dataType: 'text',
        headers:{
          "Content-Type":"application/x-www-form-urlencoded; charset=utf-8",
          "Cookie":cookies
        }
      }).then(function(data){
        var data = JSON.parse(data);
        console.log(data.result);
        resolve(myFunction(data.result));
      })
     })
    
  }
  function getMyDay(date){
    var week;
    if(date.getDay()==0) week=0;
    if(date.getDay()==1) week=1;
    if(date.getDay()==2) week=2;
    if(date.getDay()==3) week=3;
    if(date.getDay()==4) week=4;
    if(date.getDay()==5) week=5;
    if(date.getDay()==6) week=6;
    return week;
}
function myFunction(data) {
		var all = 0;
		var log = "";
    // var obj = document.getElementById("numb").value;
		// obj = JSON.parse(obj);
    var data = data;
    try {
      var length = Object.keys(data).length;
      
    } catch (error) {
      var fail = {
        time:"别瞎鸡儿乱输！！!",
        log:"别瞎鸡儿乱输！！!"
      }
      return fail
    }
    for (var i = 1; i < length+1; i++) {
    	if(data[i].signInfo!=undefined && data[i].signInfo.length==2 && data[i].isWorkDay&& +(data[i].signInfo[1].signTime.substr(0,2))>17){
    		var tmp0 = "18:00:00";
    		var tmp1 = "18:30:00";
    		var tmp2 = "20:30:00";
    		var date = data[i].date;
    		var end = data[i].signInfo[1].signTime;
    		var startTime0 = Date.parse(date+' '+tmp0);
    		var startTime1 = Date.parse(date+' '+tmp1);

    		var endTime1 = Date.parse(date+' '+tmp2);
    		var endTime2 = Date.parse(date+' '+end);
    		
    		var difference = endTime2-endTime1>=0?endTime2-startTime1:endTime2-startTime0;

				if(isNaN(difference)) difference = 0;
				
				console.log((difference/3600000).toFixed(3),"—————————"+data[i].date);

				log = log + (difference/3600000).toFixed(3)+"—————————"+data[i].date + "\n" + "\n";

				if(+(difference/3600000).toFixed(3)<2 && getMyDay(new Date(data[i].date))!=5){
					log = log + data[i].date+"异常，是不是没打卡叼毛" + "\n"+ "\n";
				}
				all = all+difference;

    	}else if(!!data[i].signInfo && !data[i].isWorkDay){
				var date = data[i].date;
				var start = data[i].signInfo[0].signTime;
    		var end = data[i].signInfo[1].signTime;
			if(start < '08:30:00') start = '08:30:00'
				var startTime = Date.parse(date+' '+start);
      
    		var endTime = Date.parse(date+' '+end);

				var difference = endTime - startTime;
        if(end > '13:30:00' && start < '12:00:00'){
          difference = difference - 5400000
        }
        if(end > '20:30:00'){
          difference = difference - 1800000
        }
				if(isNaN(difference)) difference = 0;

				log = log + (difference/3600000).toFixed(3)+" 周末 "+"—————————"+data[i].date + "\n"+ "\n";

				if(+(difference/3600000).toFixed(3)<2){
					log = log + data[i].date+"异常，是不是没打卡叼毛" + "\n"+ "\n";
				}
			if(+(difference/3600000).toFixed(3)>8){
				log = log + data[i].date+"异常，你太卷了，卷B" + "\n"+ "\n";
			}
			all = all+difference;
				
			}
    }
    console.log((all/3600000).toFixed(3));
    var result = {
      time:(all/3600000).toFixed(3),
      log:log
    }
    return result;
		document.getElementById("demo").innerHTML = (all/3600000).toFixed(3);
    document.getElementById("log").innerHTML = log;
}

// chrome.extension.onMessage.addListener(function(objRequest, _, sendResponse){
//   function ajax(url, params, callBack,callBack2) {
//     $.ajax({
//         url : url,
//         type : 'POST',
//         data: params,
//         dataType : "text",
//         success : function(json) {
//             callBack(json);
//         },
//         error : function(err) {
//           callBack2(err);
//         }
//     });
//   }
//   function ajaxPost(url, params, callBack,callBack2){
//     ajax(url,params,callBack,callBack2);
//   }

//   var name = objRequest.username;
//   var pass = objRequest.password;
//   var webpwd,mac;
 

//   // 将信息能过Ajax发送到服务器
//   // $.ajax({
//   //     url: 'http://192.168.80.6:8081/login',
//   //     type: 'POST',
//   //     data: {'username': name,'password':pass},
//   //     dataType: 'json',
//   // }).then(function(data){
//   //   console.log(data.data,1111111);
//   //     // 将正确信息返回content_script
//   //     sendResponse({'status': 200});
//   // }, function(err){
//   //   // console.log(err,222222222);
//   //     // 将错误信息返回content_script
//   //     sendResponse({'status': 500});
//   // });
//   if(objRequest.url.indexOf('127.0.0.1')>-1){
//     objRequest.url = 'http://192.168.0.1'
//   }
//   var url = objRequest.url+'/cgi-bin/http.cgi';
//   var json = {cmd:207,method:"GET",language:"CN",sessionId:""};
//   // ajaxPost(url,JSON.stringify(json),function(data){
//   //   console.log(data,333333);
//   // },function(err){

//   // })
//   $.ajax({
//     url: objRequest.url+'/cgi-bin/http.cgi',
//     type: 'POST',
//     data: JSON.stringify(json),
//     dataType: 'text',
//   }).then(function(data){
//     var form = JSON.parse(data);
//       $.ajax({
//         url: 'http://192.168.80.6:8081/tz/getpwdbykey',
//         type: 'POST',
//         data: {'imei':form.module_imei,'mac':form.lan_mac},
//         dataType: 'text',
//       }).then(function(data){
//         if(!(data instanceof Object)){
//           console.log(111111111);
//           $.ajax({
//               url: 'http://192.168.80.6:8081/login',
//               type: 'POST',
//               data: {'username': name,'password':pass},
//               dataType: 'text',
//           }).then(function(data){
//             console.log(444444444);
//             $.ajax({
//               url: 'http://192.168.80.6:8081/tz/getpwdbykey',
//               type: 'POST',
//               data: {'imei':form.module_imei,'mac':form.lan_mac},
//               dataType: 'text',
//             }).then(function(data){
//               var data3 = JSON.parse(data);
//               webpwd = data3.webpwd;
//               mac = data3.telnetpwd
//                 // 将正确信息返回content_script
//                 setTimeout(function(){
//                   sendResponse({webpwd: webpwd,mac:mac});
//                 },100);
              
//             }, function(err){
//               console.log('无法访问');
//                 // 将错误信息返回content_script
//                 sendResponse({'status': 501});
//             });
//           }, function(err){
//             console.log('重来了',err);
//             //从来
//           $.ajax({
//             url: 'http://192.168.80.6:8081/tz/getpwdbykey',
//             type: 'POST',
//             data: {'imei':form.module_imei,'mac':form.lan_mac},
//             dataType: 'text',
//           }).then(function(data){
//             var data3 = JSON.parse(data);
//             webpwd = data3.webpwd;
//             mac = data3.telnetpwd
//               // 将正确信息返回content_script
//               setTimeout(function(){
//                 sendResponse({webpwd: webpwd,mac:mac});
//               },100);
            
//           }, function(err){
//               // 将错误信息返回content_script
//               sendResponse({'status': 501});
//           });
//           });
          
//         }else{
//           console.log(22222222);
//           var data2 = JSON.parse(data);
//           webpwd = data2.webpwd;
//           mac = data2.telnetpwd
//             // 将正确信息返回content_script
//             setTimeout(function(){
//               sendResponse({webpwd: webpwd,mac:mac});
//             },100);
//         }
        
//       }, function(err){
//         console.log(err,33333333);
//           // 将错误信息返回content_script
//           sendResponse({'status': 501});
//       });
//   }, function(err){
//     console.log(err,222222222);
//       // 将错误信息返回content_script
//       sendResponse({'status': 502});
//   });
//   return true;
// });
