

var s = document.createElement('script');
s.src = chrome.runtime.getURL('inpage.js');

(document.head || document.documentElement).appendChild(s);


const port = chrome.runtime.connect({ name: 'etcwallet' });


port.onMessage.addListener((data) => {
  if (data.key == 'contentGetAddr') {
    window.postMessage({ 'contentGetAddr': data.val });
  } else if (data.key == 'contentNetwork') {
    window.postMessage({ 'contentNetwork': data.val });
  } else if (data.key == 'sign') {
    window.postMessage({ 'contentSign': data.val });
  } else if (data.key == 'addAsset') {
    window.postMessage({ 'contentAddAsset': data.val });
  } else if (data.key == 'addChain') {
    window.postMessage({ 'contentAddChain': data.val });
  } else if (data.key == 'switchChain') {
    window.postMessage({ 'contentSwitchChain': data.val });
  } else {
    window.postMessage({ 'inpageHash': data });
  }
});


window.addEventListener('message', function(e) {  // 监听 message 事件
  if (e.data.inpageSend) {
    port.postMessage({ contentSend: e.data.inpageSend });
  }
  if (e.data.inpageSign) {
    port.postMessage({ contentSign: e.data.inpageSign });
  }

  if (e.data.inpageLoad) {
    port.postMessage({ contentGetAddr: e.data.inpageLoad });
  }
  if (e.data.inpageNetwork) {
    port.postMessage({ contentNetwork: 'contentNetwork' });
  }
  if (e.data.inpageAddAsset) {
    port.postMessage({ contentAddAsset: e.data.inpageAddAsset });
  }
  if (e.data.inpageAddChain) {
    port.postMessage({ contentAddChain: e.data.inpageAddChain });
  }
  if (e.data.inpageSwitchChain) {
    port.postMessage({ contentSwitchChain: e.data.inpageSwitchChain });
  }
});



