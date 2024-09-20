$(document).ready(function () {
  // 首页的三次循环操作
  for (let i = 0; i < 3; i++) {
    $("#loop").append(`<p>第 ${i + 1} 次操作</p>`);
  }

  // 购物车功能示例
  let itemCount = 0;

  $("#add-item").click(function () {
    itemCount++;
    $("#cart-items").append(`<p>商品 ${itemCount}</p>`);
  });

  $("#remove-item").click(function () {
    if (itemCount > 0) {
      $("#cart-items p:last-child").remove();
      itemCount--;
    }
  });
});


