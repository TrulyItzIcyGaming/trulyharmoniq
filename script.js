document.addEventListener("DOMContentLoaded", () => {
    console.log("script.js is loaded");
  
    const albumCards = document.querySelectorAll(".album-card");
    const expandedAlbum = document.getElementById("expanded-album");
    const albumGrid = document.querySelector(".album-grid");
  
    if (!albumCards.length) {
      console.error("No album cards found!");
      return;
    }
  
    const albumSongs = {
      "forgotten-promises": [
        { img: "assets/ForgottenPromises.jpg", link: "https://www.youtube.com/watch?v=paV6W45VX88&list=PLo35oTi5w2DxtUeNalI90tX7aTx6S6H-B&index=1" },
        { img: "assets/music/forgottenPromises/song2.jpg", link: "https://www.youtube.com/watch?v=UN4FUU0SIYU&list=PLo35oTi5w2DxtUeNalI90tX7aTx6S6H-B&index=2" },
        { img: "assets/music/forgottenPromises/song3.jpg", link: "https://www.youtube.com/watch?v=7gGHLLk4SLw&list=PLo35oTi5w2DxtUeNalI90tX7aTx6S6H-B&index=3" },
      ],
      "synthetic-fractures": [
        { img: "assets/music/SyntheticFractures/song1.jpg", link: "https://www.youtube.com/watch?v=q8d1XKR4L28&list=PLo35oTi5w2Dx0-N9x9eJ6ksOa-29uu8FX&index=1" },
        { img: "assets/music/SyntheticFractures/song2.jpg", link: "https://www.youtube.com/watch?v=cvQIhowmqsY&list=PLo35oTi5w2Dx0-N9x9eJ6ksOa-29uu8FX&index=2" },
        { img: "assets/music/SyntheticFractures/song3.jpg", link: "https://www.youtube.com/watch?v=KYKDwArGoXQ&list=PLo35oTi5w2Dx0-N9x9eJ6ksOa-29uu8FX&index=3" },
        { img: "assets/music/SyntheticFractures/song4.jpg", link: "https://www.youtube.com/watch?v=-YOvMrTZmu8&list=PLo35oTi5w2Dx0-N9x9eJ6ksOa-29uu8FX&index=4" },
      ],
      "ethereal-drift": [
        { img: "assets/music/ethernalDrift/song1.jpg", link: "https://www.youtube.com/watch?v=Y9t5WdI44PA&list=PLo35oTi5w2DxR0KpID7sYjSAlpYN3sbqM&index=1" },
        { img: "assets/music/ethernalDrift/song2.jpg", link: "https://www.youtube.com/watch?v=HrREcxV-hy4&list=PLo35oTi5w2DxR0KpID7sYjSAlpYN3sbqM&index=2" },
        { img: "assets/music/ethernalDrift/song3.jpg", link: "https://www.youtube.com/watch?v=xLFxrKaEq3c&list=PLo35oTi5w2DxR0KpID7sYjSAlpYN3sbqM&index=3" },
        { img: "assets/music/ethernalDrift/song4.jpg", link: "https://www.youtube.com/watch?v=_mIBA8YMVd4&list=PLo35oTi5w2DxR0KpID7sYjSAlpYN3sbqM&index=4" },
        { img: "assets/music/ethernalDrift/song5.jpg", link: "https://www.youtube.com/watch?v=kDGfDebV1iU&list=PLo35oTi5w2DxR0KpID7sYjSAlpYN3sbqM&index=5" },
        { img: "assets/music/ethernalDrift/song6.jpg", link: "https://www.youtube.com/watch?v=GqBIjwkKVao&list=PLo35oTi5w2DxR0KpID7sYjSAlpYN3sbqM&index=6" },
        { img: "assets/music/ethernalDrift/song7.jpg", link: "https://www.youtube.com/watch?v=sngiawiITok&list=PLo35oTi5w2DxR0KpID7sYjSAlpYN3sbqM&index=7" },
      ],
      "hollow-frequencies": [
        { img: "assets/music/hollowFreqencies/song1.png", link: "https://www.youtube.com/watch?v=kq93l0csmCA&list=PLo35oTi5w2DyC9hxGEH94kEQFF3AYVxRb&index=1" },
        { img: "assets/music/hollowFreqencies/song2.png", link: "https://www.youtube.com/watch?v=TAZNWv7kUy4&list=PLo35oTi5w2DyC9hxGEH94kEQFF3AYVxRb&index=2" },
        { img: "assets/music/hollowFreqencies/song3.png", link: "https://www.youtube.com/watch?v=NctCmaW4y7s&list=PLo35oTi5w2DyC9hxGEH94kEQFF3AYVxRb&index=3" },
        { img: "assets/music/hollowFreqencies/song4.png", link: "https://www.youtube.com/watch?v=O2qYS7FCiss&list=PLo35oTi5w2DyC9hxGEH94kEQFF3AYVxRb&index=4" },
      ],
    };
  
    albumCards.forEach((card) => {
        card.addEventListener("click", () => {
          const album = card.getAttribute("data-album");
          console.log(`Album clicked: ${album}`);
    
          if (!albumSongs[album]) {
            console.error(`No songs found for album: ${album}`);
            return;
          }
    
          // Clear previous songs
          expandedAlbum.innerHTML = "";
    
          // Add new songs
          albumSongs[album].forEach((song) => {
            const link = document.createElement("a");
            link.href = song.link;
            link.target = "_blank"; // Open in a new tab
    
            const img = document.createElement("img");
            img.src = song.img;
            img.alt = "Song Image";
            img.style.margin = "10px";
    
            link.appendChild(img);
            expandedAlbum.appendChild(link);
          });
    
          // Show expanded album
          expandedAlbum.style.display = "flex";
          expandedAlbum.style.flexWrap = "wrap";
          expandedAlbum.style.marginTop = "20px";
        });
      });
    });