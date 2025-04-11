/*
  Dimension by HTML5 UP
  html5up.net | @ajlkn
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $header = $("#header"),
    $footer = $("#footer"),
    $main = $("#main"),
    $main_articles = $main.children("article");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Fix: Flexbox min-height bug on IE.
  if (browser.name == "ie") {
    var flexboxFixTimeoutId;

    $window
      .on("resize.flexbox-fix", function () {
        clearTimeout(flexboxFixTimeoutId);

        flexboxFixTimeoutId = setTimeout(function () {
          if ($wrapper.prop("scrollHeight") > $window.height())
            $wrapper.css("height", "auto");
          else $wrapper.css("height", "100vh");
        }, 250);
      })
      .triggerHandler("resize.flexbox-fix");
  }

  // Nav.
  var $nav = $header.children("nav"),
    $nav_li = $nav.find("li");

  // Add "middle" alignment classes if we're dealing with an even number of items.
  if ($nav_li.length % 2 == 0) {
    $nav.addClass("use-middle");
    $nav_li.eq($nav_li.length / 2).addClass("is-middle");
  }

  // Main.
  var delay = 325,
    locked = false;

  // Methods.
  $main._show = function (id, initial) {
    var $article = $main_articles.filter("#" + id);

    // No such article? Bail.
    if ($article.length == 0) return;

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != "undefined" && initial === true)) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Mark as visible.
      $body.addClass("is-article-visible");

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass("active");

      // Hide header, footer.
      $header.hide();
      $footer.hide();

      // Show main, article.
      $main.show();
      $article.show();

      // Activate article.
      $article.addClass("active");

      // Unlock.
      locked = false;

      // Unmark as switching.
      setTimeout(
        function () {
          $body.removeClass("is-switching");
        },
        initial ? 1000 : 0
      );

      return;
    }

    // Lock.
    locked = true;

    // Article already visible? Just swap articles.
    if ($body.hasClass("is-article-visible")) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter(".active");

      $currentArticle.removeClass("active");

      // Show article.
      setTimeout(function () {
        // Hide current article.
        $currentArticle.hide();

        // Show article.
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass("is-article-visible");

      // Show article.
      setTimeout(function () {
        // Hide header, footer.
        $header.hide();
        $footer.hide();

        // Show main, article.
        $main.show();
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }
  };

  $main._hide = function (addState) {
    var $article = $main_articles.filter(".active");

    // Article not visible? Bail.
    if (!$body.hasClass("is-article-visible")) return;

    // Add state?
    if (typeof addState != "undefined" && addState === true)
      history.pushState(null, null, "#");

    // Handle lock.

    // Already locked? Speed through "hide" steps w/o delays.
    if (locked) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Deactivate article.
      $article.removeClass("active");

      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      $body.removeClass("is-article-visible");

      // Unlock.
      locked = false;

      // Unmark as switching.
      $body.removeClass("is-switching");

      // Window stuff.
      $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

      return;
    }

    // Lock.
    locked = true;

    // Deactivate article.
    $article.removeClass("active");

    // Hide article.
    setTimeout(function () {
      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      setTimeout(function () {
        $body.removeClass("is-article-visible");

        // Window stuff.
        $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

        // Unlock.
        setTimeout(function () {
          locked = false;
        }, delay);
      }, 25);
    }, delay);
  };

  // Articles.
  $main_articles.each(function () {
    var $this = $(this);

    // Close.
    $('<div class="close">Close</div>')
      .appendTo($this)
      .on("click", function () {
        location.hash = "";
      });

    // Prevent clicks from inside article from bubbling.
    $this.on("click", function (event) {
      event.stopPropagation();
    });
  });

  // Events.
  $body.on("click", function (event) {
    // Article visible? Hide.
    if ($body.hasClass("is-article-visible")) $main._hide(true);
  });

  $window.on("keyup", function (event) {
    switch (event.keyCode) {
      case 27:
        // Article visible? Hide.
        if ($body.hasClass("is-article-visible")) $main._hide(true);

        break;

      default:
        break;
    }
  });

  $window.on("hashchange", function (event) {
    // Empty hash?
    if (location.hash == "" || location.hash == "#") {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $main._hide();
    }

    // Otherwise, check for a matching article.
    else if ($main_articles.filter(location.hash).length > 0) {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Show article.
      $main._show(location.hash.substr(1));
    }
  });

  // Scroll restoration.
  // This prevents the page from scrolling back to the top on a hashchange.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $("html,body");

    $window
      .on("scroll", function () {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      })
      .on("hashchange", function () {
        $window.scrollTop(oldScrollPos);
      });
  }

  // Initialize.

  // Hide main, articles.
  $main.hide();
  $main_articles.hide();

  // Initial article.
  if (location.hash != "" && location.hash != "#")
    $window.on("load", function () {
      $main._show(location.hash.substr(1), true);
    });
})(jQuery);
function openGmail() {
  const email = "sonalshrimali578@gmail.com";
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
  window.open(url, "_blank");
}

let slideIndex1 = 0;
let slideIndex2 = 0;
let slideIndex3 = 0;

// Show slides based on container and index variable
function showSlides(containerId, n, slideIndexVar) {
  let slides = document.querySelectorAll(`#${containerId} .carousel-item`);
  let slideIndex;

  if (slideIndexVar === "slideIndex1") slideIndex = slideIndex1;
  else if (slideIndexVar === "slideIndex2") slideIndex = slideIndex2;
  else slideIndex = slideIndex3;

  if (n >= slides.length) n = 0;
  if (n < 0) n = slides.length - 1;

  slides.forEach(slide => slide.style.display = "none");
  slides[n].style.display = "block";

  if (slideIndexVar === "slideIndex1") slideIndex1 = n;
  else if (slideIndexVar === "slideIndex2") slideIndex2 = n;
  else slideIndex3 = n;
}

// Move to next slide
function nextSlide(containerId, slideIndexVar) {
  if (slideIndexVar === "slideIndex1") {
    showSlides(containerId, slideIndex1 + 1, "slideIndex1");
  } else if (slideIndexVar === "slideIndex2") {
    showSlides(containerId, slideIndex2 + 1, "slideIndex2");
  } else {
    showSlides(containerId, slideIndex3 + 1, "slideIndex3");
  }
}

// Move to previous slide
function prevSlide(containerId, slideIndexVar) {
  if (slideIndexVar === "slideIndex1") {
    showSlides(containerId, slideIndex1 - 1, "slideIndex1");
  } else if (slideIndexVar === "slideIndex2") {
    showSlides(containerId, slideIndex2 - 1, "slideIndex2");
  } else {
    showSlides(containerId, slideIndex3 - 1, "slideIndex3");
  }
}

// Initialize all carousels on load
document.addEventListener("DOMContentLoaded", function () {
  showSlides('carousel1', 0, 'slideIndex1');
  showSlides('carousel2', 0, 'slideIndex2');
  showSlides('carousel3', 0, 'slideIndex3');
});


//let slideIndex1 = 0;
//let slideIndex2 = 0;

// Function to show slides for a specific container
//function showSlides(containerId, n, slideIndexVar) {
  //const carousel = document.getElementById(containerId);
  //const slides = carousel.getElementsByClassName("carousel-item");

  // If the index exceeds the number of slides, reset it to 0 to create forward loop
  //if (index >= slides.length) {
    //index = 0; // Reset to first slide when reaching the last slide
  //}

  // Make sure not to go backward
  //if (index < 0) {
    //index = slides.length - 1; // Go to the last slide if scrolling back before the first one
  //}

  // Apply CSS transform for smooth forward transition
  //carousel.style.transition = "transform 0.5s ease-in-out";
  //carousel.style.transform = `translateX(${-index * 100}%)`;

  // Update the index variables for each container separately
  //if (slideIndexVar === "slideIndex1") {
    //slideIndex1 = index;
  //} else {
    //slideIndex2 = index;
  //}
//}

// Function to go to the next slide for a specific container
//function nextSlide(containerId, slideIndexVar) {
  //if (slideIndexVar === "slideIndex1") {
    //showSlides(containerId, slideIndex1 + 1, "slideIndex1");
  //} else {
    //showSlides(containerId, slideIndex2 + 1, "slideIndex2");
  //}
//}

// Function to go to the previous slide for a specific container
//function prevSlide(containerId, slideIndexVar) {
  //if (slideIndexVar === "slideIndex1") {
    //showSlides(containerId, slideIndex1 - 1, "slideIndex1");
  //} else {
    //showSlides(containerId, slideIndex2 - 1, "slideIndex2");
  //}
//}


// ✅ Initialize carousel on page load
//document.addEventListener("DOMContentLoaded", function () {
 // showSlides('carousel1', 0, 'slideIndex1');
//});
