




(function($) {

  let $citiesField = jQuery("#city");
  let cityName = "";
  let location = "Lviv";




  getSuccessGeo = function(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const geocodingAPIKey = 'AIzaSyDF-M0gmMFMWJ2zO0tfKNs8Y0zbRUJaACA';
    
    
    const geocodingAPI = $.ajax({
      type: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geocodingAPIKey}&language=en`
    });
  
  
    $.when(geocodingAPI).done((loc) => {
      const currentLocation = loc.results[0].address_components[3].long_name;
      location = currentLocation;
      location = location.replace(/'/g, '');
      $(".card-city").whether({ city: location });
    
      $('.spinner').css('display', 'none');
    }).fail(() => {
      $('.spinner').css('display', 'none');
      $('.error-message').html('<span>Unable to load current weather. </span>').css('display', 'block');
    });
  }
  
  getError = function(err) {
    $('.spinner').css('display', 'none');
    $('.error-message').html(`<span class="fa fa-exclamation-circle fa-lg fa-fw"></span> ${err.message}.`).css('display', 'block');
  }
  
  navigator.geolocation.getCurrentPosition(getSuccessGeo, getError);
  
  
  
  


  $.fn.whether = function(options) {
    const _this = this;
    const weatherAPIKey = '1cbb9d3c2d3d13f34be51c51afe4b6cb';
    $.ajax(
      `http://api.openweathermap.org/data/2.5/weather?appid=${weatherAPIKey}&q=` +
        options.city +
        `&units=metric`
    ).done(function(resp) {
      const temp = resp.main.temp;
      const temp_min = resp.main.temp_min;
      const temp_max = resp.main.temp_max;
      const weatherMain = resp.weather[0].main;
      const weatherMainDescription = resp.weather[0].description;
      _this.find(".card-temp").text(temp);
      _this.find(".card-temp-min").text('min ' + temp_min);
      _this.find(".card-temp-max").text('max ' + temp_max);
      
      _this.find(".card-info").text(weatherMain + ', ' + weatherMainDescription);
    });
    return this;
  };
  
  $(".card-city").whether({ city: location });
  


  split = function (val) {
    return val.split(/,\s*/);
  }
  
  extractLast = function (term) {
    return split(term).pop();
  }
  
  extractFirst = function (term) {
    return split(term)[0];
  }

  $citiesField.autocomplete({
    source: function (request, response) {
        jQuery.getJSON(
            "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + extractLast(request.term),
            function (data) {
                response(data);
            }
        );
    },
    minLength: 3,
    select: function (event, ui) {
        let selectedObj = ui.item;
        placeName = selectedObj.value;
        if (typeof placeName == "undefined") placeName = $citiesField.val();

        if (placeName) {
            let terms = split($citiesField.val());
            // remove the current input
            terms.pop();
            // add the selected item (city only)
            terms.push(extractFirst(placeName));
            // add placeholder to get the full city name
            terms.push("");
            $citiesField.val(terms.join(""));
            cityName = terms[0];
           
            $(".card-city").whether({ city: cityName });
        }

        return false;
    },
    focus: function() {
        // prevent value inserted on focus
        return false;
    },
  });

  //$citiesField.autocomplete("option", "delay", 100);

 


})(jQuery);



