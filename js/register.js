document.getElementById('registerForm').addEventListener('submit', function (event) {
  event.preventDefault();

  var username = document.getElementById('registerUsername').value;
  var password = document.getElementById('registerPassword').value;
  var confirmPassword = document.getElementById('confirmPassword').value;

  // 检查密码是否一致
  if (password !== confirmPassword) {
    alert("密码和确认密码不匹配！");
    return;
  }

  // 保存注册信息到localStorage
  localStorage.setItem('registeredUsername', username);
  localStorage.setItem('registeredPassword', password);

  alert("注册成功！请登录");
  window.location.href = 'login.html'; // 跳转到登录页面
});