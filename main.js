const words = ["Volleyball Player", "Programmer", "CO-Leader CPS Youth", "Coder", "Software Engineer Student"];

const changingWordElement = document.getElementById("changingWord");

function changeWordWithSmoothGlitch() {
  const randomIndex = Math.floor(Math.random() * words.length);

  changingWordElement.classList.add("glitch");

  setTimeout(() => {
    changingWordElement.textContent = words[randomIndex];

    changingWordElement.classList.remove("glitch");
  }, 300);
}

setInterval(changeWordWithSmoothGlitch, 3000);
