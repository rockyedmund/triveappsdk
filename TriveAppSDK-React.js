const TriveAppSDK = (function () {
    let pageLoaded = false;

    const queryRaw = window.location.search.substring(1).split('&');
    let walletParams = {};
    for (let i of queryRaw) {
        let temp = i.split('=')
        walletParams = { ...walletParams, [temp[0]]: temp[1] };
    }

    const insightURL = 'https://insight.trivechain.com/';
    const insightApiURL = 'https://insight.trivechain.com/api/';

    const enMsg = {
        serverError: 'Server Error',
        invalidParameter: 'Invalid Parameter',
        tooLessAmount: 'Transfer amount cannot be less than 0.001 TRVC or 100000 satoshi',
        amountMustBeInteger: 'Transfer amount must be integer/whole number',
        invalidAddress: 'Invalid address',
        invalidBlockHash: 'Invalid block hash',
        invalidTxid: 'Invalid transaction id',
    }

    const zhMsg = {
        serverError: '服务器报错',
        invalidParameter: '无效的参数',
        tooLessAmount: '转账金额不能少于 0.001 TRVC 或 100000 satoshi',
        amountMustBeInteger: '转账总额必须是整数',
        invalidAddress: '无效地址',
        invalidBlockHash: '无效区块哈希值',
        invalidTxid: '无效记交易 id',
    }

    const msg = walletParams.lang === 'en' ? enMsg : zhMsg;

    // Some action from parent will be ignored until page loaded (For instance, on back pressed)
    _setOnReady(function () {
        pageLoaded = true;
    });

    // Force no margin and padding on html and body
    _injectCSS();

    function _injectCSS() {
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = "html, body { margin: 0 !important; padding: 0 !important; width: 100%; height: 100%; } ";
        css.innerHTML += "triveapp-root { width: 100%; height: 100%; overflow-y: scroll; -webkit-overflow-scrolling: touch; display: block; }"
        document.head.appendChild(css);
    }

    function _setOnReady(onReady) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            onReady();
        } else {
            document.addEventListener("DOMContentLoaded", onReady);
        }
    }

    /**
     * Request to login
     * @param opts.url The URL that handle login request
     */
    // function login(opts, cb) {
    //     // Input check
    //     if (!cb) cb = Utils.noop;
    //     if (!Utils.isObject(opts)) {
    //         return cb("Invalid opts");
    //     }

    //     // Prepare request
    //     var timestamp = Date.now();
    //     var request = {
    //         type: "LOGIN",
    //         data: {
    //             url: opts.url
    //         },
    //         timestamp: timestamp,
    //         callback: cb
    //     };
    //     allRequests[timestamp] = request;

    //     // Pass to parent
    //     parent.postMessage(JSON.stringify(request), "*");
    // }

    /**
     * Pay to a wallet address
     * @param opts.address    Address to pay to
     * @param opts.amount     Amount to pay to
     * @param opts.message    Message to include
     * @param opts.identifier Transaction identifier (Max 8 chars)
     */
    function payToWallet(options) { //address, amount, message
        return new Promise(async (resolve, reject) => {
            try {
                if (!options.address || !options.amount.toString()) {
                    reject({ response: 1, d: "", m: msg.invalidParameter });
                    return window.alert(msg.invalidParameter);
                }

                if (options.amount != parseInt(options.amount) || options.amount != Number(options.amount)) {
                    reject({ response: 1, m: msg.amountMustBeInteger });
                    return window.alert(msg.amountMustBeInteger);
                }

                if (Number(options.amount) < 100000) {
                    reject({ response: 1, m: msg.tooLessAmount });
                    return window.alert(msg.tooLessAmount);
                }

                const openURL = `https://trvc.app/send?trivechain:${options.address}&dapp=${walletParams.dapp}&amount=${options.amount}`;

                return resolve(window.open(openURL));
            } catch (e) {
                return reject({ c: 1, m: msg.serverError, e: String(e) });
            }
        });
    };

    function openInsightBlock(options) { //blockhash
        return new Promise(async (resolve, reject) => {

            if (!options.blockhash) {
                reject({ response: 1, m: msg.invalidParameter });
                return window.alert(msg.invalidParameter);
            } else {
                function getBlock() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const res = await fetch(insightURL + 'api/block/' + options.blockhash);
                            const resJson = await res.json();
                            if (resJson && resJson.hash) {
                                return resolve({ c: 0, d: resJson.hash, m: '' });
                            }
                            return reject({ c: 1, m: msg.serverError });
                        }
                        catch (e) {
                            return reject({ c: 1, m: msg.invalidBlockHash, e: String(e) });
                        }
                    })
                }

                getBlock().then(res => {
                    resolve({ c: 0, d: `${insightURL}block/${res.d}` })
                    return window.open(`${insightURL}block/${res.d}`);
                }).catch(res => {
                    reject(res);
                    return window.alert(res.m);
                });
            }
        });
    };

    function openInsightAddress(options) { //address
        return new Promise(async (resolve, reject) => {

            if (!options.address) {
                reject({ response: 1, m: msg.invalidParameter });
                return window.alert(msg.invalidParameter);
            } else {
                function getInisght() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const res = await fetch(insightURL + 'api/addr/' + options.address);
                            const resJson = await res.json();
                            if (resJson && resJson.addrStr) {
                                return resolve({ c: 0, d: resJson.addrStr, m: '' });
                            }
                            return reject({ c: 1, m: msg.serverError });
                        }
                        catch (e) {
                            return reject({ c: 1, m: msg.invalidAddress, e: String(e) });
                        }
                    })
                }

                getInisght().then(res => {
                    resolve({ c: 0, d: `${insightURL}address/${res.d}` })
                    return window.open(`${insightURL}address/${res.d}`);
                }).catch(res => {
                    reject(res);
                    return window.alert(res.m);
                });
            }
        });
    };

    function openInsightTransaction(options) { //txid
        return new Promise(async (resolve, reject) => {

            if (!options.txid) {
                reject({ response: 1, m: msg.invalidParameter });
                return window.alert(msg.invalidParameter);
            } else {
                function getInisght() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const res = await fetch(insightURL + 'api/tx/' + options.txid);
                            const resJson = await res.json();
                            if (resJson && resJson.txid) {
                                return resolve({ c: 0, d: resJson.txid, m: '' });
                            }
                            return reject({ c: 1, m: msg.serverError });
                        }
                        catch (e) {
                            return reject({ c: 1, m: msg.invalidTxid, e: String(e) });
                        }
                    })
                }

                getInisght().then(res => {
                    resolve({ c: 0, d: `${insightURL}tx/${res.d}` })
                    return window.open(`${insightURL}tx/${res.d}`);
                }).catch(res => {
                    reject(res);
                    return window.alert(res.m);
                });
            }
        });
    };
    return {
        // login,
        payToWallet: payToWallet,
        walletParams: walletParams,
        insightURL: insightURL,
        insightApiURL: insightApiURL,
        openInsightBlock: openInsightBlock,
        openInsightAddress: openInsightAddress,
        openInsightTransaction: openInsightTransaction,
    };
})(window);

export default TriveAppSDK;
