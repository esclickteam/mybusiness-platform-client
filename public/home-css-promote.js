/* Promote deferred homepage /assets/*.css from media=print to all without inline handlers. */
(function () {
  function promote(link) {
    if (!link || link.tagName !== "LINK") return;
    if (link.media === "all") return;
    link.media = "all";
  }
  function scan() {
    var links = document.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]');
    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];
      if (link.media !== "print" && link.media !== "only x") continue;
      if (link.sheet) {
        promote(link);
        continue;
      }
      link.addEventListener("load", function onLoad(event) {
        event.currentTarget.removeEventListener("load", onLoad);
        promote(event.currentTarget);
      });
      // Cached stylesheets may not fire load; poll briefly.
      (function (node) {
        var tries = 0;
        var timer = setInterval(function () {
          tries += 1;
          if (node.sheet || tries > 40) {
            clearInterval(timer);
            promote(node);
          }
        }, 50);
      })(link);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }
})();
