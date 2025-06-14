// APlayer
function decodeHtmlEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
const aplayer = document.querySelector("#aplayer");

if(aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);

  dataSong.lyrics = decodeHtmlEntities(dataSong.lyrics).replace(/<[^>]*>/g, '').trim();;

  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);
  // console.log(dataSong);

  const ap = new APlayer({
    container: aplayer,
    lrcType: 1,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: dataSong.lyrics
      },
    ],
    //options https://aplayer.js.org/#/home
    autoplay: true,
    volume: 0.5
  });


  const avatar = document.querySelector(".singer-detail .inner-avatar");
  avatar.style.animationPlayState = "paused"; // kiem tra sk va check css

  ap.on('play', function () {
    avatar.style.animationPlayState = "running"; // kiem tra sk va check css
  });
  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused"; // kiem tra sk va check css
  });

  ap.on('ended', function () {
  const linkListen = `/songs/listen/${dataSong._id}`;
  const option = { method: "PATCH" };

  fetch(linkListen, option)
    .then(res => res.json())
    .then(data => {
        if (data.code === 200) {
          const listenBox = document.querySelector(".inner-listen span");
          if (listenBox) {
            listenBox.textContent = `${data.listen} lượt nghe`;
          }
        }
    });
  });
}

//End APlayer

//Button like
const buttonLike = document.querySelector("[button-like]");
if(buttonLike){
  buttonLike.addEventListener("click",  ()=> {
    const idSong = buttonLike.getAttribute("button-like");

    const isActive = buttonLike.classList.contains("active");

    const typeLike = isActive ? "dislike" : "like";

    const link = `/songs/like/${typeLike}/${idSong}`;

    const option = {
      method: "PATCH"
    }
    fetch(link, option)
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            if (error.code === 401) {
              window.location.href = "/user/login";
              return;
            }
            throw new Error(error.message || "Lỗi không xác định");
          });
        }
        return res.json();
      })
      .then(data => {
        if(data.code == 200){
          const span = buttonLike.querySelector("span");
          span.innerHTML = `${data.like}`;
          buttonLike.classList.toggle("active");
        }
      });
  });
}
//End button like

//Button Favorite
const listButtonFavorites = document.querySelectorAll("[button-favorite]");
if(listButtonFavorites.length > 0) {
  listButtonFavorites.forEach(button => {
    button.addEventListener("click", () => {
      const idSong = button.getAttribute("button-favorite");
      const isActive = button.classList.contains("active");
      const typeFavorite = isActive ? "unfavorite" : "favorite";
      const link = `/songs/favorite/${typeFavorite}/${idSong}`;
  
      const option = {
        method: "PATCH"
      };
  
      fetch(link, option)
        .then(res => {
          if (!res.ok) {
            return res.json().then(error => {
              if (error.code === 401) {
                window.location.href = "/user/login";
                return;
              }
              throw new Error(error.message || "Lỗi không xác định");
            });
          }
          return res.json();
        })
        .then(data => {
          if(data.code == 200){
            button.classList.toggle("active");
          }
        });
    });
  });
}


//End button like

//Search suggest
const boxSearch = document.querySelector(".box-search");
if(boxSearch){
  const input = boxSearch.querySelector("input[name='keyword']");

  const boxSuggest = boxSearch.querySelector(".inner-suggest");
  
  input.addEventListener("keyup", () => {
    const keyword = input.value;

    const link = `/search/suggest/?keyword=${keyword}`;
  
    fetch(link)
      .then(res => res.json())
      .then(data => {
        const songs = data.songs;
        console.log(songs);
        if(songs.length > 0){
          boxSuggest.classList.add("show");

          const htmls = songs.map(song => {
            return `
              <a class="inner-item" href="/songs/detail/${song.slug}">
                <div class="inner-image"><img src="${song.avatar}"/></div>
                <div class="inner-info">
                    <div class="inner-title">${song.title}</div>
                    <div class="inner-singer"><i class="fa-solid fa-microphone-lines"></i>${song.infoSinger.fullName}</div>
                </div>
              </a>
            `;
          });

          const boxList = boxSuggest.querySelector(".inner-list");
          boxList.innerHTML = htmls.join("");
        } else {
          boxSuggest.classList.remove("show");
        }
      });
  });
}
//End search suggest