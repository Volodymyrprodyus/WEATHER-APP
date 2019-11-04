
(function($) {

  let $citiesField = jQuery("#city");
  let cityName = "";
  let location = "Lviv";
  let cityId = "";

  getSuccessGeo = function(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const geocodingAPIKey = 'AIzaSyDF-M0gmMFMWJ2zO0tfKNs8Y0zbRUJaACA';
    
    const geocodingAPI = $.ajax({
      type: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geocodingAPIKey}&language=en`
    });

    getByGoogle(lat, lng);
  
    $.when(geocodingAPI).done((loc) => {
      const currentLocation = loc.results[0].address_components[3].long_name;
      location = currentLocation;
      location = location.replace(/'/g, '');
      $(".card-city").whether({ city: location });
      $(".current-location-text").text(currentLocation);
    
      $('.spinner').css('display', 'none');
    }).fail(() => {
      $('.spinner').css('display', 'none');
      $('.error-message').html('<span>Unable to load current weather. </span>').css('display', 'block');
    });
  }
  
  getError = function(err) {
    $('.spinner').css('display', 'none');
    $('.error-message').html(`<span></span> ${err.message}.`).css('display', 'block');
  }
  
  navigator.geolocation.getCurrentPosition(getSuccessGeo, getError);
  

  getByGoogle = (latGoogle, lngGoogle) => {

    const mapOptions = {
        zoom: 10,
        type: "ROADMAP",
        center: new google.maps.LatLng(latGoogle, lngGoogle)
    };
    
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const geocoder = new google.maps.Geocoder();  
    let bounds;
            $("#searchbox").autocomplete({
            source: function(request, response) {
  
                if (geocoder == null){
                    geocoder = new google.maps.Geocoder();
                }
                geocoder.geocode( {'address': request.term }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
    
                        const searchLoc = results[0].geometry.location;
                        const lat = results[0].geometry.location.lat();
                        const lng = results[0].geometry.location.lng();
                        const latlng = new google.maps.LatLng(lat, lng);
                        bounds = results[0].geometry.bounds;
    
                        geocoder.geocode({'latLng': latlng}, function(results1, status1) {
                            if (status1 == google.maps.GeocoderStatus.OK) {
                                if (results1[1]) {
                                    response($.map(results1, function(loc) {
                                        
                                        return {
                                            label : loc.formatted_address,
                                            value : loc.formatted_address,
                                            bounds : loc.geometry.bounds
                                        }
                                    }));
                                }
                            }
                        });
                    }
                });
            },
            select: function(event, ui){
                const pos = ui.item.position;
                const lct = ui.item.locType;
                bounds = ui.item.bounds;
        
                if (bounds){
                    map.fitBounds(bounds);
                }
                const firstWord = ui.item.label.match(/([a-zа-яё]+)/i);
                $(".card-city").whether({ city: firstWord[0] });
            }
        });
};

  
  


  $.fn.whether = function(options) {
    const _this = this;
    const weatherAPIKey = '1cbb9d3c2d3d13f34be51c51afe4b6cb';
    $.ajax(
      `http://api.openweathermap.org/data/2.5/weather?appid=${weatherAPIKey}&q=${options.city}&units=metric`
    ).done(function(resp) {
      const temp = Math.round((resp.main.temp)*10)/10;
      const temp_min =  Math.round((resp.main.temp_min)*10)/10;
      const temp_max = Math.round((resp.main.temp_max)*10)/10;
      const weatherMain = resp.weather[0].main;
      const weatherMainDescription = resp.weather[0].description;
      const latG = resp.coord.lat;
      const lonG = resp.coord.lon;

      let iconCode = resp.weather[0].icon;
      let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      $(".icon").html("<img src='" + iconUrl  + "'>");
      
      _this.find(".card-header").text(options.city);
      _this.find(".card-temp").text(temp);
      _this.find(".card-info").text(weatherMain + ', ' + weatherMainDescription);



     const newPropInfo = {
      weather: resp.weather[0].main,
      temperature: Math.round((resp.main.temp)*10),
      min: Math.round((resp.main.temp_min)*10)/10,
      max: Math.round((resp.main.temp_max)*10)/10,
      humidity: resp.main.humidity,
      pressure: resp.main.pressure,
      windSpeed: resp.wind.speed,
      windDir: resp.wind.deg
    }

    const newPropDef = {
      temperature: "°C",
      humidity: "%",
      pressure: "hPa",
      windSpeed: "m/s",
      windDegrees: "WSW"
    }
      
      renderWetherList(resp.id, newPropInfo, newPropDef);
      getByGoogle(latG, lonG);
    });
    return this;
  };
  $(".card-city").whether({ city: location });
  

  renderWetherList = (respId, obj, objDef) => {
    if (respId !== cityId) {
      $(".card-transparent").empty();
      for (let prop in obj) {
        infoItem = $(`<div class="card-info-item"></div>`);
        paramsName = $(`<p class="card-add-info"></p>`).text(prop );
        paramsProp = $(`<p class="card-add-info"></p>`).text(obj[prop]);

        infoItem.append(paramsName);
        infoItem.append(paramsProp);

        if (prop == 'temperature' || prop == 'min' || prop == 'max' ) {
          paramsDef = $(`<p class="card-add-info"></p>`).text(objDef.temperature);
          infoItem.append(paramsDef);
        }
        if (prop == 'humidity') {
          paramsDef = $(`<p class="card-add-info"></p>`).text(objDef.humidity);
          infoItem.append(paramsDef);
        }
        if (prop == 'pressure') {
          paramsDef = $(`<p class="card-add-info"></p>`).text(objDef.pressure);
          infoItem.append(paramsDef);
        }
        if (prop == 'windSpeed') {
          paramsDef = $(`<p class="card-add-info"></p>`).text(objDef.windSpeed);
          infoItem.append(paramsDef);
        }
        if (prop == 'windDir') {
          paramsDef = $(`<p class="card-add-info"></p>`).text(objDef.windDir);
          infoItem.append(paramsDef);
        }
        $(".card-transparent").append(infoItem);
      }
      cityId = respId;
    }
  };

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

  $citiesField.autocomplete("option", "delay", 100);

})(jQuery);



