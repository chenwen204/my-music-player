var remainingAttempts = 3; // 最大登录尝试次数

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault(); // 阻止表单默认提交行为
  handleLogin(); // 调用登录处理函数
});

function handleLogin() {
  var username = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPassword").value;

  // 从localStorage获取注册的用户名和密码
  var registeredUsername = localStorage.getItem('registeredUsername');
  var registeredPassword = localStorage.getItem('registeredPassword');

  // 如果localStorage中没有用户注册信息，则使用默认账号
  if (!registeredUsername || !registeredPassword) {
    registeredUsername = 'user';
    registeredPassword = '001';
  }

  if (username === registeredUsername && password === registeredPassword) {
    alert("登录成功");
    localStorage.setItem("loggedIn", "true"); // 设置登录状态
    window.location.href = "index.html"; // 重定向到个人简介页面
    return false; // 阻止表单默认提交动作
  } else {
    remainingAttempts--;

    if (remainingAttempts > 0) {
      alert("用户名或密码错误。还剩下 " + remainingAttempts + " 次机会");
    } else {
      alert("登录失败次数过多，页面即将关闭");
      window.close(); // 关闭当前窗口
    }

    return false; // 阻止表单提交以防止页面刷新
  }
}


function aa() {
  var z = setInterval("sj()", 1000);
}

function sj() {
  var today = new Date();
  var n = today.getFullYear();
  var y = today.getMonth() + 1;
  var r = today.getDate();
  var s = today.getHours();
  var f = today.getMinutes();
  var m = today.getSeconds();
  var i = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
  var x = i[today.getDay()];
  document.getElementById("rq").innerHTML = (n + "/" + y + "/" + r + "/" + x + "/" + s + "/" + f + "/" + m);
}
