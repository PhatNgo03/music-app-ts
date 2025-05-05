// APlayer
const aplayer = document.querySelector("#aplayer");
if(aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);

  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);
  // console.log(dataSong);

  const ap = new APlayer({
    container: aplayer,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar
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
}

//End APlayer

//Button like
const buttonLike = document.querySelector("[button-like]");
if(buttonLike){
  buttonLike.addEventListener("click",  ()=> {
    const idSong = buttonLike.getAttribute("button-like");

    const isActive = buttonLike.classList.contains("active");
    console.log(isActive);

    const typeLike = isActive ? "dislike" : "like";

    const link = `/songs/like/${typeLike}/${idSong}`;

    const option = {
      method: "PATCH"
    }
    fetch(link, option)
      .then(res => res.json())
      .then(data => {
        const span = buttonLike.querySelector("span");
        span.innerHTML = `${data.like}`;
        buttonLike.classList.toggle("active");
      });
  });
}
//End button like