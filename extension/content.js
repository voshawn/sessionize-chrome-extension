// MESSAGE LISTENERS
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  switch (msg.message) {
    case "GET_STORAGE":
      getStorage(msg.payload)
      break;
    case "SET_STORAGE":
      setStorage(msg.payload)
      // TODO: This only refreshes if URL is different.
      // Make sure this is expected behavior.
      window.location.replace(msg.payload.url)
      break;
    default:

  }
});

// STORAGE FUNCTIONS
function getStorage(payload) {
  request = {
    message: "SEND_LOCAL_STORAGE",
    payload: {localStorage:{...localStorage}, ...payload}
  }
  chrome.runtime.sendMessage(request);
}

function setStorage(payload) {
  localStorage.clear()
  Object.keys(payload.localStorage).forEach((key) => {
    localStorage.setItem(key, payload.localStorage[key])
  })
}
