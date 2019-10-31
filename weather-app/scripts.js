

(function($) {
  $.fn.whether = function(options) {
    const _this = this;
    $.ajax(
      "http://api.openweathermap.org/data/2.5/weather?appid=1cbb9d3c2d3d13f34be51c51afe4b6cb&q=" +
        options.city +
        ",ua&units=metric"
    ).done(function(resp) {
      const temp = resp.main.temp;
      _this.find(".card-temp").text(temp);
    });
    return this;
  };
})(jQuery);

$(".card-lviv").whether({ city: "lviv" });
