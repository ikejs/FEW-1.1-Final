const searchInput = document.getElementById("search-input");
const resultsEl = document.getElementById("results");
const recentsEl = document.getElementById("recents");
const elem = document.getElementById("loaderProgress");
const recents = [];

// only use API shortly after user is finished typing to prevent rate limiting.
let timer = null;
function keyDown() {
  const code = (window.event.keyCode ? window.event.keyCode : window.event.which);
    if((code == 13) || (code == 8) || (code == 46)) { // if Enter or Delete is pressed,
      return // don't search.
    }
    clearTimeout(timer); 
       timer = setTimeout(search, 500)
}

function searchAgain(recent) {
  searchInput.value = recent;
  search();
}

// fetch JSON from Giphy API and append images to results div
function search() {
  startSlider();
  const q = searchInput.value;
  const path = `http://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${q}`;
  fetch(path)
  .then(function(res) {
      return res.json();
  }).then(function(json) {
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

      // if query is not in recents, add to beginning of recents array and remove any more than five recents.
      if(!recents.includes(q)) {
        recents.splice(4);
        recents.unshift(q);
        let recentsHTML = "";
        recents.forEach(function(obj) {
            recentsHTML = recentsHTML + `<li class="recent" onclick="searchAgain('${obj}')">${obj}</li>`;
        });
        recentsEl.innerHTML = recentsHTML;
      }


  }).catch(function(err) {
      console.log(err.message);
  });
}



// loader bar
function startSlider() {
  let width = 0;
  elem.style.width = width + "%";
  elem.style.display = "block"
    const id = setInterval(function() {
      if (width >= 100) {
        clearInterval(id);
        elem.style.display = "none"
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }, 10);
}

// load default gifs
searchAgain('puppies')