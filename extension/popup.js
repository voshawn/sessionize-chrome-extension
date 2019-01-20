const SHARE_URL = "http://www.sessionize.me"
// MESSAGE LISTENERS
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const {message, payload } = request
    switch(message) {
      case "SET_SHARE_URL":
        updateShareUrl(payload)
        break;
      default:
    }
  }
);

// BUTTON ACTIONS
const shareSession = () => {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    const url = tabs[0].url;
    console.log(url)
    const bkg = chrome.extension.getBackgroundPage()
    bkg.sendGetStorageMessage(url)
  });
}


const updateShareUrl = shareUrl => {
  textField = document.getElementById("shareUrlText")
  textField.value = shareUrl
  textField.select()
  document.execCommand("copy")
  document.getElementById("clipboardHint").innerHTML = "Copied to Clipboard!"
}

// POPUP SPECIFIC EVENT LISTENERS
document.getElementById('shareSessionBtn').addEventListener('click', shareSession);




