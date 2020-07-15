var FETCHED = {};
Array.from(document.querySelectorAll("a")).forEach(function (element) {
  element.addEventListener("mouseenter", function addLink() {
    if (FETCHED[element.href]) {
      return;
    }

    FETCHED[element.href] = true;

    var link = document.createElement("link");
    link.href = element.href;
    link.rel = "prerender";
    document.head.appendChild(link);

    element.removeEventListener("mouseenter", addLink);
  });
});
