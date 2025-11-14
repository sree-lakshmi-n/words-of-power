`use strict`;
/* Global variables declaration */
const maingame = function () {
  this.wordlist = "";
  this.currword = "";
  this.score = 0;
  this.noOfWords = 0;
  this.tab = [];
  this.easyWordlist = "";
  this.medWordlist = "";
  this.hardWordlist = "";
  this.mins = 1.5;
  this.secs = 0;
  this.timetempone = 0;
  this.timetemptwo = 0;
  this.linenum = 17;
};

// Getter and setter functions for global variables
maingame.prototype.getValue = function (key) {
  return this[key];
};
maingame.prototype.setValue = function (key, value) {
  this[key] = value;
};

// Initial setup
var mgame = new maingame();

includeHTML("w3-include-html-main");
includeHTML("w3-include-html-game");
includeHTML("w3-include-html-result");
play();

function includeHTML(arg) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute(arg);
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute(arg);
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

function reset() {
  play();
  timerStrokeReset();
}
function play() {
  hideElement(_("contentid3"));
  showElement(_("contentid1"));
  mgame.setValue("score", 0);
  mgame.setValue("tab", []);
  clearTimeout(mgame.getValue("timetempone"));
  clearTimeout(mgame.getValue("timetemptwo"));

  $(document).ready(function () {
    $.ajax({
      type: "GET",
      url: "difficultySheet.csv",
      dataType: "text",
      success: function (data) {
        processData(data);
        var arr = mgame.getValue("easyWordlist");
        var easywords = [...arr].filter((word) => word.Difficulty == "easy");
        var mediumwords = [...arr].filter(
          (word) => word.Difficulty == "medium"
        );
        var hardwords = [...arr].filter((word) => word.Difficulty == "hard");
        mgame.setValue("easyWordlist", formWordlist(easywords));
        mgame.setValue("medWordlist", formWordlist(mediumwords));
        mgame.setValue("hardWordlist", formWordlist(hardwords));
      },
    });
  });
}

function processData(csv) {
  mgame.setValue("easyWordlist", $.csv.toObjects(csv));
  return $.csv.toObjects(csv);
}

function formWordlist(givenWordlist) {
  var obj = {};
  for (let i = 0; i < givenWordlist.length; i++) {
    var keyy = givenWordlist[i].Word;
    var valuee = givenWordlist[i].Meaning;
    obj[keyy] = valuee;
  }
  return obj;
}

/*Setting wordlist */
function setWordList(ele) {
  switch (ele) {
    case "easy":
      mgame.setValue("wordlist", mgame.getValue("easyWordlist"));
      break;
    case "medium":
      mgame.setValue("wordlist", mgame.getValue("medWordlist"));
      break;
    case "hard":
      mgame.setValue("wordlist", mgame.getValue("hardWordlist"));
      break;
  }
  mgame.setValue("noOfWords", Object.keys(mgame.getValue("wordlist")).length);
}

/*Fetching Key */
function key(int) {
  var j = -1;
  let num = mgame.getValue("wordlist");
  for (var i in num) {
    j++;
    if (j == int) {
      return i;
    } else {
      continue;
    }
  }
}

function _(selector) {
  return document.getElementById(selector);
}

function hideElement(elem) {
  elem.classList.remove("show");
  elem.classList.add("hide");
}

function showElement(elem) {
  elem.classList.remove("hide");
  elem.classList.add("show");
}

function fillText(elem, text) {
  elem.innerText = text;
}

function fillValue(elem, val) {
  elem.value = val;
}

function fillHTML(elem, code) {
  elem.innerHTML = code;
}

function fillPlaceHolder(elem, text) {
  elem.placeholder = text;
}

function setColor(elem, colour) {
  elem.style.color = colour;
}

function setStroke(elem, colour) {
  elem.style.stroke = colour;
}

/* Timer */
function countdown() {
  mgame.setValue("timetempone", setTimeout("Decrement()", 60));
}

function Decrement() {
  if (true) {
    minutes = _("minutes");
    seconds = _("seconds");
    if (seconds < 59) {
      fillText(seconds, mgame.getValue("secs"));
    } else {
      fillText(minutes, getminutes());
      fillText(seconds, getseconds());
    }

    if (mgame.getValue("mins") < 0.5 && mgame.getValue("secs") < 30) {
      setColor(minutes, "red");
      setColor(seconds, "red");
      setColor(_("timeDivider"), "red");
    }

    if (mgame.getValue("mins") <= 0 && mgame.getValue("secs") <= 0) {
      change("result");
      fillText(minutes, 0);
      fillText(seconds, 0);
    } else {
      let temp = mgame.getValue("secs") - 1;
      mgame.setValue("secs", temp);
      mgame.setValue("timetemptwo", setTimeout("Decrement()", 1000));
    }

    // Timer mins and secs zero padding
    fillText(minutes, "0" + mgame.getValue("mins"));
    if (mgame.getValue("secs") < 9)
      fillText(seconds, "0" + (mgame.getValue("secs") + 1));
    if (mgame.getValue("secs") < 69 && mgame.getValue("secs") >= 59)
      fillText(seconds, "0" + (mgame.getValue("secs") - 59));
  }

  // Timer animation
  if (mgame.getValue("secs") >= 36 && mgame.getValue("secs") % 3 == 0) {
    setStroke(
      _(`Line_10_${mgame.getValue("linenum")}_1_--inject-1`),
      "#30314D"
    );
    mgame.setValue("linenum", mgame.getValue("linenum") - 1);
  } else if (mgame.getValue("secs") < 36 && mgame.getValue("secs") % 2 == 0) {
    if (mgame.getValue("linenum") < 0) mgame.setValue("linenum", 17);
    setStroke(
      _(`Line_11_${mgame.getValue("linenum")}_1_--inject-1`),
      "#30314D"
    );
    mgame.setValue("linenum", mgame.getValue("linenum") - 1);
  }
}

function getminutes() {
  mgame.setValue("mins", Math.floor(mgame.getValue("secs") / 60));
  return mgame.getValue("mins");
}

function getseconds() {
  return mgame.getValue("secs") - Math.round(mgame.getValue("mins") * 60);
}

// Timer Stroke Reset
function timerStrokeReset() {
  mgame.setValue("linenum", 17);
  for (let i = 0; i < 18; i++) {
    setStroke(_(`Line_10_${i}_1_--inject-1`), "#FFFFFF");
    setStroke(_(`Line_11_${i}_1_--inject-1`), "#FFFFFF");
  }
}

function gamePageSetup(arg) {
  fillText(_("level"), arg);
  fillText(_("points"), "0");
  fillText(_("streak"), "0");
  _("wordsanswered").innerText = "";
  _("wordsmissed").innerText = "";
  setColor(_("minutes"), "#ffffff");
  setColor(_("seconds"), "#ffffff");
  setColor(_("timeDivider"), "#ffffff");
  mgame.setValue("mins", 1.5);
  mgame.setValue("secs", mgame.getValue("mins") * 60);
  countdown();
  setWordList(arg);
  dispRanWord();
}

function change(ele) {
  let arg = ele.id;
  if (ele == "result" || arg == undefined) {
    showElement(_("contentid3"));
    hideElement(_("contentid2"));
    result();
  } else {
    hideElement(_("contentid1"));
    showElement(_("contentid2"));
    gamePageSetup(arg);
  }
}

/* ClueSection display */
function dispRanWord() {
  let nWords = mgame.getValue("noOfWords");
  if (nWords > 0) {
    let ranNo = Math.floor(Math.random() * nWords);
    mgame.setValue("currword", key(ranNo));
    let currentWrd = mgame.getValue("currword");
    fillHTML(_("clueArea"), mgame.getValue("wordlist")[currentWrd]);
    fillPlaceHolder(_("usertext"), "Starts with " + currentWrd.charAt(0));
    delete mgame.getValue("wordlist")[currentWrd];
    nWords--;
    mgame.setValue("noOfWords", nWords);
  } else {
    change("result");
  }
}

// PlaySection
function checkInputWord() {
  userinput = _("usertext").value.toLowerCase();
  let currentWrd = mgame.getValue("currword");
  for (i = 0; i < userinput.length; i++) {
    if (userinput[i] == currentWrd[i]) {
      setColor(_("usertext"), "#212121");
    } else {
      setColor(_("usertext"), "#DA3E49");
    }
  }
  if (userinput == currentWrd) {
    let trackScore = mgame.getValue("score");
    let tabVal = mgame.getValue("tab");
    tabVal.push(1);
    trackScore++;
    mgame.setValue("score", trackScore);
    mgame.setValue("tab", tabVal);
    fillText(_("points"), trackScore);
    fillText(_("streak"), findStreak());
    fillValue(_("usertext"), "");
    _("wordsanswered").innerText += currentWrd + "\n";
    dispRanWord();
  }
}

// to find streak
function findStreak() {
  let tabVal = mgame.getValue("tab");
  let streaks = tabVal.reduce(
    function (res, n) {
      if (n) res[res.length - 1]++;
      else res.push(0);
      return res;
    },
    [0]
  );
  streaks.join(",");
  return Math.max.apply(Math, streaks);
}

// Skip button
function skip() {
  let tabVal = mgame.getValue("tab");
  let currentWrd = mgame.getValue("currword");
  tabVal.push(0);
  mgame.setValue("tab", tabVal);
  fillValue(_("usertext"), "");
  fillText(_("streak"), findStreak());
  _("wordsmissed").innerText += currentWrd + "\n";
  dispRanWord();
}

function result() {
  fillText(_("ans"), mgame.getValue("score"));
  fillText(_("longeststreak"), findStreak());
}
