$(function() {
  var needs = $('.needs-slider')[0]
  var $input = $("#slider");
  var $label = $input.next('label');
  input = $input[0]
  label = $label[0];
  // label value = input value
  // 100 的label value = 720度 ===> 1 度 = 100 / 720value
  var currentDeg = $input.css('--thumb-rotate')
  var currentDegNum = Number(currentDeg.slice(0, -5))
  var value = Math.round(100 / 720 * currentDegNum)
  input.value = value
  label.innerHTML = value
  input.addEventListener("input", event => {
    const value = Number(input.value) / 100;
    input.style.setProperty("--thumb-rotate", `${value * 720}deg`);
    label.innerHTML = Math.round(value * 100);
  });
})
