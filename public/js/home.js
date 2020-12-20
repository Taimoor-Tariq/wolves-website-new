let icons = {
    "Twitter": [`<i class="fab fa-twitter"></i>`, "https://twitter.com/"],
    "YouTube": [`<i class="fab fa-youtube"></i>`, ""]
};

// function switchTeam(team) {
//     let checkedSubTeams = [];
//     document.getElementById("teamsDisplay").innerHTML = "";

//     let btns = document.getElementsByClassName("teamSelectionBtn");
//     for (var i = 0; i < btns.length; i++) btns[i].classList.remove("active");
//     document.getElementById(team).classList.add("active");

//     for (var i in siteData.Players) {
//         if (i.split(" ")[0] == team) {
//             if (!checkedSubTeams.includes(i.split(" ")[1])) checkedSubTeams.push(i);
//         }
//     }

//     for (var i in checkedSubTeams) {
//         team = team.replace("_", " ");
//         document.getElementById("teamsDisplay").innerHTML += `
// 			<div class="team-container" style="background: url(${siteData.Players[checkedSubTeams[i]].Banner});" onclick="window.location.href='team?team=${checkedSubTeams[i]}'">
				
// 			</div>
// 		`;
//     }
// }

// function loadGames() {
//     var n = 0;
//     var games = siteData.Events;
//     for (var i in games) {
//         document.getElementById("matchesDisplay").innerHTML += `
// 			<div class="matches-container">
// 				<div class="matches-left">
// 					<img class="logo" src="/siteImages/icon.png" alt="Wolves Logo" onclick="window.location.href='esports'">
// 					<p class="roster_name" onclick="window.location.href='${games[i].OurRosterURL}'">Wichita Wolves</p>
// 				</div>

// 				<div class="midInfo">
// 					<p class="title">${games[i].EventTitle}</p>
// 					<p class="grey">${games[i].EventTime}</p>
// 					<p class="vs">VS</p>
// 					<p class="grey">${games[i].EventGame}</p>
// 				</div>

// 				<div class="matches-right">
// 					<img class="logo" src="${games[i].OpponentLOGO}" alt="Opponent Logo" onclick="openUrl('${games[i].OpponentURL}')">
// 					<p class="roster_name" onclick="openUrl('${games[i].OpponentRosterURL}')">${games[i].OpponentRoster}</p>
// 				</div>
// 			</div>
// 		`;
//         n++;

//         if (n == 3) break;
//     }
// }

// function loadStreams() {
//     var n = 0;
//     var streamers = siteData.ContentCreators.twitchStreamers;
//     for (var i in streamers) {
//         if (streamers[i].views == 0) streamers[i].views = "";

//         let streamsDisplay = `
// 			<div class="streams-container" style="background: url(${streamers[i].ThubmnailURL})">
// 				<p class="streamerStatus">${streamers[i].views} ${streamers[i].live}</p>
// 				<p class="streamerName">${streamers[i].Name}</p>
// 				<p class="streamerTitle">${streamers[i].Title}</p>
// 				<div class="socials-container">
// 					<a href="https://www.twitch.tv/${streamers[i].TwitchName}" target="_blank" rel="noopener">&nbsp; <i class="fab fa-twitch"></i> &nbsp;</a>
// 			`;

//         for (var j in streamers[i].Socials) {
//             streamsDisplay += `<a href="${icons[j][1]}${streamers[i].Socials[j]}" target="_blank" rel="noopener">&nbsp; ${icons[j][0]} &nbsp;</a>`
//         }

//         streamsDisplay += "</div></div>"
//         document.getElementById("streamsDisplay").innerHTML += streamsDisplay;
//         n++;

//         if (n == 3) break;
//     }
// }


var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);