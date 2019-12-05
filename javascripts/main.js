const searchInput = document.getElementById("search-input");
const resultsEl = document.getElementById("results");
let i = 0

// only use API shortly after user is finished typing (to prevent rate limiting)
let timer = null;
function keyDown() {
    i = 0
    startSlider();
    clearTimeout(timer); 
       timer = setTimeout(search, 1000)
}

function search() {
    const q = searchInput.value;
    const path = `http://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${q}`;
    fetch(path)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json.data[0].images.fixed_width.url);
        let resultsHTML = "";
        json.data.forEach(function(obj) {
            const url = obj.images.fixed_width.url;
            const width = obj.images.fixed_width.width;
            const height = obj.images.fixed_width.height;
            const title = obj.title;
            resultsHTML += `<img
            class="item"
            src="${url}"
            width="${width}"
            height="${height}"
            alt="${title}"
            >`;
        });

        resultsEl.innerHTML = resultsHTML;
    }).catch(function(err) {
        console.log(err.message);
    });
    }



function startSlider() {
  if (i == 0) {
    const elem = document.getElementById("loaderProgress");
    const id = setInterval(frame, 10);
    let width = 0;
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}