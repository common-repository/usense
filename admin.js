let Url = `https://media-get.recosenselabs.com/v1.1/get_wordpress_client?site_domain=${window.location.hostname}`;
jQuery.ajax({
  url: Url,
  dataType: "json",
  async: false,
  success: function (data) {
    localStorage.setItem("client_id", data["client_id"]);
    localStorage.setItem("client_secret", data["client_secret"]);
  },
  error: function (err) {
    console.log(err);
  },
});

window.onload = () => {
  document.querySelectorAll(".cpy").forEach((item) => {
    item.addEventListener("click", (event) => {
      let copyText = document.getElementById(item.getAttribute("data-id"));
      let input = copyText.querySelector("input.text");
      input.select();
      document.execCommand("copy");
      copyText.classList.add("active");
      window.getSelection().removeAllRanges();
      setTimeout(function () {
        copyText.classList.remove("active");
      }, 2500);
    });
  });

  let url = window.location.href;

  jQuery.ajax({
    url: ajaxurl,
    dataType: "json",
    data: {
      action: "getPostCount",
      client_id: localStorage.getItem("client_id"),
    },
    async: false,
    success: function (data) {
      console.log(data);
    },
    error: function (err) {
      console.log(err);
    },
  });

  if (!url.includes("USense")) {
    return;
  }

  jQuery.ajax({
    url: `https://media-get.recosenselabs.com/v1.1/wp_widget_info?client_id=${localStorage.getItem(
      "client_id"
    )}`,
    dataType: "json",
    success: function (data) {
      jQuery("#d1").val(
        data["band_info"]["home"]["suggested_for_you"]["band_name"]
      );
      jQuery("#i1").val(data["band_info"]["home"]["suggested_for_you"]["id"]);
      jQuery("#cont1")
        .find("input")
        .val(
          `<div id="${data["band_info"]["home"]["suggested_for_you"]["id"]}"></div>`
        );
      jQuery("#bs1").text(
        data["band_info"]["home"]["suggested_for_you"]["status"] === "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["home"]["suggested_for_you"]["status"] === "Removed"
      ) {
        jQuery("#bs1").addClass("removed");
        jQuery("#c1").text("Enable").attr("data-id", 1).show();
        jQuery("#c1").addClass("enable");
      } else {
        jQuery("#c1").text("Disable").attr("data-id", 0).show();
        jQuery("#c1").text("Disable").addClass("disabled");
      }
      jQuery("#d2").val(data["band_info"]["home"]["latest-news"]["band_name"]);
      jQuery("#i2").val(data["band_info"]["home"]["latest-news"]["id"]);
      jQuery("#cont2")
        .find("input")
        .val(
          `<div id="${data["band_info"]["home"]["latest-news"]["id"]}"></div>`
        );
      jQuery("#bs2").text(
        data["band_info"]["home"]["latest-news"]["status"] === "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (data["band_info"]["home"]["latest-news"]["status"] === "Removed") {
        jQuery("#bs2").addClass("removed");
        jQuery("#c2").text("Enable").attr("data-id", 1).show();
        jQuery("#c2").addClass("enable");
      } else {
        jQuery("#c2").text("Disable").attr("data-id", 0).show();
        jQuery("#c2").text("Disable").addClass("disabled");
      }

      jQuery("#d3").val(
        data["band_info"]["home"]["trending-news"]["band_name"]
      );
      jQuery("#i3").val(data["band_info"]["home"]["trending-news"]["id"]);
      jQuery("#cont3")
        .find("input")
        .val(
          `<div id="${data["band_info"]["home"]["trending-news"]["id"]}"></div>`
        );
      jQuery("#bs3").text(
        data["band_info"]["home"]["trending-news"]["status"] === "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (data["band_info"]["home"]["trending-news"]["status"] === "Removed") {
        jQuery("#bs3").addClass("removed");
        jQuery("#c3").text("Enable").attr("data-id", 1).show();
        jQuery("#c3").addClass("enable");
      } else {
        jQuery("#c3").text("Disable").attr("data-id", 0).show();
        jQuery("#c3").text("Disable").addClass("disabled");
      }

      jQuery("#d4").val(
        data["band_info"]["home"]["people-you-follow"]["band_name"]
      );
      jQuery("#i4").val(data["band_info"]["home"]["people-you-follow"]["id"]);
      jQuery("#cont4")
        .find("input")
        .val(
          `<div id="${data["band_info"]["home"]["people-you-follow"]["id"]}"></div>`
        );
      jQuery("#bs4").text(
        data["band_info"]["home"]["people-you-follow"]["status"] === "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["home"]["people-you-follow"]["status"] === "Removed"
      ) {
        jQuery("#bs4").addClass("removed");
        jQuery("#c4").text("Enable").attr("data-id", 1).show();
        jQuery("#c4").addClass("enable");
      } else {
        jQuery("#c4").text("Disable").attr("data-id", 0).show();
        jQuery("#c4").text("Disable").addClass("disabled");
      }

      jQuery("#d5").val(
        data["band_info"]["category"]["suggested-for-you-category"]["band_name"]
      );
      jQuery("#i5").val(
        data["band_info"]["category"]["suggested-for-you-category"]["id"]
      );
      jQuery("#cont5")
        .find("input")
        .val(
          `<div id="${data["band_info"]["category"]["suggested-for-you-category"]["id"]}"></div>`
        );
      jQuery("#bs5").text(
        data["band_info"]["category"]["suggested-for-you-category"][
          "status"
        ] === "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["category"]["suggested-for-you-category"][
          "status"
        ] === "Removed"
      ) {
        jQuery("#bs5").addClass("removed");
        jQuery("#c5").text("Enable").attr("data-id", 1).show();
        jQuery("#c5").addClass("enable");
      } else {
        jQuery("#c5").text("Disable").attr("data-id", 0).show();
        jQuery("#c5").text("Disable").addClass("disabled");
      }

      jQuery("#d6").val(
        data["band_info"]["category"]["latest-news-category"]["band_name"]
      );
      jQuery("#i6").val(
        data["band_info"]["category"]["latest-news-category"]["id"]
      );
      jQuery("#cont6")
        .find("input")
        .val(
          `<div id="${data["band_info"]["category"]["latest-news-category"]["id"]}"></div>`
        );
      jQuery("#bs6").text(
        data["band_info"]["category"]["latest-news-category"]["status"] ===
          "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["category"]["latest-news-category"]["status"] ===
        "Removed"
      ) {
        jQuery("#bs6").addClass("removed");
        jQuery("#c6").text("Enable").attr("data-id", 1).show();
        jQuery("#c6").addClass("enable");
      } else {
        jQuery("#c6").text("Disable").attr("data-id", 0).show();
        jQuery("#c6").text("Disable").addClass("disabled");
      }

      jQuery("#d7").val(
        data["band_info"]["category"]["trending-news-category"]["band_name"]
      );
      jQuery("#i7").val(
        data["band_info"]["category"]["trending-news-category"]["id"]
      );
      jQuery("#cont7")
        .find("input")
        .val(
          `<div id="${data["band_info"]["category"]["trending-news-category"]["id"]}"></div>`
        );
      jQuery("#bs7").text(
        data["band_info"]["category"]["trending-news-category"]["status"] ===
          "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["category"]["trending-news-category"]["status"] ===
        "Removed"
      ) {
        jQuery("#bs7").addClass("removed");
        jQuery("#c7").text("Enable").attr("data-id", 1).show();
        jQuery("#c7").addClass("enable");
      } else {
        jQuery("#c7").text("Disable").attr("data-id", 0).show();
        jQuery("#c7").text("Disable").addClass("disabled");
      }

      jQuery("#d8").val(
        data["band_info"]["category"]["people-you-follow-category"]["band_name"]
      );
      jQuery("#i8").val(
        data["band_info"]["category"]["people-you-follow-category"]["id"]
      );
      jQuery("#cont8")
        .find("input")
        .val(
          `<div id="${data["band_info"]["category"]["people-you-follow-category"]["id"]}"></div>`
        );
      jQuery("#bs8").text(
        data["band_info"]["category"]["people-you-follow-category"][
          "status"
        ] === "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["category"]["people-you-follow-category"][
          "status"
        ] === "Removed"
      ) {
        jQuery("#bs8").addClass("removed");
        jQuery("#c8").text("Enable").attr("data-id", 1).show();
        jQuery("#c8").addClass("enable");
      } else {
        jQuery("#c8").text("Disable").attr("data-id", 0).show();
        jQuery("#c8").text("Disable").addClass("disabled");
      }

      jQuery("#d9").val(
        data["band_info"]["content-details"]["more-like-this"]["band_name"]
      );
      jQuery("#i9").val(
        data["band_info"]["content-details"]["more-like-this"]["id"]
      );
      jQuery("#cont9")
        .find("input")
        .val(
          `<div id="${data["band_info"]["content-details"]["more-like-this"]["id"]}"></div>`
        );
      jQuery("#bs9").text(
        data["band_info"]["content-details"]["more-like-this"]["status"] ===
          "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["content-details"]["more-like-this"]["status"] ===
        "Removed"
      ) {
        jQuery("#bs9").addClass("removed");
        jQuery("#c9").text("Enable").attr("data-id", 1).show();
        jQuery("#c9").addClass("enable");
      } else {
        jQuery("#c9").text("Disable").attr("data-id", 0).show();
        jQuery("#c9").text("Disable").addClass("disabled");
      }

      jQuery("#d10").val(
        data["band_info"]["content-details"]["more-from-others"]["band_name"]
      );
      jQuery("#i10").val(
        data["band_info"]["content-details"]["more-from-others"]["id"]
      );
      jQuery("#cont10")
        .find("input")
        .val(
          `<div id="${data["band_info"]["content-details"]["more-from-others"]["id"]}"></div>`
        );
      jQuery("#bs10").text(
        data["band_info"]["content-details"]["more-from-others"]["status"] ===
          "Added"
          ? "Enabled"
          : "Disabled"
      );
      if (
        data["band_info"]["content-details"]["more-from-others"]["status"] ===
        "Removed"
      ) {
        jQuery("#bs10").addClass("removed");
        jQuery("#c10").text("Enable").attr("data-id", 1).show();
        jQuery("#c10").addClass("enable");
      } else {
        jQuery("#c10").text("Disable").attr("data-id", 0).show();
        jQuery("#c10").text("Disable").addClass("disabled");
      }
    },
    error: function (err) {
      console.log(err);
    },
  });

  jQuery.ajax({
    url: `https://media-get.recosenselabs.com/v1.1/wp_config_info?client_id=${localStorage.getItem(
      "client_id"
    )}`,
    dataType: "json",
    success: function (data) {
      var picker;
      var color = data["config_info"]["card"]["heading_color"];
      jQuery("#pal1").css(
        "background-color",
        data["config_info"]["card"]["heading_color"]
      );
      var defaults = {
        color: color,
        container: document.getElementById("color_picker"),
        onChange: function (color) {
          updateColor(color);
        },
        swatchColors: ["#D1BF91", "#60371E", "#A6341B", "#F9C743", "#C7C8C4"],
      };

      function initPicker(options) {
        options = Object.assign(defaults, options);
        picker = new EasyLogicColorPicker(options);
      }

      function updateColor(value) {
        color = value;
        jQuery("#card_heading_color").val(value).trigger("change");
        jQuery("#pal1").css("background-color", value);

        const $color = document.querySelector(".sample__color");
        const $code = document.querySelector(".sample__code");
        $code.innerText = color;
        $color.style.setProperty("--color", color);
      }

      initPicker();
      updateColor(color);

      var picker;
      var color = data["config_info"]["widget_color"]["color"];
      jQuery("#pal4").css(
        "background-color",
        data["config_info"]["widget_color"]["color"]
      );

      var defaults = {
        color: color,
        container: document.getElementById("color_picker1"),
        onChange: function (color) {
          updateColor1(color);
        },
        swatchColors: ["#D1BF91", "#60371E", "#A6341B", "#F9C743", "#C7C8C4"],
      };

      function updateColor1(value) {
        color = value;
        jQuery("#widc").val(value).trigger("change");
        jQuery("#pal4").css("background-color", value);

        const $color = document.querySelector(".sample__color");
        const $code = document.querySelector(".sample__code");
        $code.innerText = color;
        $color.style.setProperty("--color", color);
      }

      initPicker();
      updateColor1(color);

      var picker;
      var color = data["config_info"]["widget_color"]["heading_color"];
      jQuery("#pal5").css(
        "background-color",
        data["config_info"]["widget_color"]["heading_color"]
      );

      var defaults = {
        color: color,
        container: document.getElementById("color_picker2"),
        onChange: function (color) {
          updateColor2(color);
        },
        swatchColors: ["#D1BF91", "#60371E", "#A6341B", "#F9C743", "#C7C8C4"],
      };

      function updateColor2(value) {
        color = value;
        jQuery("#widhc").val(value).trigger("change");
        jQuery("#pal5").css("background-color", value);

        const $color = document.querySelector(".sample__color");
        const $code = document.querySelector(".sample__code");
        $code.innerText = color;
        $color.style.setProperty("--color", color);
      }

      initPicker();
      updateColor2(color);

      var picker;
      var color = data["config_info"]["card"]["card_arrow_color"];
      jQuery("#pal2").css(
        "background-color",
        data["config_info"]["card"]["card_arrow_color"]
      );

      var defaults = {
        color: color,
        container: document.getElementById("color_picker1A"),
        onChange: function (color) {
          updateColor1A(color);
        },
        swatchColors: ["#D1BF91", "#60371E", "#A6341B", "#F9C743", "#C7C8C4"],
      };

      function updateColor1A(value) {
        color = value;
        jQuery("#card_arrow_color").val(value).trigger("change");
        jQuery("#pal2").css("background-color", value);

        const $color = document.querySelector(".sample__color");
        const $code = document.querySelector(".sample__code");
        $code.innerText = color;
        $color.style.setProperty("--color", color);
      }

      initPicker();
      updateColor1A(color);

      var picker;
      var color = data["config_info"]["image"]["image_caption_color"];
      jQuery("#pal3").css(
        "background-color",
        data["config_info"]["image"]["image_caption_color"]
      );

      var defaults = {
        color: color,
        container: document.getElementById("color_picker3"),
        onChange: function (color) {
          updateColor3(color);
        },
        swatchColors: ["#D1BF91", "#60371E", "#A6341B", "#F9C743", "#C7C8C4"],
      };

      function updateColor3(value) {
        color = value;
        jQuery("#imgcc").val(value).trigger("change");
        jQuery("#pal3").css("background-color", value);

        const $color = document.querySelector(".sample__color");
        const $code = document.querySelector(".sample__code");
        $code.innerText = color;
        $color.style.setProperty("--color", color);
      }

      initPicker();
      updateColor3(color);

      let str1 = data["config_info"]["card"]["width"];

      if (str1.indexOf("%") > -1) {
        jQuery("#width_select").val("%");
      }

      let str2 = data["config_info"]["image"]["image_caption_size"];

      if (str2.indexOf("%") > -1) {
        jQuery("#imgc_select").val("%");
      }

      let str3 = data["config_info"]["card"]["font_size"];

      if (str3.indexOf("%") > -1) {
        jQuery("#card_heading_size_select").val("%");
      }

      jQuery("#width")
        .eq(0)
        .val(parseInt(data["config_info"]["card"]["width"]));
      jQuery("#imgc").val(
        parseInt(data["config_info"]["image"]["image_caption_size"])
      );

      jQuery("#vl-left").css(
        "fill",
        data["config_info"]["card"]["card_arrow_color"]
      );
      jQuery("#vl-left-right").css(
        "fill",
        data["config_info"]["card"]["card_arrow_color"]
      );

      jQuery("#imgcc").val(data["config_info"]["image"]["image_caption_color"]);

      jQuery("#widc").val(data["config_info"]["widget_color"]["color"]);

      jQuery(".ca-cc-slider-ico").css(
        "background",
        data["config_info"]["widget_color"]["color"]
      );

      jQuery("#widhc").val(
        data["config_info"]["widget_color"]["heading_color"]
      );

      jQuery(".cc-ca-title-name").css(
        "color",
        data["config_info"]["widget_color"]["heading_color"]
      );

      jQuery(".item-pw").each(function () {
        jQuery(this).css("width", data["config_info"]["card"]["width"]);

        jQuery(this)
          .children()
          .children(".content-wrapper-section")
          .find(".ca-cc-tag-card-img-text")
          .css("font-size", data["config_info"]["image"]["image_caption_size"]);
        jQuery(this)
          .children()
          .children(".content-wrapper-section")
          .find(".ca-cc-tag-card-img-text")
          .css("color", data["config_info"]["image"]["image_caption_color"]);
      });

      jQuery("#card_heading_size").val(
        parseInt(data["config_info"]["card"]["font_size"])
      );

      jQuery("#ca-cc-card-title").css(
        "font-size",
        data["config_info"]["card"]["font_size"]
      );
      jQuery("#ca-cc-card-title").css(
        "color",
        data["config_info"]["card"]["heading_color"]
      );

      jQuery("#card_heading_color").val(
        data["config_info"]["card"]["heading_color"]
      );
    },
    error: function (err) {},
  });

  jQuery(document).on("keyup", ".imp", function (e) {
    let attr = jQuery(this).attr("id");
    if (attr.includes("i")) {
      attr = attr.substring(1);
      jQuery(`#cont${attr}`)
        .find("input")
        .val(`<div id="${jQuery(this).val()}"></div>`);
    }
  });

  jQuery(document).on("change", ".system-name", function (e) {
    if (!jQuery(this).val()) return;

    let attr = jQuery(this).attr("id");
    if (attr.includes("s")) {
      attr = attr.substring(2);
      jQuery(`#d${attr}`).val(jQuery(this).val());
    }
  });

  jQuery(document).on("click", ".list-items", function (e) {
    if (jQuery(this).text() === "Bands") {
      jQuery(".wrapper").show();
      jQuery(".wrapper2").hide();
    } else {
      jQuery(".wrapper").hide();
      jQuery(".wrapper2").show();
    }
  });

  jQuery(document).on("click", ".palette", function (e) {
    jQuery(".dynamic-color").each(function () {
      jQuery(this).hide();
    });
    jQuery(this).siblings(".dynamic-color").fadeIn();
  });

  jQuery("body").click(function (evt) {
    console.log(evt.target);

    if (
      jQuery(evt.target).closest(".dynamic-color").length ||
      jQuery(evt.target).siblings(".dynamic-color").length
    )
      return;
    else
      jQuery(".dynamic-color").each(function () {
        jQuery(this).hide();
      });
  });

  jQuery(document).on("click", ".band-btn", function (e) {
    jQuery(this)
      .parent()
      .siblings(".display_name")
      .eq(0)
      .find("span")
      .text("Enabled");

    if (jQuery(this).attr("data-id") == 1) {
      jQuery(this).removeClass("enable");
      jQuery(this).addClass("disabled");
      jQuery(this).text("Disable").attr("data-id", 0);
      jQuery(this)
        .parent()
        .siblings(".display_name")
        .eq(0)
        .find("span")
        .text("Enabled")
        .removeClass("removed");
    } else {
      jQuery(this).addClass("enable");
      jQuery(this).removeClass("disabled");
      jQuery(this).text("Enable").attr("data-id", 1);
      jQuery(this)
        .parent()
        .siblings(".display_name")
        .eq(0)
        .find("span")
        .text("Disabled")
        .addClass("removed");
    }
  });

  jQuery(document).on("click", ".submit-btn", function (e) {
    let resBody = {
      band_info: {
        category: {
          "trending-news-category": {
            status: jQuery("#c7").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d7").val(),
            id: jQuery("#i7").val(),
          },
          "suggested-for-you-category": {
            status: jQuery("#c5").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d5").val(),
            id: jQuery("#i5").val(),
          },
          "latest-news-category": {
            status: jQuery("#c6").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d6").val(),
            id: jQuery("#i6").val(),
          },
          "people-you-follow-category": {
            status: jQuery("#c8").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d8").val(),
            id: jQuery("#i8").val(),
          },
        },
        "content-details": {
          "more-from-others": {
            status: jQuery("#c10").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d10").val(),
            id: jQuery("#i10").val(),
          },
          "more-like-this": {
            status: jQuery("#c9").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d9").val(),
            id: jQuery("#i9").val(),
          },
        },
        home: {
          suggested_for_you: {
            status: jQuery("#c1").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d1").val(),
            id: jQuery("#i1").val(),
          },
          "latest-news": {
            status: jQuery("#c2").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d2").val(),
            id: jQuery("#i2").val(),
          },
          "people-you-follow": {
            status: jQuery("#c4").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d4").val(),
            id: jQuery("#i4").val(),
          },
          "trending-news": {
            status: jQuery("#c3").attr("data-id") == 0 ? "Added" : "Removed",
            band_name: jQuery("#d3").val(),
            id: jQuery("#i3").val(),
          },
        },
      },
      widget_info: {
        status: "Added",
      },
      client_id: localStorage.getItem("client_id"),
    };

    fetch(`https://media-get.recosenselabs.com/v1.1/wp_widget_info`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resBody),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        alert("Settings updated");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  /*------------------------------- Change events --------------------------------*/

  jQuery(document).on("keyup", "#card_heading_size", function (e) {
    jQuery("#ca-cc-card-title").css(
      "font-size",
      jQuery(this).val() + jQuery(this).next().val()
    );
  });

  jQuery(document).on("change", "#card_heading_size", function (e) {
    jQuery("#ca-cc-card-title").css(
      "font-size",
      jQuery(this).val() + jQuery(this).next().val()
    );
  });

  jQuery(document).on("change", "#card_heading_size_select", function (e) {
    jQuery("#ca-cc-card-title").css(
      "font-size",
      jQuery(this).prev().val() + jQuery(this).val()
    );
  });

  jQuery(document).on("keyup", "#card_heading_color", function (e) {
    jQuery("#ca-cc-card-title").css("color", jQuery(this).val());
  });

  jQuery(document).on("change", "#card_heading_color", function (e) {
    jQuery("#ca-cc-card-title").css("color", jQuery(this).val());
  });

  jQuery(document).on("change", "#width", function (e) {
    let val = jQuery(this).val() + jQuery(this).next().val();

    jQuery(".item-pw").each(function () {
      jQuery(this).css("width", val);
    });
  });

  jQuery(document).on("keyup", "#width", function (e) {
    let val = jQuery(this).val() + jQuery(this).next().val();

    jQuery(".item-pw").each(function () {
      jQuery(this).css("width", val);
    });
  });

  jQuery(document).on("change", "#width_select", function (e) {
    let val = jQuery(this).prev().val() + jQuery(this).val();

    jQuery(".item-pw").each(function () {
      jQuery(this).css("width", val);
    });
  });

  jQuery(document).on("change", "#imgc", function (e) {
    let val = jQuery(this).val() + jQuery(this).next().val();

    jQuery(".item-pw").each(function () {
      jQuery(this)
        .children()
        .children(".content-wrapper-section")
        .find(".ca-cc-tag-card-img-text")
        .css("font-size", val);
    });
  });

  jQuery(document).on("keyup", "#imgc", function (e) {
    let val = jQuery(this).val() + jQuery(this).next().val();

    jQuery(".item-pw").each(function () {
      jQuery(this)
        .children()
        .children(".content-wrapper-section")
        .find(".ca-cc-tag-card-img-text")
        .css("font-size", val);
    });
  });

  jQuery(document).on("change", "#imgc_select", function (e) {
    let val = jQuery(this).prev().val() + jQuery(this).val();

    jQuery(".item-pw").each(function () {
      jQuery(this)
        .children()
        .children(".content-wrapper-section")
        .find(".ca-cc-tag-card-img-text")
        .css("font-size", val);
    });
  });

  jQuery(document).on("keyup", "#imgcc", function (e) {
    let val = jQuery(this).val();

    jQuery(".item-pw").each(function () {
      jQuery(this)
        .children()
        .children(".content-wrapper-section")
        .find(".ca-cc-tag-card-img-text")
        .css("color", val);
      jQuery(this)
        .children()
        .children(".content-wrapper-section")
        .find(".date-card-container")
        .children(".date-txt")
        .css("color", val);
    });
  });

  jQuery(document).on("change", "#imgcc", function (e) {
    let val = jQuery(this).val();

    jQuery(".item-pw").each(function () {
      jQuery(this)
        .children()
        .children(".content-wrapper-section")
        .find(".ca-cc-tag-card-img-text")
        .css("color", val);

      jQuery(this)
        .children()
        .children(".content-wrapper-section")
        .find(".date-card-container")
        .children(".date-txt")
        .css("color", val);
    });
  });

  jQuery(document).on("change", "#card_arrow_color", function (e) {
    let val = jQuery(this).val();
    jQuery("#vl-left").css("fill", val);
    jQuery("#vl-left-right").css("fill", val);
  });

  jQuery(document).on("keyup", "#widc", function (e) {
    jQuery(".ca-cc-slider-ico").css("background", jQuery(this).val());
  });

  jQuery(document).on("change", "#widc", function (e) {
    jQuery(".ca-cc-slider-ico").css("background", jQuery(this).val());
  });

  jQuery(document).on("keyup", "#widhc", function (e) {
    jQuery(".cc-ca-title-name").css("color", jQuery(this).val());
  });

  jQuery(document).on("change", "#widhc", function (e) {
    jQuery(".cc-ca-title-name").css("color", jQuery(this).val());
  });

  jQuery(document).on("click", ".save-custom", function (e) {
    if (jQuery("#width_select").val() === "px") {
      if (jQuery("#width").val() < 200 || jQuery("#width").val() > 300) {
        alert("Please select card width within range");
        return;
      }
    } else {
      if (jQuery("#width").val() < 20 || jQuery("#width").val() > 30) {
        alert("Please select card width within range");
        return;
      }
    }

    const url = "https://media-get.recosenselabs.com/v1.1/wp_config_info";

    let body = {
      client_id: localStorage.getItem("client_id"),
      config_info: {
        image: {
          height: "21px",
          image_caption_size:
            jQuery("#imgc").val() + jQuery("#imgc_select").val(),
          image_caption_color: jQuery("#imgcc").val(),
        },
        widget_color: {
          color: jQuery("#widc").val(),
          heading_color: jQuery("#widhc").val(),
          inner_heading_color: jQuery("#widhc").val(),
        },
        card: {
          font_size:
            jQuery("#card_heading_size").val() +
            jQuery("#card_heading_size_select").val(),
          width: jQuery("#width").val() + jQuery("#width_select").val(),
          heading_color: jQuery("#card_heading_color").val(),
          card_arrow_color: jQuery("#card_arrow_color").val(),
        },
      },
    };

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        alert("Settings updated");
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
