console.log('other script333');
window.ethereum = {
  selectedAddress: '',
  chainId: '0x3d',
  isMetaMask: true,
  isHebe: true,
  networkVersion: '1',
  api: '',
  listfn: [],
  postMessage: function(ttt) {
    window.postMessage({ 'test': ttt }, '*');
  },
  request: function(args, callbak) {
    console.log(args, args.method);

    return new Promise(async (resolve, reject) => {
      console.log(args, args.method);
      if (args.method == 'eth_chainId') {
        resolve(window.ethereum.chainId);
      } else if
      (args.method == 'eth_accounts' || args.method == 'eth_requestAccounts') {
        if (window.ethereum.selectedAddress != '') {
          resolve([window.ethereum.selectedAddress]);
        } else {
          let favIconUrl = '';
          let b = document.getElementsByTagName('link');
          for (let i = 0; i < b.length; i++) {
            if (b[i].rel.indexOf('icon') != -1) {
              favIconUrl = b[i].href;
            }
          }

          window.postMessage({
            'inpageLoad': {
              url: window.location.origin,
              favIconUrl: favIconUrl,
            },
          });
          let getaddr = function(e) {
            if (e.data.contentGetAddr) {
              window.ethereum.selectedAddress = e.data.contentGetAddr.toLocaleLowerCase();
              resolve([window.ethereum.selectedAddress]);
              window.removeEventListener('message', getaddr, false);
            }
          };
          window.addEventListener('message', getaddr);
        }
      } else if (args.method == 'eth_sendTransaction') {
        window.postMessage({ 'inpageSend': args });
        let send = function(e) {
          if (e.data.inpageHash) {
            resolve(e.data.inpageHash);
            window.removeEventListener('message', send, false);
          }
        };
        window.addEventListener('message', send);
      } else if (args.method == 'wallet_watchAsset') {
        window.postMessage({ 'inpageAddAsset': args });
        let wallet_watchAsset = function(e) {
          if (e.data.contentAddAsset) {
            resolve(e.data.contentAddAsset);
            window.removeEventListener('message', wallet_watchAsset, false);
          }
        };
        window.addEventListener('message', wallet_watchAsset);
      } else if (args.method == 'wallet_addEthereumChain') {
        window.postMessage({ 'inpageAddChain': args });
        let AddChain = function(e) {
          if (e.data.contentAddChain) {
            resolve(e.data.contentAddChain);
            window.removeEventListener('message', AddChain, false);
          }
        };
        window.addEventListener('message', AddChain);
      } else if (args.method == 'wallet_switchEthereumChain') {
        window.postMessage({ 'inpageSwitchChain': args });
        let SwitchChain = function(e) {
          if (e.data.contentSwitchChain) {
            resolve(e.data.contentSwitchChain);
            window.removeEventListener('message', SwitchChain, false);
          }
        };
        window.addEventListener('message', SwitchChain);
      } else if (args.method == 'eth_signTypedData_v4'
        || args.method == 'eth_signTypedData_v3'
        || args.method == 'eth_signTypedData'
        || args.method == 'personal_sign'
        || args.method == 'eth_getEncryptionPublicKey'
        || args.method == 'eth_decrypt'
        || args.method == 'personal_ecRecover') {
        window.postMessage({ 'inpageSign': args });
        let eth_sign = function(e) {
          console.log(e, 'ethsing');
          if (e.data.contentSign) {
            resolve(e.data.contentSign);
            window.removeEventListener('message', eth_sign, false);
          }
        };
        window.addEventListener('message', eth_sign);
      } else if (args.method == 'wallet_addEthereumChain') {
        resolve({ 'id': 1, 'jsonrpc': '2.0', 'result': null });
      } else {
        fetch(this.api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'jsonrpc': '2.0', 'method': args.method, 'params': args.params, 'id': 1 }),
        }).then(function(response) {
          console.log(response);
          return response.json();
        }).then(json => {
          resolve(json.result);
        });
      }
    });
  },
  send: function(args, callbak) {
    console.log(args, args.method);

    return new Promise(async (resolve, reject) => {
      if (args == 'eth_requestAccounts' || args == 'eth_accounts') {
        if (window.ethereum.selectedAddress != '') {
          resolve([window.ethereum.selectedAddress]);
        } else {
          let favIconUrl = '';
          let b = document.getElementsByTagName('link');
          for (let i = 0; i < b.length; i++) {
            if (b[i].rel.indexOf('icon') != -1) {
              favIconUrl = b[i].href;
            }
          }

          window.postMessage({
            'inpageLoad': {
              url: window.location.origin,
              favIconUrl: favIconUrl,
            },
          });
          let getaddr = function(e) {
            if (e.data.contentGetAddr) {
              window.ethereum.selectedAddress = e.data.contentGetAddr.toLocaleLowerCase();
              resolve({ id: 1, jsonrpc: '2.0', result: [window.ethereum.selectedAddress] });
              window.removeEventListener('message', getaddr, false);
            }
          };
          window.addEventListener('message', getaddr);
        }
      }
      if (args == 'eth_chainId') {
        resolve({ id: 1, jsonrpc: '2.0', result: window.ethereum.chainId });
      }
    });
  },
  sendAsync: function(args, callbak) {
    console.log(args, args.method);
    return new Promise(async (resolve, reject) => {
      if (args.method == 'eth_chainId') {
        resolve(callbak(undefined, { id: 1, jsonrpc: '2.0', result: window.ethereum.chainId }));
      } else if (args.method == 'eth_accounts') {
        resolve(callbak(undefined, { id: 1, jsonrpc: '2.0', result: [window.ethereum.selectedAddress] }));
      }
    });
  },
  load() {
    window.postMessage({ 'inpageLoad': 'inpageLoad' });
    let getaddr = function(e) {
      if (e.data.contentGetAddr) {
        window.ethereum.selectedAddress = e.data.contentGetAddr.toLocaleLowerCase();
        // location.reload()
      }
    };
    window.addEventListener('message', getaddr);
  },
  loadnetwork() {
    window.postMessage({ 'inpageNetwork': 'inpageNetwork' });
    let _this = this;
    let inpageNetwork = function(e) {
      if (e.data.contentNetwork) {
        _this.chainId = e.data.contentNetwork.chainId;
        window.ethereum.api = e.data.contentNetwork.rpcUrls[0];
        window.removeEventListener('message', inpageNetwork, false);
      }
    };
    window.addEventListener('message', inpageNetwork);
    let contentGetAddr = function(e) {
      console.log(e.data);
      console.log(_this.listfn);
      _this.listfn.forEach(item => {
        if (item.name == 'accountsChanged') {
          if (e.data.contentGetAddr) {
            window.ethereum.selectedAddress = e.data.contentGetAddr.toLocaleLowerCase();
            item.fn([e.data.contentGetAddr]);
          }
        }
        if (item.name == 'chainChanged') {
          if (e.data.contentSwitchChain) {
            console.log(e.data.contentSwitchChain);

            _this.chainId = e.data.contentSwitchChain.chainId;
            _this.api = e.data.contentSwitchChain.rpcUrls[0];
            item.fn(e.data.contentSwitchChain.chainId);
          }
        }
      });
    };
    window.addEventListener('message', contentGetAddr);
  },
  on(event, callback) {
    let t = -1;
    this.listfn.forEach((item, index) => {
      if (item.event == event) {
        t = index;
      }
    });
    if (t == -1) {
      this.listfn.push({
        name: event,
        fn: callback,
      });
    } else {
      this.listfn[t].fn = callback;
    }

  },
}
;

window.ethereum.loadnetwork();

