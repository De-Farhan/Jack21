// scrollspy js code here
$(document).ready(function () {
  // Add scrollspy to <body>
  $("body").scrollspy({ target: "#navbar", offset: 50 });

  // Add smooth scrolling on all links inside the navbar
  $("#navbar ul li a, #banner-section .ani-btn a").on(
    "click",
    function (event) {
      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top,
          },
          800,
          function () {
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
          }
        );
      } // End if
    }
  );
});
// navbar hamburger icon js code here
$(document).ready(function () {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const togglerIcon = document.querySelector(".navbar-toggler-icon");
  togglerIcon.addEventListener("click", function () {
    togglerIcon.classList.toggle("show-icon");
    $(".navbar .navbar-collapse").slideToggle(400);
  });
});
// navbar fixed js code here
$(document).ready(function () {
  $(window).on("scroll", function () {
    let scrollamount = $(window).scrollTop();
    if (scrollamount > 50) {
      $("#navbar").addClass("fixed-nav");
    } else {
      $("#navbar").removeClass("fixed-nav");
    }
  });
});
// navbar ancor on click collapsed js code here
$(document).ready(function () {
  const showIcon = document.querySelector(".navbar .navbar-toggler-icon");
  $(".navbar ul li a").on("click", function () {
    $(".navbar .navbar-collapse").slideUp(400);
    showIcon.classList.remove("show-icon");
  });
});
// type writter js code here
$(document).ready(function ($) {
  //set animation timing
  var animationDelay = 2500,
    //loading bar effect
    barAnimationDelay = 3800,
    barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
    //letters effect
    lettersDelay = 50,
    //type effect
    typeLettersDelay = 150,
    selectionDuration = 500,
    typeAnimationDelay = selectionDuration + 800,
    //clip effect
    revealDuration = 800,
    revealAnimationDelay = 1500;

  initHeadline();

  function initHeadline() {
    //insert <i> element for each letter of a changing word
    singleLetters($(".cd-headline.letters").find("b"));
    //initialise headline animation
    animateHeadline($(".cd-headline"));
  }

  function singleLetters($words) {
    $words.each(function () {
      var word = $(this),
        letters = word.text().split(""),
        selected = word.hasClass("is-visible");
      for (i in letters) {
        if (word.parents(".rotate-2").length > 0)
          letters[i] = "<em>" + letters[i] + "</em>";
        letters[i] = selected
          ? '<i class="in">' + letters[i] + "</i>"
          : "<i>" + letters[i] + "</i>";
      }
      var newLetters = letters.join("");
      word.html(newLetters).css("opacity", 1);
    });
  }

  function animateHeadline($headlines) {
    var duration = animationDelay;
    $headlines.each(function () {
      var headline = $(this);

      if (headline.hasClass("loading-bar")) {
        duration = barAnimationDelay;
        setTimeout(function () {
          headline.find(".cd-words-wrapper").addClass("is-loading");
        }, barWaiting);
      } else if (headline.hasClass("clip")) {
        var spanWrapper = headline.find(".cd-words-wrapper"),
          newWidth = spanWrapper.width() + 10;
        spanWrapper.css("width", newWidth);
      } else if (!headline.hasClass("type")) {
        //assign to .cd-words-wrapper the width of its longest word
        var words = headline.find(".cd-words-wrapper b"),
          width = 0;
        words.each(function () {
          var wordWidth = $(this).width();
          if (wordWidth > width) width = wordWidth;
        });
        headline.find(".cd-words-wrapper").css("width", width);
      }

      //trigger animation
      setTimeout(function () {
        hideWord(headline.find(".is-visible").eq(0));
      }, duration);
    });
  }

  function hideWord($word) {
    var nextWord = takeNext($word);

    if ($word.parents(".cd-headline").hasClass("type")) {
      var parentSpan = $word.parent(".cd-words-wrapper");
      parentSpan.addClass("selected").removeClass("waiting");
      setTimeout(function () {
        parentSpan.removeClass("selected");
        $word
          .removeClass("is-visible")
          .addClass("is-hidden")
          .children("i")
          .removeClass("in")
          .addClass("out");
      }, selectionDuration);
      setTimeout(function () {
        showWord(nextWord, typeLettersDelay);
      }, typeAnimationDelay);
    } else if ($word.parents(".cd-headline").hasClass("letters")) {
      var bool =
        $word.children("i").length >= nextWord.children("i").length
          ? true
          : false;
      hideLetter($word.find("i").eq(0), $word, bool, lettersDelay);
      showLetter(nextWord.find("i").eq(0), nextWord, bool, lettersDelay);
    } else if ($word.parents(".cd-headline").hasClass("clip")) {
      $word
        .parents(".cd-words-wrapper")
        .animate({ width: "2px" }, revealDuration, function () {
          switchWord($word, nextWord);
          showWord(nextWord);
        });
    } else if ($word.parents(".cd-headline").hasClass("loading-bar")) {
      $word.parents(".cd-words-wrapper").removeClass("is-loading");
      switchWord($word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, barAnimationDelay);
      setTimeout(function () {
        $word.parents(".cd-words-wrapper").addClass("is-loading");
      }, barWaiting);
    } else {
      switchWord($word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, animationDelay);
    }
  }

  function showWord($word, $duration) {
    if ($word.parents(".cd-headline").hasClass("type")) {
      showLetter($word.find("i").eq(0), $word, false, $duration);
      $word.addClass("is-visible").removeClass("is-hidden");
    } else if ($word.parents(".cd-headline").hasClass("clip")) {
      $word
        .parents(".cd-words-wrapper")
        .animate({ width: $word.width() + 10 }, revealDuration, function () {
          setTimeout(function () {
            hideWord($word);
          }, revealAnimationDelay);
        });
    }
  }

  function hideLetter($letter, $word, $bool, $duration) {
    $letter.removeClass("in").addClass("out");

    if (!$letter.is(":last-child")) {
      setTimeout(function () {
        hideLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else if ($bool) {
      setTimeout(function () {
        hideWord(takeNext($word));
      }, animationDelay);
    }

    if ($letter.is(":last-child") && $("html").hasClass("no-csstransitions")) {
      var nextWord = takeNext($word);
      switchWord($word, nextWord);
    }
  }

  function showLetter($letter, $word, $bool, $duration) {
    $letter.addClass("in").removeClass("out");

    if (!$letter.is(":last-child")) {
      setTimeout(function () {
        showLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else {
      if ($word.parents(".cd-headline").hasClass("type")) {
        setTimeout(function () {
          $word.parents(".cd-words-wrapper").addClass("waiting");
        }, 200);
      }
      if (!$bool) {
        setTimeout(function () {
          hideWord($word);
        }, animationDelay);
      }
    }
  }

  function takeNext($word) {
    return !$word.is(":last-child")
      ? $word.next()
      : $word.parent().children().eq(0);
  }

  function takePrev($word) {
    return !$word.is(":first-child")
      ? $word.prev()
      : $word.parent().children().last();
  }

  function switchWord($oldWord, $newWord) {
    $oldWord.removeClass("is-visible").addClass("is-hidden");
    $newWord.removeClass("is-hidden").addClass("is-visible");
  }
});
// progress bar js code here
$(document).ready(function () {
  let progress_bar = document.querySelectorAll(
    "#skill-section .progress .progress-bar"
  );
  let progress_tip = document.querySelectorAll("#skill-section .progress .tip");
  let progress_arr = Array.from(progress_bar);
  let progress_tip_arr = Array.from(progress_tip);
  // console.log(progress_tip_arr)

  progress_arr.map((item) => {
    let progress_start = 0;
    let progress_end = item.dataset.width;
    let progress_speed = item.dataset.speed;
    function progress_js() {
      item.style.width = `${progress_start}%`;
      if (progress_start == progress_end) {
        clearInterval(progress_stop);
      }
    }

    let progress_stop = setInterval(() => {
      progress_js();
      progress_start++;
    }, progress_speed);
  });

  progress_tip_arr.map((tip_item) => {
    let span_start = 0;
    let span_end = tip_item.dataset.width;
    let span_speed = tip_item.dataset.speed;

    function my_fun() {
      tip_item.innerHTML = `${span_start}%`;
      if (span_start == span_end) {
        clearInterval(span_stop);
      }
    }
    let span_stop = setInterval(() => {
      my_fun();
      span_start++;
    }, span_speed);
  });
});
// skill section swipper js code here
$(document).ready(function () {
  const swiper = new Swiper("#skill-section .swiper", {
    // effect: "cube",
    // cubeEffect: {
    //   slideShadows: false,
    //   shadow: false,
    // },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: true,
      pauseOnMouseEnter: true,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    //   hideOnClick: true,
    // },

    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 576px
      576: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      // when window width is >= 992px
      992: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
});
// portfolio filter js code here
$(document).ready(function () {
  $(document).ready(function () {
    $(".portfolios").filterData({
      aspectRatio: "8:5",
      nOfRow: 3,
      itemDistance: 0,
    });
    $(".portfolio-controllers button").on("click", function () {
      $(".portfolio-controllers button").removeClass("active-work");
      $(this).addClass("active-work");
    });
  });
});
// venobox js code here
$(document).ready(function () {
  $("#port-section .portfolios .venobox").venobox();
});
// counter js code here
$(document).ready(function () {
  let counter_item = document.querySelectorAll(
    "#counter-section .counter-content .counter_item"
  );
  let counter_arr = Array.from(counter_item);

  counter_arr.map((item) => {
    let counter_start = 0;
    let counter_end = item.dataset.num;
    let counter_speed = item.dataset.speed;

    function counterjs() {
      item.innerHTML = counter_start;
      if (counter_start == counter_end) {
        clearInterval(counter_stop);
      }
    }

    let counter_stop = setInterval(() => {
      counterjs();
      counter_start++;
    }, counter_speed);
  });
});

// testimonial section swipper js code here
$(document).ready(function () {
  const swiper = new Swiper("#testi-section .swiper", {
    // effect: "cube",
    // cubeEffect: {
    //   slideShadows: false,
    //   shadow: false,
    // },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: true,
      pauseOnMouseEnter: true,
    },
    centeredSlides: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    //   hideOnClick: true,
    // },

    // Responsive breakpoints

    breakpoints: {
      // when window width is >= 576px
      576: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      // when window width is >= 992px
      992: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
});

// blog section swipper js code here
$(document).ready(function () {
  const swiper = new Swiper("#blog-section .swiper", {
    // effect: "cube",
    // cubeEffect: {
    //   slideShadows: false,
    //   shadow: false,
    // },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: true,
      pauseOnMouseEnter: true,
    },
    centeredSlides: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    //   hideOnClick: true,
    // },

    // Responsive breakpoints

    breakpoints: {
      // when window width is >= 576px
      576: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      // when window width is >= 992px
      992: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
    },
  });
});
// to top button js code here
$(document).ready(function () {
  $(window).on("scroll", function () {
    let scrollPx = $(window).scrollTop();
    if (scrollPx > 800) {
      $(".to-top-btn").addClass("to-top-fixed");
    } else {
      $(".to-top-btn").removeClass("to-top-fixed");
    }
  });
  $(".to-top-btn").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });
});
// color switcher js code here
$(document).ready(function () {
  var colorSheets = [
    {
      color: "#75a3a3",
      title: "Switch to Default",
      href: "assets/css/theme-colors/default-color.css",
    },
    {
      color: "#c1d544",
      title: "Switch to Yeollow",
      href: "assets/css/theme-colors/yellow-color.css",
    },
    {
      color: "#666bb2",
      title: "Switch to Steelblue",
      href: "assets/css/theme-colors/steelblue-color.css",
    },
    {
      color: "#ff1a1a",
      title: "Switch to Orangered",
      href: "assets/css/theme-colors/orangered-color.css",
    },
    {
      color: "#ff1a8c",
      title: "Switch to Magenta",
      href: "assets/css/theme-colors/pink-color.css",
    },
    {
      color: "#4775d1",
      title: "Switch to royelblue",
      href: "assets/css/theme-colors/royelblue-color.css",
    },
  ];

  ColorSwitcher.init(colorSheets);
});
