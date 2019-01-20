// MESSAGE LISTENERS
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const {message, payload } = request
    switch(message) {
      case "SET_SESSION":
        deleteAllCookies(payload.url)
        setTimeout(function(){
          // TODO: Fix Hacky timeout function
          setAllCookies(payload, () => {
            chrome.tabs.update(sender.tab.id, {url: payload.url})
            setTimeout(function(){
              sendSetLocalStorageMessage(payload)
            }, 5000);
          })
        }, 1000);
        break;
      case "SEND_LOCAL_STORAGE":
        getAllCookies(payload, sendSession)
        break;
      default:
    }
  }
);

// MESSAGE SENDING
function sendGetStorageMessage(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {message: "GET_STORAGE", payload: {url: url}}, function(response) {});
});
}

function sendSetLocalStorageMessage(payload) {
  console.log("Sent SET_STORAGE Message")
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {message: "SET_STORAGE", payload: payload}, function(response) {});
});
}
function sendSetShareUrlMessage(shareUrl) {
  request = {
    message: "SET_SHARE_URL",
    payload: shareUrl
  }
  chrome.runtime.sendMessage(request);
}

// API
const BASE_URL = "https://sessionize-me.herokuapp.com"
const SHARE_URL = "http://www.sessionize.me"

const sendSession = async (payload) => {
  response = await postSession(payload)
  shareUrl = `${SHARE_URL}/code/?iv=${response.data.iv}&ct=${response.data.ct}`
  sendSetShareUrlMessage(shareUrl)
}


async function postSession (data) {
  const response = await fetch(`${BASE_URL}/api/session`, {
    method: "POST",
    mode: "cors",
    headers: {"Content-Type": "application/json; charset=utf-8"},
    body: JSON.stringify(data)
  })
  return response.json();
}

// COOKIES FUNCTIONS
function getAllCookies(payload, callback) {
 chrome.cookies.getAll(
   {"url": payload.url}, c => {
     callback({...payload, cookies: c})
   })
}

function setAllCookies({url, cookies}, callback) {
  cookies.map(cookie => {setCookie(url, cookie)})
  callback()
}

function deleteAllCookies(url) {
  getAllCookies({url:url}, deleteCookie)
}

const deleteCookie = ({cookies, url}) => {
  cookies.map(({ name }) => {
    chrome.cookies.remove(
      {
        url,
        name
      },
      c => {
        console.log("REMOVED: ", c)
    })
  })
}
const setCookie = (url, {domain, expirationDate, httpOnly,
  name, path, sameSite, secure, storeId, value}) => {
  const details = {
    domain, expirationDate, httpOnly, name,
    path, sameSite, secure, storeId, url, value,
  }
  chrome.cookies.set(
    details,
    c => {
      console.log("SET: ", c)
    }
  )
}

