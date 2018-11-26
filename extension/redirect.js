const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('id')

const setCookiesTwo = (url, cookies, redirect) => {
  console.log(cookies)
  const bkg = chrome.extension.getBackgroundPage()
  bkg.setAllCookies(url, cookies, redirect)
}
const triggerAlert = async code => {
  response = await getSession(code)
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

if (code) {
  triggerAlert(code)
}


