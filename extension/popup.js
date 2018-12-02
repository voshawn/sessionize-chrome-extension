// CONSTANTS
const BASE_URL = "https://arcane-cliffs-33953.herokuapp.com"
const SHARE_URL = "http://www.sessionize.me"

//const BASE_URL = "http://localhost:4000"
//const SHARE_URL = "http://localhost:4000"
// APIs

const getSession = async (iv, ct) => {
  const response = await fetch(`${BASE_URL}/api/session?iv=${iv}&ct=${ct}`, {
    method: "GET",
    mode: "cors",
    headers: {"Content-Type": "application/json; charset=utf-8"},
  })
  return response.json();
}

const postSession = async data => {
  const response = await fetch(`${BASE_URL}/api/session`, {
    method: "POST",
    mode: "cors",
    headers: {"Content-Type": "application/json; charset=utf-8"},
    body: JSON.stringify(data)
  })
  return response.json();
}


// BUTTON ACTIONS

const shareSession = () => {
  const url = document.getElementById("urlText").value
  const bkg = chrome.extension.getBackgroundPage()
  bkg.getAllCookies(url, sendSession)
}

const getCookies = () => {
  const url = document.getElementById("urlText").value
  const bkg = chrome.extension.getBackgroundPage()
  bkg.getAllCookies(url, setCurrentText)
}
const deleteCookies = () => {
  const url = document.getElementById("urlText").value
  const bkg = chrome.extension.getBackgroundPage()
  bkg.deleteAllCookies(url, setCurrentText)
}
const setCookies = () => {
  const url = document.getElementById("urlText").value
  const newCookies = JSON.parse(document.getElementById("newText").value)
  const bkg = chrome.extension.getBackgroundPage()
  bkg.setAllCookies(url, newCookies, setNewText)
}


// CALLBACKS

const sendSession = async (url, json) => {
  payload = {
    url,
    data: json,
  }
  response = await postSession(payload)
  shareUrl = `${SHARE_URL}/code/?iv=${response.data.iv}&ct=${response.data.ct}`
  textField = document.getElementById("shareUrlText")
  textField.value = shareUrl
  textField.select()
  document.execCommand("copy")
  document.getElementById("clipboardHint").innerHTML = "Copied to Clipboard!"
}

const setCurrentText = (_url, json) => {
  text = JSON.stringify(json)
  document.getElementById("currentText").value = text
}
const setNewText = (_url, json) => {
  text = JSON.stringify(json)
  document.getElementById("newText").value = text
}


// POPUP SPECIFIC EVENT LISTENERS

document.getElementById('shareSessionBtn').addEventListener('click', shareSession);
document.getElementById('getCookiesBtn').addEventListener('click', getCookies);
document.getElementById('setCookiesBtn').addEventListener('click', setCookies);
document.getElementById('deleteCookiesBtn').addEventListener('click', deleteCookies);

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  document.getElementById('urlText').value = tabs[0].url;
});

const TABS = [...document.querySelectorAll('#tabs li')];
const CONTENT = [...document.querySelectorAll('#tab-content section')];
const ACTIVE_CLASS = 'is-active';

function initTabs() {
    TABS.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        let selected = tab.getAttribute('data-tab');
        updateActiveTab(tab);
        updateActiveContent(selected);
      })
    })
}

function updateActiveTab(selected) {
  TABS.forEach((tab) => {
    if (tab && tab.classList.contains(ACTIVE_CLASS)) {
      tab.classList.remove(ACTIVE_CLASS);
    }
  });
  selected.classList.add(ACTIVE_CLASS);
}

function updateActiveContent(selected) {
  CONTENT.forEach((item) => {
    if (item && item.classList.contains(ACTIVE_CLASS)) {
      item.classList.remove(ACTIVE_CLASS);
    }
    let data = item.getAttribute('data-content');
    if (data === selected) {
      item.classList.add(ACTIVE_CLASS);
    }
  });
}

initTabs();


