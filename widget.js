let Url = `https://media-get.recosenselabs.com/v1.1/get_wordpress_client?site_domain=${window.location.hostname}`;
let siteLanguage = "";
jQuery.ajax({
  url: Url,
  dataType: "json",
  async: false,
  success: function (data) {
    localStorage.setItem("client_id", data["client_id"]);
    localStorage.setItem("client_secret", data["client_secret"]);
    siteLanguage = data["domain_details"]["language"];
  },
  error: function (err) {
    console.log(err);
  },
});

let customConfig;

jQuery.ajax({
  url: `https://media-get.recosenselabs.com/v1.1/wp_config_info?client_id=${localStorage.getItem(
    "client_id"
  )}`,
  dataType: "json",
  async: false,
  success: function (data) {
    customConfig = data["config_info"];
  },
  error: function (err) {
    console.log(err);
  },
});

var reco_client_id = localStorage.getItem("client_id");
var reco_client_secret_key = localStorage.getItem("client_secret");

function loadRecoSdk() {
  var e = document.createElement("script");
  e.setAttribute("type", "text/javascript"),
    e.setAttribute(
      "src",
      "https://sdk-prod.recosenselabs.com/wordpress-staging-sdk/wp-plugin.min.js"
    ),
    document.getElementsByTagName("head")[0].appendChild(e);
}

loadRecoSdk();

jQuery.fn.multislider = function (data, callback) {
  var $multislider = jQuery(this);
  var $msContent = $multislider.find(".cc-slider-content");
  var $msRight = $multislider.find("button.cc-slide-right-btn");
  var $msLeft = $multislider.find("button.cc-slide-left-btn");
  var $imgFirst = $msContent.find(".item:first");
  init();
  var $imgLast,
    animateDistance,
    animateSlideRight,
    animateSlideLeft,
    defaults,
    settings,
    animateDuration,
    autoSlideInterval;
  function init() {
    createSettings();
    saveData();
    selectAnimations();
  }
  $msRight.on("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
    animateSlideLeft();
  });
  $msLeft.on("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
    animateSlideRight();
  });
  jQuery(window).on("resize", findItemWidth);
  function saveData() {
    $multislider.data({
      pause: function () {
        $multislider.addClass("ms-PAUSE");
      },
      unPause: function () {
        $multislider.removeClass("ms-PAUSE");
      },
      next: function () {
        overRidePause(singleLeft);
      },
      prev: function () {
        overRidePause(singleRight);
      },
      settings: settings,
    });
  }
  function overRidePause(animation) {
    if ($multislider.hasClass("ms-PAUSE")) {
      $multislider.removeClass("ms-PAUSE");
      animation();
      $multislider.addClass("ms-PAUSE");
    } else {
      animation();
    }
  }
  function createSettings() {
    defaults = settings || {
      continuous: false,
      slideAll: false,
      interval: 2000,
      duration: 500,
      hoverPause: true,
    };
    settings = jQuery.extend({}, defaults, data);
    findItemWidth();
    animateDuration = settings.duration;
    if (
      settings.continuous !== true &&
      settings.interval !== 0 &&
      settings.interval !== false &&
      settings.autoSlide !== false
    ) {
      autoSlide();
    }
  }
  function selectAnimations() {
    if (settings.continuous) {
      settings.autoSlide = false;
    } else if (settings.slideAll) {
      animateSlideRight = $multislider.data("prevAll");
      animateSlideLeft = $multislider.data("nextAll");
    } else {
      animateSlideRight = $multislider.data("prev");
      animateSlideLeft = $multislider.data("next");
    }
  }
  function findItemWidth() {
    reTargetSlides();
    animateDistance = $imgFirst.width();
    var left = parseInt($msContent.find(".item:first").css("padding-left"));
    var right = parseInt($msContent.find(".item:first").css("padding-right"));
    if (left !== 0) {
      animateDistance += left;
    }
    if (right !== 0) {
      animateDistance += right;
    }
  }
  function reTargetSlides() {
    $imgFirst = $msContent.find(".item:first");
    $imgLast = $msContent.find(".item:last");
  }
  function isItAnimating(callback) {
    if (
      !$multislider.hasClass("ms-animating") &&
      !$multislider.hasClass("ms-HOVER") &&
      !$multislider.hasClass("ms-PAUSE")
    ) {
      $multislider.trigger("ms.before.animate");
      $multislider.addClass("ms-animating");
      callback();
    }
  }
  function doneAnimating() {
    if ($multislider.hasClass("ms-animating")) {
      $multislider.removeClass("ms-animating");
      $multislider.trigger("ms.after.animate");
    }
  }
  function singleLeft() {
    if (checkIemsCount()) {
      isItAnimating(function () {
        reTargetSlides();
        $imgFirst.animate(
          {
            marginLeft: -animateDistance,
          },
          {
            duration: animateDuration,
            easing: "swing",
            complete: function () {
              let val = jQuery($imgFirst).width();
              $imgFirst.detach().removeAttr("style").appendTo($msContent);
              jQuery($imgFirst).width(val);
              doneAnimating();
            },
          }
        );
      });
    }
  }
  function singleRight() {
    if (checkIemsCount()) {
      isItAnimating(function () {
        reTargetSlides();
        $imgLast.css("margin-left", -animateDistance).prependTo($msContent);
        $imgLast.animate(
          {
            marginLeft: 0,
          },
          {
            duration: animateDuration,
            easing: "swing",
            complete: function () {
              doneAnimating();
            },
          }
        );
      });
    }
  }
  function checkIemsCount() {
    const stat = $multislider.hasClass("cc-pwd");
    let windowSize = jQuery(window).width();
    let totalItems = $msContent.find(".item").length;
    if (windowSize <= 980) {
      if (totalItems >= 3 || (stat && totalItems >= 2)) return true;
      return false;
    } else if (windowSize > 980) {
      if ((totalItems <= 3 && !stat) || (stat && totalItems <= 2)) return false;
      return true;
    }
  }
  return $multislider;
};

let bandObj;

function getCase() {
  let data = page_info;

  if (data["status"] === "home") status = 1;
  else if (data["status"] === "page") status = 2;
  else status = 3;

  /*---------------------- Band Implementation Starts  --------------------------------*/

  var caseValue = status;

  console.log(caseValue, data);

  if (caseValue == 1) {
    getHomePageBands();
  } else if (caseValue == 2) {
    getCategoryPageBands(data["current_id"]);
  } else if (caseValue == 3) {
    getContentDetailsPageBands(data["current_id"]);
  }
}

!(function (a) {
  var b = /iPhone/i,
    c = /iPod/i,
    d = /iPad/i,
    e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
    f = /Android/i,
    g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
    h =
      /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
    i = /IEMobile/i,
    j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
    k = /BlackBerry/i,
    l = /BB10/i,
    m = /Opera Mini/i,
    n = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
    o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
    p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
    q = function (a, b) {
      return a.test(b);
    },
    r = function (a) {
      var r = a || navigator.userAgent,
        s = r.split("[FBAN");
      return (
        "undefined" != typeof s[1] && (r = s[0]),
        (s = r.split("Twitter")),
        "undefined" != typeof s[1] && (r = s[0]),
        (this.apple = {
          phone: q(b, r),
          ipod: q(c, r),
          tablet: !q(b, r) && q(d, r),
          device: q(b, r) || q(c, r) || q(d, r),
        }),
        (this.amazon = {
          phone: q(g, r),
          tablet: !q(g, r) && q(h, r),
          device: q(g, r) || q(h, r),
        }),
        (this.android = {
          phone: q(g, r) || q(e, r),
          tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)),
          device: q(g, r) || q(h, r) || q(e, r) || q(f, r),
        }),
        (this.windows = {
          phone: q(i, r),
          tablet: q(j, r),
          device: q(i, r) || q(j, r),
        }),
        (this.other = {
          blackberry: q(k, r),
          blackberry10: q(l, r),
          opera: q(m, r),
          firefox: q(o, r),
          chrome: q(n, r),
          device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r),
        }),
        (this.seven_inch = q(p, r)),
        (this.any =
          this.apple.device ||
          this.android.device ||
          this.windows.device ||
          this.other.device ||
          this.seven_inch),
        (this.phone =
          this.apple.phone || this.android.phone || this.windows.phone),
        (this.tablet =
          this.apple.tablet || this.android.tablet || this.windows.tablet),
        "undefined" == typeof window ? this : void 0
      );
    },
    s = function () {
      var a = new r();
      return (a.Class = r), a;
    };
  "undefined" != typeof module && module.exports && "undefined" == typeof window
    ? (module.exports = r)
    : "undefined" != typeof module &&
      module.exports &&
      "undefined" != typeof window
    ? (module.exports = s())
    : "function" == typeof define && define.amd
    ? define("isMobile", [], (a.isMobile = s()))
    : (a.isMobile = s());
})(this);
const platform = isMobile.any ? "mobile" : "desktop";

function getHomePageBands() {
  if (bandObj["band_info"]["home"]["suggested_for_you"]["status"] === "Added") {
    if (
      jQuery(`#${bandObj["band_info"]["home"]["suggested_for_you"]["id"]}`)
        .length
    )
      jQuery.ajax({
        url: `https://media-get.recosenselabs.com/v1.1/personalization?client_id=${localStorage.getItem(
          "client_id"
        )}&platform=${platform}&user_id=${localStorage.getItem(
          "ret-device-id"
        )}&language=${siteLanguage}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["home"]["suggested_for_you"]["band_name"]}

        </p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you" >
          <div class="cc-slider-content" id="for-you-carousal-content" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["home"]["suggested_for_you"]["id"]}`
          ).html(mainDiv);

          var band1 = "";

          for (d in data[0]["items"]) {

            let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section">
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>
            
            <div class="date-card-container">`;
            
            if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery(`#for-you-carousal-content`).html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }

  if (bandObj["band_info"]["home"]["latest-news"]["status"] === "Added") {
    if (jQuery(`#${bandObj["band_info"]["home"]["latest-news"]["id"]}`).length)
      jQuery.ajax({
        url: ` https://media-get.recosenselabs.com/v1.1/latest_assets?client_id=${localStorage.getItem(
          "client_id"
        )}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container1">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["home"]["latest-news"]["band_name"]}

        </p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you1" >
          <div class="cc-slider-content" id="for-you-carousal-content1" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(`#${bandObj["band_info"]["home"]["latest-news"]["id"]}`).html(
            mainDiv
          );

          var band1 = "";

          for (d in data[0]["items"]) {

let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
date1 = date1.split(' ')

date1 = date1[1]+' '+date1[2]+' '+date1[3];


            band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
            width: ${customConfig["card"]["width"]};
        ">
   <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
     <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
     <div class="content-wrapper-section" >
     <p class="ca-cc-tag-card-img-text" style="
    font-size: ${customConfig["image"]["image_caption_size"]};
    color: ${customConfig["image"]["image_caption_color"]};
" title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>

<div class="date-card-container">`;

if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;

band1+=`<span class="date-txt"  style="
color: ${customConfig["image"]["image_caption_color"]};
">${date1}</span>


</div>

</div>
   </div>
   </div></a>`;
          }

          jQuery("#for-you-carousal-content1").html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you1").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you1").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }

  if (bandObj["band_info"]["home"]["trending-news"]["status"] === "Added") {
    if (
      jQuery(`#${bandObj["band_info"]["home"]["trending-news"]["id"]}`).length
    )
      jQuery.ajax({
        url: `  https://media-get.recosenselabs.com/v1.1/popular_assets?client_id=${localStorage.getItem(
          "client_id"
        )}&language=${siteLanguage}&platform=${platform}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container2">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["home"]["trending-news"]["band_name"]}

        </p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you2" >
          <div class="cc-slider-content" id="for-you-carousal-content2" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["home"]["trending-news"]["id"]}`
          ).html(mainDiv);

          var band1 = "";

          for (d in data[0]["items"]) {
            let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section">
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>
            
            <div class="date-card-container">`;
            
            if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery("#for-you-carousal-content2").html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you2").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you2").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }

  if (bandObj["band_info"]["home"]["people-you-follow"]["status"] === "Added") {
    if (
      jQuery(`#${bandObj["band_info"]["home"]["people-you-follow"]["id"]}`)
        .length
    )
      jQuery.ajax({
        url: `  https://media-get.recosenselabs.com/v1.1/personalities?client_id=${localStorage.getItem(
          "client_id"
        )}&user_id=${localStorage.getItem(
          "ret-device-id"
        )}&language=${siteLanguage}&platform=${platform}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container3">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["home"]["people-you-follow"]["band_name"]}

        </p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you3" >
          <div class="cc-slider-content" id="for-you-carousal-content3" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["home"]["people-you-follow"]["id"]}`
          ).html(mainDiv);

          var band1 = "";

          for (d in data[0]["items"]) {
            let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section">
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>
            
            <div class="date-card-container">`;


            if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;
            
            
            band1+=` <span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery("#for-you-carousal-content3").html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you3").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you3").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }
}

function getCategoryPageBands(id) {
  if (
    bandObj["band_info"]["category"]["suggested-for-you-category"]["status"] ===
    "Added"
  ) {
    if (
      jQuery(
        `#${bandObj["band_info"]["category"]["suggested-for-you-category"]["id"]}`
      ).length
    )
      jQuery.ajax({
        url: `https://media-get.recosenselabs.com/v1.1/personalization?client_id=${localStorage.getItem(
          "client_id"
        )}&platform=${platform}&user_id=${localStorage.getItem(
          "ret-device-id"
        )}&language=${siteLanguage}&category=${id}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["category"]["suggested-for-you-category"]["band_name"]}</p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you" >
          <div class="cc-slider-content" id="for-you-carousal-content" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["category"]["suggested-for-you-category"]["id"]}`
          ).html(mainDiv);

          var band1 = "";

          for (d in data[0]["items"]) {
            let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section">
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>
            
            <div class="date-card-container">`;

            if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery("#for-you-carousal-content").html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }

  if (
    bandObj["band_info"]["category"]["latest-news-category"]["status"] ===
    "Added"
  ) {
    if (
      jQuery(
        `#${bandObj["band_info"]["category"]["latest-news-category"]["id"]}`
      ).length
    )
      jQuery.ajax({
        url: ` https://media-get.recosenselabs.com/v1.1/latest_assets?client_id=${localStorage.getItem(
          "client_id"
        )}&category=${id}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container1">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["category"]["latest-news-category"]["band_name"]}</p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you1" >
          <div class="cc-slider-content" id="for-you-carousal-content1" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["category"]["latest-news-category"]["id"]}`
          ).html(mainDiv);

          var band1 = "";

          for (d in data[0]["items"]) {
            let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section" >
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>
            
            <div class="date-card-container">`;
            
            if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery("#for-you-carousal-content1").html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you1").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you1").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }

  if (
    bandObj["band_info"]["category"]["trending-news-category"]["status"] ===
    "Added"
  ) {
    if (
      jQuery(
        `#${bandObj["band_info"]["category"]["trending-news-category"]["id"]}`
      ).length
    )
      jQuery.ajax({
        url: `  https://media-get.recosenselabs.com/v1.1/popular_assets?client_id=${localStorage.getItem(
          "client_id"
        )}&language=${siteLanguage}&platform=${platform}&category=${id}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container2">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["category"]["trending-news-category"]["band_name"]}</p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you2" >
          <div class="cc-slider-content" id="for-you-carousal-content2" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["category"]["trending-news-category"]["id"]}`
          ).html(mainDiv);

          var band1 = "";

          for (d in data[0]["items"]) {
            let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section" >
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>
            
            <div class="date-card-container">`
            
            if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery("#for-you-carousal-content2").html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you2").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you2").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }

  if (
    bandObj["band_info"]["category"]["people-you-follow-category"]["status"] ===
    "Added"
  ) {
    if (
      jQuery(
        `#${bandObj["band_info"]["category"]["people-you-follow-category"]["id"]}`
      ).length
    )
      jQuery.ajax({
        url: `  https://media-get.recosenselabs.com/v1.1/personalities?client_id=${localStorage.getItem(
          "client_id"
        )}&user_id=${localStorage.getItem(
          "ret-device-id"
        )}&language=${siteLanguage}&platform=${platform}&category=${id}`,
        success: function (data) {
          let mainDiv = `<div class="ca-cc-cards" id="for-you-band-container3">
        <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${bandObj["band_info"]["category"]["people-you-follow-category"]["band_name"]}</p>
        <div class="cc-wrapper cc-wrapper-pw">
        <div class="cc-carousal cc-pwd" id="cc-carousal-for-you3" >
          <div class="cc-slider-content" id="for-you-carousal-content3" style="margin:0;padding:0;"></div>
          <div class="MS-controls">
            <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
              
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
            </button>
            <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
             
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
            </button>
          </div>
        </div>
        </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["category"]["people-you-follow-category"]["id"]}`
          ).html(mainDiv);

          var band1 = "";

          for (d in data[0]["items"]) {
            let date1 = new Date(data[0]["items"][d]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[0]["items"][d]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[0]["items"][d]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section">
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[0]["items"][d]["title"]}">${data[0]["items"][d]["title"]}</p>
            
            <div class="date-card-container">`;
            
            if(data[0]["items"][d]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[0]["items"][d]["category"][0]}</span>`;
            
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery("#for-you-carousal-content3").html(band1);

          if (!band1) {
            jQuery("#cc-carousal-for-you3").html(
              `<div class="no-content">Do more actions to get customised content</div>`
            );
          } else
            jQuery("#cc-carousal-for-you3").multislider({
              duration: 300,
              interval: false,
              continuous: false,
            });
        },
      });
  }
}

function getContentDetailsPageBands(id) {
  jQuery("body").append('<div class="carousal-cont"></div>');

  jQuery.ajax({
    url: `https://media-get.recosenselabs.com/v1.1/recommendation?client_id=${localStorage.getItem(
      "client_id"
    )}&item_id=${id}&keywords=general,actors,athlete,places&platform=${platform}`,
    // url: `https://media-get.recosenselabs.com/v1.1/recommendation?client_id=${localStorage.getItem(
    //   "client_id"
    // )}&item_id=${id}&keywords=general,actors,athlete,places&platform=${platform}`,
    success: function (data) {
      for (d in data) {
        if (
          bandObj["band_info"]["content-details"]["more-like-this"][
            "status"
          ] === "Added" &&
          jQuery(
            `#${bandObj["band_info"]["content-details"]["more-like-this"]["id"]}`
          ).length &&
          d == 0
        ) {
          let str = `<div class="ca-cc-cards" id="for-you-band-container${d}">
          <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${data[d]["display_name"]}</p>
          <div class="cc-wrapper cc-wrapper-pw">
          <div class="cc-carousal cc-pwd" id="cc-carousal-for-you${d}" >
            <div class="cc-slider-content" id="for-you-carousal-content${d}" style="margin:0;padding:0;"></div>
            <div class="MS-controls">
              <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
                
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
              </button>
              <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
               
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
              </button>
            </div>
          </div>
          </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["content-details"]["more-like-this"]["id"]}`
          ).append(str);

          let band1 = "";

          for (d1 in data[d]["items"]) {


            let date1 = new Date(data[d]["items"][d1]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[d]["items"][d1]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[d]["items"][d1]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section">
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[d]["items"][d1]["title"]}">${data[d]["items"][d1]["title"]}</p>
            
            <div class="date-card-container">`;


            if(data[d]["items"][d1]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[d]["items"][d1]["category"][0]}</span>`;
            
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;


          }

          jQuery(`#for-you-carousal-content${d}`).html(band1);

          jQuery(`#cc-carousal-for-you${d}`).multislider({
            duration: 300,
            interval: false,
            continuous: false,
          });
        } else if (
          d > 0 &&
          bandObj["band_info"]["content-details"]["more-from-others"][
            "status"
          ] === "Added" &&
          jQuery(
            `#${bandObj["band_info"]["content-details"]["more-from-others"]["id"]}`
          ).length
        ) {
          let str = `<div class="ca-cc-cards" id="for-you-band-container${d}">
          <p class="ca-cc-card-title text-center" style="
    font-size: ${customConfig["card"]["font_size"]} !important;
    color: ${customConfig["card"]["heading_color"]} !important;
">${data[d]["display_name"]}</p>
          <div class="cc-wrapper cc-wrapper-pw">
          <div class="cc-carousal cc-pwd" id="cc-carousal-for-you${d}" >
            <div class="cc-slider-content" id="for-you-carousal-content${d}" style="margin:0;padding:0;"></div>
            <div class="MS-controls">
              <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
                
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
</svg>
              </button>
              <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
               
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: ${customConfig['card']['card_arrow_color']};" xml:space="preserve">
<path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
</svg>
              </button>
            </div>
          </div>
          </div></div>`;

          jQuery(
            `#${bandObj["band_info"]["content-details"]["more-from-others"]["id"]}`
          ).append(str);

          let band1 = "";

          for (d1 in data[d]["items"]) {
            let date1 = new Date(data[d]["items"][d1]["released_date"]).toString();
            date1 = date1.split(' ')
            
            date1 = date1[1]+' '+date1[2]+' '+date1[3];
            
            
                        band1 += `<a href="${data[d]["items"][d1]["url"]}"><div class="cc-ca-wrap item item-pw reco-items" style="
                        width: ${customConfig["card"]["width"]};
                    ">
               <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                 <img src="${data[d]["items"][d1]["image"]}" class="ca-cc-tag-card-img">
                 <div class="content-wrapper-section">
                 <p class="ca-cc-tag-card-img-text" style="
                font-size: ${customConfig["image"]["image_caption_size"]};
                color: ${customConfig["image"]["image_caption_color"]};
            " title="${data[d]["items"][d1]["title"]}">${data[d]["items"][d1]["title"]}</p>
            
            <div class="date-card-container">`;


            if(data[d]["items"][d1]["category"][0]!=='uncategorized')
            
            band1+=`<span class="tags-cc">${data[d]["items"][d1]["category"][0]}</span>`;
            
            
            band1+=`<span class="date-txt"  style="
            color: ${customConfig["image"]["image_caption_color"]};
            ">${date1}</span>
            
            
            </div>
            
            </div>
               </div>
               </div></a>`;
          }

          jQuery(`#for-you-carousal-content${d}`).html(band1);

          jQuery(`#cc-carousal-for-you${d}`).multislider({
            duration: 300,
            interval: false,
            continuous: false,
          });
        }
      }
    },
  });

  // if (
  //   bandObj["band_info"]["content-details"]["more-like-this"]["status"] ===
  //   "Added"
  // ) {
  //   var band = `<div class="ca-cc-cards" id="for-you-band-container">
  //   <p class="ca-cc-card-title text-center">More like this</p>
  //   <div class="cc-wrapper cc-wrapper-pw">
  //   <div class="cc-carousal cc-pwd" id="cc-carousal-for-you" >
  //    <div class="cc-slider-content" id="for-you-carousal-content" style="margin:0;padding:0;"></div>
  //    <div class="MS-controls">
  //      <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
  //        

  //      </button>
  //      <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
  //       

  //      </button>
  //    </div>
  //   </div>
  //   </div></div>`;
  //   jQuery("body").append(band);

  //   var band1 = "";

  //   for (let i = 0; i < 5; i++) {
  //     band1 += `<div class="cc-ca-wrap item item-pw reco-items" >
  //       <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
  //         <img src="https://wp-plugin.recosenselabs.com/wp-content/uploads/2021/06/6-485x360.jpg" class="ca-cc-tag-card-img">
  //         <p class="ca-cc-tag-card-img-text" style="

  //       </div>
  //       </div>`;
  //   }

  //   jQuery("#for-you-carousal-content").html(band1);

  //   jQuery("#cc-carousal-for-you").multislider({
  //     duration: 300,
  //     interval: false,
  //     continuous: false,
  //   });
  // }

  // if (
  //   bandObj["band_info"]["content-details"]["more-from-others"]["status"] ===
  //   "Added"
  // ) {
  //   var band = `<div class="ca-cc-cards" id="for-you-band-container">
  //   <p class="ca-cc-card-title text-center">More From People

  //   </p>
  //   <div class="cc-wrapper cc-wrapper-pw">
  //   <div class="cc-carousal cc-pwd" id="cc-carousal-for-you1" >
  //   <div class="cc-slider-content" id="for-you-carousal-content1" style="margin:0;padding:0;"></div>
  //   <div class="MS-controls">
  //    <button class="cc-slide-left-btn" style="font-size:27px;top:100px;width:25%">
  //      

  //    </button>
  //    <button class="cc-slide-right-btn" style="font-size:27px;top:100px;width:25%">
  //     

  //    </button>
  //   </div>
  //   </div>
  //   </div></div>`;
  //   jQuery("body").append(band);

  //   var band1 = "";

  //   for (let i = 0; i < 5; i++) {
  //     band1 += `<div class="cc-ca-wrap item item-pw reco-items" >
  //   <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
  //   <img src="https://wp-plugin.recosenselabs.com/wp-content/uploads/2021/06/6-485x360.jpg" class="ca-cc-tag-card-img">
  //   <p class="ca-cc-tag-card-img-text" style="

  //   </div>
  //   </div>`;
  //   }

  //   jQuery("#for-you-carousal-content1").html(band1);

  //   jQuery("#cc-carousal-for-you1").multislider({
  //     duration: 300,
  //     interval: false,
  //     continuous: false,
  //   });
  // }
}

window.onload = () => {
  jQuery.ajax({
    url: `https://media-get.recosenselabs.com/v1.1/wp_widget_info?client_id=${localStorage.getItem(
      "client_id"
    )}`,
    dataType: "json",
    async: false,
    success: function (data) {
      bandObj = data;
      getCase();
      if (bandObj["widget_info"]["status"] === "Added") {
        let elem = document.createElement("div");
        elem.className = "ca-cc-main-wrapper";

        elem.innerHTML = `<div class="ca-cc-widget-container slide-in from-right" id="ca-cc-widget-container">
          <div class="ca-cc-slider-ico" style="
          background: ${customConfig["widget_color"]["color"]};
      " onclick="toggleWidget()"><img class="ca-cc-slider-img" src="https://notification1.recosenselabs.com/assets/images/smiley.png"></div>
          <img src="https://notification1.recosenselabs.com/assets/images/Group4719.png" class="ca-cc-slider-close-icon"  onclick="toggleWidget()">
          <section class="ca-sec-proile-section ca-cc-show" id="ca-cc-main-section">
          </section>
          <section class="ca-sec-tag-detail-section ca-cc-hide" id="ca-cc-detail-section">
             <div class="ca-cc-title-container ca-cc-title-detail-container">
                <p class="ca-sec-tag-detail-section-title cc-ca-text-secondary" onclick="closeDetailSection()">Back</p>
             </div>
             <div class="ca-cc-content-scroll ca-cc-content-scroll-detail">
                <div class="ca-cc-cards ca-cc-wrap-card">
                   <p class="ca-cc-card-title ca-cc-card-desc-title">Most Viewed</p>
                   <div class="ca-cc-tag-content" id="ca-cc-tag-content">
                   </div>
          </section>
          </div>`;
        document.body.appendChild(elem);
        //write your code here
      }
    },
    error: function (err) {
      console.log(err);
    },
  });

  //   const styles = document.createElement("link");
  //   styles.setAttribute("rel", "stylesheet");
  //    styles.setAttribute("type", "text/css");
  //    styles.setAttribute(
  //      "href",
  //      "https://notification1.recosenselabs.com/assets/css/main.css"
  //    );
  //    document.getElementsByTagName("head")[0].appendChild(styles);

  // const script = document.createElement("script");
  // script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  // document.getElementsByTagName("head")[0].appendChild(script);

  //Append widget to body
};

var user_id = "chaturima1";
// var user_id = "saipriyagoka@gmail.com" || "";
// var user_id = "pradeepa@recosenselabs.com" || "";

let closeSearch = () => {
  document.getElementsByClassName("ca-cc-search-items-container")[0] = "";
  document.getElementsByClassName(
    "ca-cc-search-items-container"
  )[0].style.display = "none";
  loadCardDetails(0);
  document.querySelector(".ca-cc-search-inp").value = "";
  let closeElem = document.querySelector(".ca-cc-search-icon");
  closeElem.src =
    "https://notification1.recosenselabs.com/assets/images/Search.png";
  closeElem.style.cursor = "unset";
  closeElem.removeEventListener("click", closeSearch);
};

let showSearchContainer = (event) => {
  let val = event.target.value;
  let keyCode = event.keyCode;
  if (keyCode === 13) {
    event.preventDefault();
    if (val) {
      document.getElementsByClassName(
        "ca-cc-search-items-container"
      )[0].style.display = "block";
      document.getElementById("ca-cc-content-scroll").style.display = "none";
      document
        .querySelector("#ca-cc-content-scroll")
        .classList.add("ca-cc-hide");
      document
        .getElementsByClassName("ca-cc-search-container")[0]
        .classList.add("ca-cc-show");
      let closeElem = document.querySelector(".ca-cc-search-icon");
      closeElem.src =
        "https://notification1.recosenselabs.com/assets/images/cancel.png";
      closeElem.addEventListener("click", closeSearch);
      closeElem.style.cursor = "pointer";
      let count = 0;
      let element;
      loadSearchDetails(element, val);
    }
  }
};

let redirectFn = (title, tags) => {
  let heading = title === "unique_languages" ? "languages" : title;
  document.querySelector(".ca-cc-card-desc-title").innerHTML = heading;
  document.querySelector("#ca-cc-main-section").classList.add("ca-cc-hide");
  document.querySelector("#ca-cc-main-section").classList.remove("ca-cc-show");
  document.querySelector("#ca-cc-detail-section").classList.add("ca-cc-show");
  document
    .querySelector("#ca-cc-detail-section")
    .classList.remove("ca-cc-hide");
  if (tags === "Show All") {
    showMoreTags(title);
  } else {
    showTagDetail(title);
  }
};

async function showMoreTags(title) {
  let response;
  document.getElementById(
    "ca-cc-tag-content"
  ).innerHTML = `<img src="https://notification1.recosenselabs.com/assets/images/loader-default.gif" class="gif-loader" id="loader1"></img>`;

  // await new Promise((resolve) => setTimeout(resolve, 500));

  await fetch(
    `https://media-get.recosenselabs.com/v1.1/user_profile?client_id=${localStorage.getItem(
      "client_id"
    )}&user_id=${localStorage.getItem("ret-device-id")}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        return;
      }
      response = data[title];
    })
    .catch((err) => {
      console.log(err);
      let str = `<div style="justify-content:space-around"><img  src="https://notification1.recosenselabs.com/assets/images/no-result.png" class="no-res-found"><p class="no-res-text">We are facing technical isses. Will get back to you soon!
              </p></div>`;
      document.getElementById("ca-cc-tag-content").innerHTML = str;
    });
  if (!response) {
    let str = `<div style="justify-content:space-around"><img  src="https://notification1.recosenselabs.com/assets/images/no-result.png" class="no-res-found"><p class="no-res-text">No Results!
              </p></div>`;
    document.getElementById("ca-cc-tag-content").innerHTML = str;
    return;
  }
  let str = ``;
  str += `<div class="ca-cc-cards"><div class="ca-cc-tag-content">`;
  for (let i = 0; i < response.length; i++) {
    str += `<p class="ca-cc-tags ca-cc-tag-click" onclick="redirectFn('${response[
      i
    ].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")}')">${response[i]}</p>`;
  }
  str += `</div></div>`;

  document.getElementById("ca-cc-tag-content").innerHTML = str;
}

async function showTagDetail(title) {
  let response;
  document.getElementById(
    "ca-cc-tag-content"
  ).innerHTML = `<img src="https://notification1.recosenselabs.com/assets/images/loader-default.gif" class="gif-loader" id="loader1"></img>`;

  //   await new Promise((resolve) => setTimeout(resolve, 500));

  await fetch(
    `https://search-prod.recosenselabs.com/v1.1/search?client_id=${localStorage.getItem(
      "client_id"
    )}&text=${title}&page_size=10&user_id=${localStorage.getItem(
      "ret-device-id"
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        return;
      }
      response =
        data[0].items.items.length !== 0
          ? data[0].items.items
          : data[0].items.cast;
      if (response === data[0].items.cast) {
        for (let i = 0; i < data[0].items.cast.length; i++) {
          if (data[0].items.cast[i].item_id === undefined) {
            response = response.filter((item) => item.item_id !== undefined);
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
      let str = `<div style="justify-content:space-around"><img  src="https://notification1.recosenselabs.com/assets/images/no-result.png" class="no-res-found"><p class="no-res-text">We are facing technical isses. Will get back to you soon!
              </p></div>`;
      document.getElementById("ca-cc-tag-content").innerHTML = str;
    });
  if (!response || response.length === 0) {
    let str = `<div style="justify-content:space-around"><img  src="https://notification1.recosenselabs.com/assets/images/no-result.png" class="no-res-found"><p class="no-res-text">No Results!
              </p></div>`;
    document.getElementById("ca-cc-tag-content").innerHTML = str;
    return;
  }
  let str = "";
  for (let i = 0; i < response.length; i++) {
    str += `<div class="media">
         <div class="posts-thumb d-flex mr-3">
            <a href="${response[i].url}" rel="bookmark" title="${
      response[i].title
    }"><img  src="${
      response[i].image
    }" class="attachment-thumbnail size-thumbnail wp-post-image" alt=""></a>
            <span class="category-meta-bg"><a href="" rel="category tag">${
              response[i].category
                ? response[i].category[0]
                : response[i].type[0]
            }</a></span>
         </div>
         <div class="post-info media-body">
            <h4 class="post-title title-small mt-0 mb-1"><a href="${
              response[i].url
            }" rel="bookmark" title="${response[i].title}">${
      response[i].title
    }</a>
            </h4>
            <p class="post-meta"><time class="post-date" datetime="${
              response[i].released_date
            }">${dateFormatSetter(
      response[i].released_date ? response[i].released_date : ""
    )}</time></p>
         </div>
         <div class="clearfix"></div>
         </div>
         `;

    document.getElementById("ca-cc-tag-content").innerHTML = str;
  }
}

function closeDetailSection() {
  document.querySelector("#ca-cc-main-section").classList.remove("ca-cc-hide");
  document.querySelector("#ca-cc-main-section").classList.add("ca-cc-show");
  document
    .querySelector("#ca-cc-detail-section")
    .classList.remove("ca-cc-show");
  document.querySelector("#ca-cc-detail-section").classList.add("ca-cc-hide");
}

let toggleWidget = () => {
  const element = document.getElementsByClassName("slide-in")[0];

  if (!element.classList.contains("show")) {
    //Load Slider Data
    initContent();
  }
  element.classList.toggle("show");
  sliderDataLoaded = true;
  (adsbygoogle = window.adsbygoogle || []).push({});
};

async function initContent() {
  let element = document.getElementById("ca-cc-main-section");

  element.innerHTML = `<img src="https://notification1.recosenselabs.com/assets/images/loader-default.gif" class="gif-loader" id="loader2"></img>`;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let mainContent = `<div class="ca-cc-title-container">
     <img class="ca-cc-title-img" src="https://notification1.recosenselabs.com/assets/images/Group4742.png">
     <p class="cc-ca-title-name" style="
     color: ${customConfig["widget_color"]["heading_color"]} !important;
 ">User Persona</p>
  </div>
  <div class="ca-cc-profile-container">
     
  </div>
  <div class="tabs-container">
     <button type="button" class="tab-btns active" id="user-profile-tab">User Profile</button>
     <button type="button" class="tab-btns" id="pers-content-tab">Personalised Content</button>
  </div>
  <div id="user-profile-tab-content">
  <div class="ca-cc-search-container" id="ca-cc-search-container">
     <div class="ca-cc-serach-box">
        <input class="ca-cc-search-inp" placeholder="Search"  onkeyup="showSearchContainer(event)">
        <img src="https://notification1.recosenselabs.com/assets/images/Search.png" class="ca-cc-search-icon">
     </div>
     <div class="ca-cc-search-items-container"></div>
  </div>
  <ins class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-3660804993675643"
    data-ad-slot="8701058815"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
  <div class="ca-cc-content-scroll" id="ca-cc-content-scroll">
  
  </div>
  </div>
  <div id="pers-content-tab-content">
  </div>
  `;

  element.innerHTML = mainContent;
  loadCardDetails(0);
}

async function loadCardDetails(flag, val, count) {
  document.getElementsByClassName(
    "ca-cc-search-items-container"
  )[0].style.display = "none";
  document.getElementById("ca-cc-content-scroll").style.display = "block";
  let element = document.getElementById("ca-cc-content-scroll");
  element.innerHTML = "";
  let keys = [],
    response,
    length;
  element.innerHTML = `<img src="https://notification1.recosenselabs.com/assets/images/loader-default.gif" class="gif-loader" id="loader3"></img>`;

  await fetch(
    `https://media-get.recosenselabs.com/v1.1/user_profile?client_id=${localStorage.getItem(
      "client_id"
    )}&user_id=${localStorage.getItem("ret-device-id")}`
  )
    .then((res) => res.json())
    .then((data) => {
      response = data;
      let data_keys = Object.keys(data);
   
      for (i in data_keys) {
        if (response[data_keys[i]].length > 0) {
          if (!(data_keys[i] === "languages")) {
            keys.push(data_keys[i]);
          }
        }
      }
      element.innerHTML = "";
    })
    .catch((err) => {
      console.log(err);
      let str = `<div style="justify-content:space-around"><img  src="https://notification1.recosenselabs.com/assets/images/no-result.png" class="no-res-found"><p class="no-res-text">We are facing technical isses. Will get back to you soon!
     </p></div>`;
      element.innerHTML = str;
    });


    let isEmpty  = true;


    for (var key in response) {


      if(response[key].length!==0)
      {
        isEmpty = false;
      }
  }



  if (isEmpty) {
    let str = `<div style="justify-content:space-around"><img  src="https://notification1.recosenselabs.com/assets/images/no-result.png" class="no-res-found"><p class="no-res-text">Do more actions to get customised content

        </p></div>`;
    document.getElementById("ca-cc-content-scroll").innerHTML = str;
    return;
  }
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  let str = ``;
  for (let i = 0; i < keys.length; i++) {
    str = `
     <div class="ca-cc-cards">
     <p class="ca-cc-card-title">${
       keys[i] === "unique_languages"
         ? "languages"
         : keys[i] === "last_3_actions"
         ? "Recent Three Actions"
         : keys[i].split("_").join(" ")
     }</p>`;
    if (response[keys[i]].length < 10) {
      length = response[keys[i]].length;
      str += `<div class="ca-cc-tag-content">`;
    } else {
      length = 10;
      str += `<p class="ca-cc-card-show-all" data-info="${
        keys[i]
      }" onclick='redirectFn("${keys[i].replace(
        /[&\/\\#,+()$~%.'":*?<>{}]/g,
        ""
      )}","Show All")'>Show all<img class="ca-cc-show-icon"
        src="https://notification1.recosenselabs.com/assets/images/Iconly-Light-outline-Arrow.png"></p>
     <div class="ca-cc-tag-content">`;
    }

    if (keys[i] === "last_3_actions") {
      let actions_arr = response[keys[i]];
      new_arr = [];
      for (let i = 0; i < actions_arr.length; i++) {
        new_arr.push(Object.keys(actions_arr[i])[0]);
        str += `<p class="ca-cc-tags ca-cc-tag-click" style="width:100%"
    onclick="redirectFn('${actions_arr[i][new_arr[i]].replace(
      /[&\/\\#,+()$~%.'":*?<>{}]/g,
      ""
    )}')">${Object.keys(actions_arr[i])[0]}
    : ${actions_arr[i][new_arr[i]]}</p><br>`;
      }
    } else {
      for (let j = 0; j < length; j++) {
        str += `<p class="ca-cc-tags ca-cc-tag-click"
        onclick="redirectFn('${response[keys[i]][j].replace(
          /[&\/\\#,+()$~%.'":*?<>{}]/g,
          ""
        )}')">${response[keys[i]][j]}</p>`;
      }
    }

    str += `
     </div>
     </div>
     `;

    element.innerHTML += str;
    //   (adsbygoogle = window.adsbygoogle || []).push({});
  }
  let userProfileTab = document.getElementById("user-profile-tab");
  let persContentTab = document.getElementById("pers-content-tab");

  userProfileTab.addEventListener("click", function (e) {
    console.log(e.target.classList);
    userProfileTab.className = "tab-btns active";
    persContentTab.className = "tab-btns";
    document.getElementById("pers-content-tab-content").style.display = "none";
    document.getElementById("user-profile-tab-content").style.display = "block";
  });

  persContentTab.addEventListener("click", function (e) {
    console.log(e.target.classList);
    persContentTab.className = "tab-btns active";
    userProfileTab.className = "tab-btns";
    document.getElementById("user-profile-tab-content").style.display = "none";
    document.getElementById("pers-content-tab-content").style.display = "block";
    document.getElementById("pers-content-tab-content").innerHTML =
      '<img src="https://notification1.recosenselabs.com/assets/images/loader-default.gif" class="gif-loader" id="loader3"></img>';

    loadPersonalisedContent();
  });
}

async function loadPersonalisedContent() {
  await fetch(
    `https://media-get.recosenselabs.com/v1.1/personalization?client_id=${localStorage.getItem(
      "client_id"
    )}&user_id=${localStorage.getItem("ret-device-id")}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      document.getElementById("pers-content-tab-content").innerHTML =
        '<img src="https://notification1.recosenselabs.com/assets/images/loader-default.gif" class="gif-loader" id="loader3"></img>';
      if (data.length === 0) {
        document.getElementById("pers-content-tab-content").innerHTML =
          '<p class="pers-content-error-message">Get Personalised Content with more actions</p>';
        return;
      }

      if (data[0].items) {
        if (data[0].items.length === 0) {
          document.getElementById("pers-content-tab-content").innerHTML =
            '<p class="pers-content-error-message">Get Personalised Content with more actions</p>';
          return;
        }
      }

      let pers_content = data[0].items;
      let str = ``;
      for (let i in pers_content) {
        console.log(pers_content[i]);
        str += `<div class="media" style="margin-bottom:20px !important">
           <div class="posts-thumb d-flex mr-3">
           <a href="${pers_content[i].url}" rel="bookmark" title="${
          pers_content[i].title
        }"><img  src="${
          pers_content[i].image.startsWith("assets", 0)
            ? "https://mediasense.recosenselabs.com/" + pers_content[i].image
            : pers_content[i].image
        }" class="attachment-thumbnail size-thumbnail wp-post-image" alt=""></a>
           <span class="category-meta-bg"><a href="" rel="category tag">${
             pers_content[i].category[0]
           }</a></span>
           </div>
           <div class="post-info media-body">
              <h4 class="post-title title-small mt-0 mb-1"><a href="${
                pers_content[i].url
              }" rel="bookmark" title="${pers_content[i].title}">${
          pers_content[i].title
        }</a>
              </h4>
              <p class="post-meta"><time class="post-date" datetime="${
                pers_content[i].released_date
              }">${dateFormatSetter(pers_content[i].released_date)}</time></p>
           </div>
           <div class="clearfix"></div>
           </div>`;
      }
      document.getElementById("pers-content-tab-content").innerHTML = str;
    });
}

async function loadSearchDetails(element, val) {
  document.getElementsByClassName(
    "ca-cc-search-items-container"
  )[0].style.display = "block";
  document.getElementById("ca-cc-content-scroll").style.display = "none";
  let pElement = document.getElementsByClassName(
    "ca-cc-search-items-container"
  )[0];
  pElement.innerHTML = "";
  pElement.innerHTML = `<img src="https://notification1.recosenselabs.com/assets/images/loader-default.gif" class="gif-loader" id="loader3"></img>`;
  let response;
  let page = 0;
  let flag = 0;
  let html = "";
  let str = ``;
  let loadMore = async () => {
    await fetch(
      `https://search-prod.recosenselabs.com/v1.1/search?client_id=${localStorage.getItem(
        "client_id"
      )}&text=${val}&page_size=10&user_id=${localStorage.getItem(
        "ret-device-id"
      )}&page_number=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        response = data[0].items.items;
      })
      .catch((err) => {
        console.log(err);
        let str = `<img  src="https://notification1.recosenselabs.com/assets/images/no-result.png" class="no-res-found"><p class="no-res-text">No Results Found!!!
        </p>`;
        pElement.innerHTML = str;
      });
    if (!response) {
      return;
    }

    if (response.length === 0 && flag !== 1) {
      flag = 1;

      html += `
          <div class="gfq-getstated-cont">
          <div class="gfq-get-started-cont-title"><h5>No Products</h5></div>
          </div>`;
      pElement.innerHTML += html;
      pElement.removeEventListener("scroll", handlescroll, { passive: true });
      return;
    } else {
      flag = 1;
    }

    for (let i = 0; i < response.length; i++) {
      if (document.getElementById("loader3")) {
        document.getElementById("loader3").style.display = "none";
      }
      str = `<div class="media">
        <div class="posts-thumb d-flex mr-3">
        <a href="${response[i].url}" title="${response[i].title}"><img  src="${
        response[i].image
      }" class="attachment-thumbnail size-thumbnail wp-post-image" alt=""></a>
        <span class="category-meta-bg"><a href="" rel="category tag">${
          response[i].category[0]
        }</a></span>
        </div>
        <div class="post-info media-body">
           <h4 class="post-title title-small mt-0 mb-1"><a href="${
             response[i].url
           }" title="${response[i].title}">${response[i].title}</a>
           </h4>
           <p class="post-meta"><time class="post-date" datetime="${
             response[i].released_date
           }">${dateFormatSetter(response[i].released_date)}</time></p>
        </div>
        <div class="clearfix"></div>
        </div>
        `;
      pElement.innerHTML += str;
    }

    page++;
  };
  loadMore();
  pElement.addEventListener("scroll", function () {
    if (
      pElement.scrollTop + pElement.clientHeight >=
      pElement.scrollHeight - 1
    ) {
      loadMore();
    }
  });
}

function dateFormatSetter(rDate) {
  if (!rDate) {
    return "";
  }
  let date = new Date(rDate);
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let day_date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let year = date.getFullYear();
  return month + " " + day_date + "'" + yearFormatter(year);
}

function yearFormatter(year) {
  if (year <= 1900) {
    return new Date().getFullYear();
  } else {
    return year;
  }
}

document.addEventListener("click", function (event) {
  var specifiedElement = document.getElementById("ca-cc-widget-container");
  var isClickInside = specifiedElement.contains(event.target);
  if (
    event.target.className === "ca-cc-slider-ico" ||
    event.target.className === "ca-cc-tags ca-cc-tag-click" ||
    event.target.className === "ca-cc-search-inp"
  ) {
    isClickInside = true;
  }
  if (!isClickInside) {
    document.getElementsByClassName("slide-in")[0].classList.remove("show");
  }
});
