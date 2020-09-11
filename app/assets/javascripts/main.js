/*global $*/
/*global google*/
/*global navigator*/  

var marker;
function showGurunaviInformation(results, marker_list) {
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    var latLng = new google.maps.LatLng(result.latitude, result.longitude);
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/micons/red.png',
        scaledSize: new google.maps.Size(30, 30)
      },
      label: {
      text: String(i+1),
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold'
      },
      animation: google.maps.Animation.DROP
    });
    marker_list.push(marker);
  
    google.maps.event.addListener(marker, 'click', (function(url) {
      return function(){ window.open(url); };
    })(result.url));
  
    $(document).on('click', `#favorite-${i}`, function(event) {
      const shop_data = {
        name: result.name,
        url: result.url,
        image_url: result.image_url.shop_image1,
        opentime: result.opentime
      };
      event.preventDefault();
        $.ajax('/shops', {
          type: 'POST',
          data: shop_data,
          datatype: 'json',
          success: function() {
            console.log('お気に入り登録に成功しました。');
            $(`#favorite-${i}`).hide();
          },
          error: function() {
            console.log('お気に入り登録に失敗しました。');
          }
        });
    });
  
    $('<div class="each-shop col-md-5 offset-1"><a href="' + result.url + '" class="shop-link" target="_blank"><img class="shop-img" src="' + result.image_url.shop_image1 + '" alt="店舗画像なし"><span class="shop-content"><span class="shop-name">' + String(i+1) + " " + result.name + '</span><span class="shop-time">営業時間：' + result.opentime + '</span></span></a><button id="favorite-'+ i +'" type="button" class="btn btn-success btn-sm">お気に入り登録する</button></div>')
      .appendTo('#shop-list');
    
    $('<div class="each-shop col-md-5 offset-1"><a href="' + result.url + '" class="shop-link" target="_blank"><img class="shop-img" src="' + result.image_url.shop_image1 + '" alt="店舗画像なし"><span class="shop-content"><span class="shop-name">' + String(i+1) + " " + result.name + '</span><span class="shop-time">営業時間：' + result.opentime + '</span></span></a></div>')
      .appendTo('#trial-shop-list');
  }
  $('.gurunavi-credit').show();
}

var map;
function getGurunaviInformationFromCurrentLocation(category, range, hit_per_page, freeword, preference) {
  $('.loading-icon').show();
  $('#shop-list').empty();
  $('#trial-shop-list').empty();
  $('.gurunavi-credit').hide();
  navigator.geolocation.getCurrentPosition(
    function successGetCurrentPosition(pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      var latLng = new google.maps.LatLng(lat, lng);
      map = new google.maps.Map(document.getElementById("gmap"), {
        center: latLng,
        zoom: 16
      });
      new google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/micons/man.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      
      var url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/';
      var params = {
        keyid: '8fb13a6c5f06282956b747b570619917',
        category_l: category,
        latitude: lat,
        longitude: lng,
        range: range,
        hit_per_page: hit_per_page,
        freeword: freeword,
        bento: '',
        takeout: '',
        deliverly: '',
        lunch: '',
        late_lunch: '',
        lunch_desert: '',
        desert_buffet: '',
        lunch_buffet: '',
        lunch_salad_buffet: '',
        no_smoking: '',
        wifi: '',
        outret: '',
        mobilephone: '',
        card: '',
        e_money: '',
        sunday_open: '',
        parking: '',
        bottomless_cup: '',
        buffet: '',
        private_room: '',
        midnight: '',
        until_morning: '',
        breakfast: '',
        birthday_privilege: '',
        kids_menu: '',
        sports: '',
        darts: '',
        with_pet: '',
        web_reserve: ''
      };
  
      for (let i = 0; i < preference.length; i++) {
        params[preference[i]]= 1; 
      }
      
      $.getJSON( url, params, function(data) {
        console.log('実行中');
      })  
      .done(function(data) {
        console.log('成功');
        console.log(data);
        var marker_list = new google.maps.MVCArray();
        if (hit_per_page === 30) {
          var shopsarray = data.rest;
          var randomshop = shopsarray[Math.floor(Math.random() * shopsarray.length)];
          let results = [randomshop];
          showGurunaviInformation(results, marker_list);
        } else {
          let results = data.rest;
          showGurunaviInformation(results, marker_list);
        }
      })
      .fail(function(error) {
        console.log('失敗');
        var errorMessage = {
          400: '指定の条件では検索出来ません。条件を変更して再度検索してください。',
          401: 'このアクセスは許可されていません。',
          404: '指定の条件に合致する店舗が見つかりませんでした。条件を変更して再度検索してください。' ,
          405: 'このアクセスは許可されていません。',
          429: 'アクセス回数上限超過の為、検索出来ませんでした。しばらく時間を置いてから再度検索してください。',
          500: '検索中にエラーが発生しました。再度検索してください。'
        };
        alert(errorMessage[error.status]);
      })
      .always(function() {
        console.log('完了');
        $('.loading-icon').hide();
      });
    },
    function errorGetCurrentPosition(error) {
      var errorMessage = {
        1: '位置情報の使用が許可されていない為、現在位置を取得出来ませんでした。位置情報を有効にして再度検索してください。',
        2: '現在位置の取得に失敗しました。再度検索してください。',
        3: '位置情報の取得に時間がかかった為、タイムアウトされました。再度検索してください。' 
      };
      alert(errorMessage[error.code]);
      $('.loading-icon').hide();
    },
    {
      timeout: 10000,
      maximumAge: 0,
      enableHighAccuracy: true
    }
  );
}

$(document).on('click', '#random-search', function() {
  var category = null;
  for (let i = 0; i < document.range.radius.length; i++) {
    if (document.range.radius[i].checked) {
      var range = document.range.radius[i].value;
    }
  }
  var hit_per_page = 30;
  var freeword = null;
  var preference = '';
  getGurunaviInformationFromCurrentLocation(category, range, hit_per_page, freeword, preference);
});
    
$(document).on('click', '#keyword-search', function() {
  var category = null;
  for (let i = 0; i < document.range.radius.length; i++) {
    if (document.range.radius[i].checked) {
      var range = document.range.radius[i].value;
    }
  }
  var hit_per_page = 40;
  var freeword = $('#keyword').val();
  var preference = '';
  getGurunaviInformationFromCurrentLocation(category, range, hit_per_page, freeword, preference);
});

$(document).on('click', '#category-search', function() {
  var category = $('#category').val();
  for (let i = 0; i < document.range.radius.length; i++) {
    if (document.range.radius[i].checked) {
      var range = document.range.radius[i].value;
    }
  }
  var hit_per_page = 40;
  var freeword = null;
  var preference = [];
  for (let i = 0; i < document.category.preferences.length; i++) {
    if (document.category.preferences[i].checked) {
      preference.push(document.category.preferences[i].value);
    }
  }
  getGurunaviInformationFromCurrentLocation(category, range, hit_per_page, freeword, preference);
});

$(document).on('click', '#tap-search', function() {
  $('.loading-icon').show();
  navigator.geolocation.getCurrentPosition(
    function successGetCurrentPosition(pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      var latLng = new google.maps.LatLng(lat, lng);
      map = new google.maps.Map(document.getElementById("gmap"), {
        center: latLng,
        zoom: 16
      });
      new google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/micons/man.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      $('.loading-icon').hide();
      
      var marker_list = new google.maps.MVCArray();
      google.maps.event.addListener(map, 'click', (function(event) {
        marker_list.forEach(function(marker, idx) {
		      marker.setMap(null);
	      });
        $('#shop-list').empty();
        $('#trial-shop-list').empty();
        $('.gurunavi-credit').hide();
        for (let i = 0; i < document.range.radius.length; i++) {
          if (document.range.radius[i].checked) {
            var range = document.range.radius[i].value;
          }
        }
        var hit_per_page = 40;
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        var latLng = new google.maps.LatLng(lat, lng);
        marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/micons/grn-pushpin.png',
          scaledSize: new google.maps.Size(30, 30)
        }
        });
        marker_list.push(marker);
        
        var url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/';
        var params = {
          keyid: '8fb13a6c5f06282956b747b570619917',
          latitude: lat,
          longitude: lng,
          range: range,
          hit_per_page: hit_per_page
        };
        $.getJSON( url, params, function(data) {
          console.log('実行中');
        })  
        .done(function(data) {
          console.log('成功');
          console.log(data);
          var results = data.rest;
          showGurunaviInformation(results, marker_list);
        })
        .fail(function(error) {
          console.log('失敗');
          var errorMessage = {
            400: '指定の条件では検索出来ません。条件を変更して再度検索してください。',
            401: 'このアクセスは許可されていません。',
            404: '指定の条件に合致する店舗が見つかりませんでした。条件を変更して再度検索してください。' ,
            405: 'このアクセスは許可されていません。',
            429: 'アクセス回数上限超過の為、検索出来ませんでした。しばらく時間を置いてから再度検索してください。',
            500: '検索中にエラーが発生しました。再度検索してください。'
          };
          alert(errorMessage[error.status]);
        })
        .always(function() {
          console.log('完了');
        });
      }));
    },
    function errorGetCurrentPosition(error) {
      var errorMessage = {
        1: '位置情報の使用が許可されていない為、現在位置を取得出来ませんでした。位置情報を有効にして再度検索してください。',
        2: '現在位置の取得に失敗しました。再度検索してください。',
        3: '位置情報の取得に時間がかかった為、タイムアウトされました。再度検索してください。' 
      };
      alert(errorMessage[error.code]);
      $('.loading-icon').hide();
    },
    {
      timeout: 10000,
      maximumAge: 0,
      enableHighAccuracy: true
    }
  );
});

function updateButton() {
  if ($(window).scrollTop() >= 800) {
    $('.back-to-top').fadeIn();
  } else {
    $('.back-to-top').fadeOut();
  }
}

$(window).on('scroll', updateButton);

$(document).on('click', '.back-to-top', function(event) {
  event.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 600);
});

updateButton();


