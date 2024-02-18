import lanyard from "./lanyard.js";
import { Splide } from "../vendor/splide/dist/js/splide.esm.js";
lanyard({
  userId: "616731583386353665",
  socket: "true",
  onPresenceUpdate: (data) => {
    console.log(data);
    var r = document.querySelector(":root");
    var rs = getComputedStyle(r);

    document.getElementById(
      "lanyardPfp"
    ).src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`;

    switch (data.discord_status) {
      case "online":
        break;

      case "idle":
        r.style.setProperty("--status-color", "#FEE75C");
        break;

      case "offline":
        r.style.setProperty("--status-color", "#52555B");
        break;

      case "dnd":
        r.style.setProperty("--status-color", "#ED4245");
        break;
    }
  },
});
// Função principal para obter informações sobre os jogos e achievements do usuário
var userUrl = "https://api-steam-private.onrender.com/user/76561198877742966";
let userInfo = [];

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao obter dados da URL ${url}`);
    }
    return response.json();
}

async function getUserInfo() {
    try {
        const userData = await fetchData(userUrl);
        const { userGames, userAchievements } = userData;

        userGames.forEach(game => {
            const achievementsData = userAchievements[game.appID];
            const totalAchievements = achievementsData && achievementsData.achievements ? achievementsData.achievements.length : 0;
            const userAchievementsCount = achievementsData && achievementsData.achievements ? achievementsData.achievements.filter(achievement => achievement.achieved).length : 0;
            const percentage = totalAchievements > 0 ? (userAchievementsCount / totalAchievements) * 100 : 0;

            userInfo.push({
                name: game.name,
                playtime: game.playTime,
                backgroundURL: game.backgroundURL,
                achievements: totalAchievements,
                userAchievements: userAchievementsCount,
                percentage: percentage
            });
        });

        userInfo.sort((a, b) => b.percentage - a.percentage);
        displayUserInfo(userInfo);
    } catch (error) {
        console.error("Ocorreu um erro:", error.message);
    }
}

function displayUserInfo(userInfo) {
    const gamesCarousel = document.getElementById("gamesCarousel");
    var newHtml = "";

    userInfo.forEach(game => {
        let gameElementHtml = `<div class="splide__slide">
                                    <div class="container">
                                        <div class="terminal-card">
                                            <header>${game.name}</header>
                                            <div class="body">
                                                <div>
                                                    <div class="image_container"> 
                                                        <img src="${game.backgroundURL}" alt="" style="width: 200px; height: auto; 10px; border: 1px solid white;">
                                                    </div>
                                                    <p style="text-align: center; font-size: 15px;">playtime: ${Math.ceil(game.playtime / 60)} hours <br> ${game.userAchievements}/${game.achievements} </p>
                                                    <div class="progress-bar progress-bar-show-percent">
                                                        <div class="progress-bar-filled" style="width: ${Math.round(game.percentage)}%" data-filled="${Math.round(game.percentage)}%"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        newHtml += gameElementHtml;
    });

    gamesCarousel.innerHTML = newHtml;

    var splide = new Splide(".splide", {
        perPage: 3,
        rewind: true,
        perMove: 1,
        breakpoints: {
            770: {
                perPage: 1,
            },
        },
    });

    splide.mount();
}

getUserInfo();
// Agora você pode acessar a variável global userGamesInfo em outras funções conforme necessário
// console.log(userGamesInfo);

let carousel = document.getElementById("gamesCarousel");
