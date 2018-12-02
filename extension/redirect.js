const urlParams = new URLSearchParams(window.location.search)
const iv = urlParams.get('iv')
const ct = urlParams.get('ct')

const triggerAlert = async (iv, ct) => {
  response = await getSession(iv, ct)
  if (response.data.url) {
    conf = confirm(`Accept session for: \n${response.data.url}`)
    if (conf) {
      request = {
        message: "SET_SESSION",
        payload: response.data
      }
      chrome.runtime.sendMessage(request);
    } else {
    }
  } else {
    alert("Invalid or Expired Code")
  }
}


const redirect = (url, _cookies) => {
  console.log("redirect", url)
}

if (iv && ct) {
  triggerAlert(iv, ct)
}


