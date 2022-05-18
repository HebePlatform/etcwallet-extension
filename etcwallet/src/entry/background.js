const NOTIFICATION_URL = chrome.runtime.getURL('notification.html');
// import Web3 from 'web3';
//
// let web3 = new Web3();
import axios from 'axios';
import $g from './../global';

let network = '';

async function networkload() {
  network = await $g.select('network');
}

networkload();

let contentGetAddr = '';

let cport;
let account = '';


async function getCurrent() {
  return new Promise(async (resolve, reject) => {
    chrome.windows.getCurrent(function(win) {
      resolve(win);
    });
  });
}

let notificationid = '';
let notificationdata = '';
let notificationolddata = '';

async function notificationshow(data) {
  let win = await getCurrent();
  if (notificationid == '') {
    notificationid = 1;
    chrome.windows.create({
      url: NOTIFICATION_URL,
      focused: true,
      height: 600,
      left: win.width - 360,
      top: 100,
      type: 'popup',
      width: 360,
    });
    $g.save({
      key: 'dataValue',
      value: data,
    });
    notificationolddata = data;
    chrome.windows.getCurrent(function(win) {
      notificationid = win.id;
    });
    chrome.windows.onRemoved.addListener(function(windowId) {
      notificationid = '';
      if (notificationdata != '') {
        notificationshow(notificationdata);
        notificationdata = '';
      }
    });
  } else {
    if (notificationolddata.method != data.method) {
      notificationdata = data;
    }
  }

}


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.setprv) {
    account = request.setprv;
    if (!request.setprv.addr) {
      account = '';
    }
    sendResponse('');
  }
  if (request.getprv) {
    sendResponse(account);
    return;
  }
  if (request.addr) {
    let index = await getConnect(contentGetAddr);
    if (index == -1 && contentGetAddr != '') {
      notificationshow({
        method: 'Connect',
        data: contentGetAddr,
      });
    } else {
      if (cport) {
        cport.postMessage({
          key: 'contentGetAddr',
          val: request.addr,
        });
        contentGetAddr = '';
        sendResponse('');
      }
    }
    console.log(request.addr);
  }
  if (request.sendtx) {
    sendResponse(request.sendtx);
    cport.postMessage(request.sendtx);
    return;
  }
  if (request.sendsign) {
    sendResponse(request.sendsign);
    cport.postMessage(request.sendsign);
    return;
  }
  if (request.addAsset) {
    sendResponse(request.addAsset);
    cport.postMessage(request.addAsset);
    return;
  }
  if (request.addChain) {
    sendResponse(request.addChain);
    cport.postMessage(request.addChain);
    return;
  }
  if (request.switchChain) {
    network = await $g.select('network');
    sendResponse({ key: 'switchChain', val: network });
    cport.postMessage({ key: 'switchChain', val: network });
    return;
  }
});
chrome.runtime.onConnect.addListener(async (port) => {
  cport = port;
  port.onMessage.addListener(async (data) => {
    console.log(data);
    if (data.contentSend) {
      data.contentSend.time = new Date().getTime();
      data.contentSend.network = network;
      notificationshow(data.contentSend);
    }
    if (data.contentSign) {
      console.log(data.contentSign, 'contentSign');
      data.contentSign.time = new Date().getTime();
      data.contentSign.network = network;
      notificationshow(data.contentSign);
    }
    if (data.contentAddAsset) {
      console.log(data.contentAddAsset, 'contentAddAsset');
      data.contentAddAsset.time = new Date().getTime();
      data.contentAddAsset.network = network;
      notificationshow(data.contentAddAsset);
    }
    if (data.contentAddChain) {
      network = await $g.select('network');
      console.log(network, 'networknetworknetworknetwork');
      console.log(data.contentAddChain);
      if ($g.numberToHex(data.contentAddChain.params[0].chainId) != network.chainId) {
        console.log(data.contentAddChain, 'contentAddChain');
        data.contentAddChain.time = new Date().getTime();
        data.contentAddChain.network = network;
        notificationshow(data.contentAddChain);
      } else {
        cport.postMessage({
          key: 'addChain',
          val: '',
        });
      }

    }
    if (data.contentSwitchChain) {
      console.log(data.contentSwitchChain, 'contentSwitchChain');
      data.contentSwitchChain.time = new Date().getTime();
      data.contentSwitchChain.network = network;
      notificationshow(data.contentSwitchChain);
    }
    if (data.contentGetAddr) {
      contentGetAddr = data.contentGetAddr;
      if (account == '') {
        notificationshow({
          method: 'eth_pass',
        });
      } else {
        let index = await getConnect(contentGetAddr);
        if (index == -1) {
          notificationshow({
            method: 'Connect',
            data: contentGetAddr,
          });
        } else {
          port.postMessage({
            key: 'contentGetAddr',
            val: account.addr,
          });
          contentGetAddr = '';

        }

      }
    }
    if (data.contentNetwork) {
      network = await $g.select('network');
      port.postMessage({
        key: 'contentNetwork',
        val: network,
      });
    }
  });
  port.onDisconnect.addListener(() => console.log(`Disconnected from ${port.name}`));

});


// let omniboxlist = [];
// let omniboxtxt = '';
// chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
//   omniboxlist = [];
//   omniboxtxt = text;
//   if (!text) return;
//   if (text.indexOf('.etc') != -1) {
//     let tt = await $g.hens.getAllProperties( text, false);
//     tt.textlist.forEach(item => {
//       if (item.txt != 'Email' && item.txt != 'Avatar' && item.txt != 'IpfsUrl'
//         && item.txt != 'Notice' && item.txt != 'Keywords' && item.txt != 'Description'
//       ) {
//         if (item.val != '') {
//           omniboxlist.push(item);
//         }
//       }
//     });
//     if (omniboxlist.length == 0) {
//       suggest([
//         { content: 'Register Hens:' + text, description: 'Register Hens:' + text },
//       ]);
//     } else {
//       let list = [];
//       omniboxlist.forEach(item => {
//         list.push({
//           content: 'Hens-' + item.txt + ' ' + item.val,
//           description: 'Hens-' + item.txt + ' ' + item.val,
//         });
//       });
//       suggest(list);
//     }
//   }
// });
// chrome.omnibox.onInputEntered.addListener((text) => {
//   if (!text) return;
//   let href = '';
//   if (text.indexOf('Register Hens:') != -1 && text.indexOf('.etc') != -1) {
//     let txt = text.split('Register Hens:')[1];
//     txt = txt.split('.etc')[0];
//     href = 'https://app.hens.domains/#/search?url=' + txt;
//   }
//   if (omniboxtxt.indexOf('.etc') != -1) {
//     if (text.indexOf('Hens') == 0) {
//       let txt = text.split(' ')[1];
//       href = txt;
//     }
//   }
//   openUrlCurrentTab(href);
// });

async function getCurrentTabId() {
  return new Promise(async (resolve, reject) => {

    let queryOptions = { active: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab);
    resolve(tab.id);
  });
}

function openUrlCurrentTab(url) {
  getCurrentTabId(tabId => {
    chrome.tabs.update(tabId, { url: url });
  });
}

async function getConnect(model) {
  let listindex = -1;
  let connectlist = await $g.select('connectlist');

  connectlist.forEach((item, index) => {
    if (item.key == model.url) {
      listindex = index;
    }
  });
  return listindex;
}
