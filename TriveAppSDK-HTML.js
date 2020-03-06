const TriveAppSDK = (function (window) {

    // Force no margin and padding on html and body
    _injectCSS();

    function _injectCSS() {
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = "html, body { margin: 0 !important; padding: 0 !important; width: 100%; height: 100%; } ";
        css.innerHTML += "triveapp-root { width: 100%; height: 100%; overflow-y: scroll; -webkit-overflow-scrolling: touch; display: block; }"
        document.head.appendChild(css);
    }

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

    const msg = walletParams.lang === 'zh' ? zhMsg : enMsg;

    /**
     * Request to login
     * @param options.url The URL that handle login request
     */
    // function login(options) {
    //     if (!options.address || !options.amount.toString()) {
    //         reject({ response: 1, m: msg.invalidParameter });
    //         console.error({ response: 1, m: msg.invalidParameter });
    //         return window.alert(msg.invalidParameter);
    //     }

    // }

    /**
     * Pay to a wallet address
     * @param options.address    Address to send to
     * @param options.amount     Amount to send to
     * @param options.message    Message (OP_RETURN) to include
     * @param options.opReturn   Transaction identifier (Max 40 chars)****
     */
    function payToWallet(options) { //address, amount, message
        return new Promise(async (resolve, reject) => {
            try {
                let message = "";

                if (!options.address || !options.amount.toString()) {
                    reject({ response: 1, m: msg.invalidParameter });
                    console.error({ response: 1, m: msg.invalidParameter });
                    return window.alert(msg.invalidParameter);
                }

                if (options.amount != parseInt(options.amount) || options.amount != Number(options.amount)) {
                    reject({ response: 1, m: msg.amountMustBeInteger });
                    console.error({ response: 1, m: msg.amountMustBeInteger });
                    return window.alert(msg.amountMustBeInteger);
                }

                if (Number(options.amount) < 100000) {
                    reject({ response: 1, m: msg.tooLessAmount });
                    console.error({ response: 1, m: msg.tooLessAmount });
                    return window.alert(msg.tooLessAmount);
                }

                if (options.message) {
                    message = "&message=" + options.message;
                }

                const openURL = `https://trvc.app/wallet/send?trivechain:${options.address}&dapp=${walletParams.dapp}&amount=${options.amount}${message}`;
                let win = window.open(openURL);
                resolve({ c: 0, d: { url: openURL, win } });
            } catch (e) {
                console.error({ c: 1, m: msg.serverError, e: String(e) });
                return reject({ c: 1, m: msg.serverError, e: String(e) });
            }
        });
    };

    /**
     * Pay to a wallet address
     * @param options.type    any data that you want to put in to sign
     * @param options.url     this is the url of your dapp after user login with TRVC APP
     * @param options.appName (optional) this is a string of your dapp name that show on TRVC APP's authorize page
     */
    function loginRequest(options) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!options.type || !options.url) {
                    reject({ response: 1, m: msg.invalidParameter });
                    console.error({ response: 1, m: msg.invalidParameter });
                    return window.alert(msg.invalidParameter);
                }

                let openURL = `https://trvc.app/authorize?url=${options.url}&type=${options.type}`;

                if (options.appName) {
                    openURL = `https://trvc.app/authorize?url=${options.url}&type=${options.type}&appName=${options.appName}`;
                }

                resolve({ c: 0, d: openURL });

            } catch (e) {
                console.error({ c: 1, m: msg.serverError, e: String(e) });
                return reject({ c: 1, m: msg.serverError, e: String(e) });
            }
        });
    };

    /**
     * Block to open on insight
     * @param options.blockhash    Block hash to open on insight
     */
    function openInsightBlock(options) { //blockhash
        return new Promise(async (resolve, reject) => {
            try {
                if (!options.blockhash) {
                    reject({ response: 1, m: msg.invalidParameter });
                    console.error({ response: 1, m: msg.invalidParameter });
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

                    let windowReference = window.open();

                    getBlock().then(res => {
                        resolve({ c: 0, d: `${insightURL}block/${res.d}` });
                        windowReference.location = `${insightURL}block/${res.d}`;
                        return;
                    }).catch(res => {
                        reject(res);
                        console.error(res);
                        return window.alert(res.m);
                    });
                }
            } catch (e) {
                console.error({ c: 1, m: msg.serverError, e: String(e) });
                return reject({ c: 1, m: msg.serverError, e: String(e) });
            }
        });
    };

    /**
     * Address to open on insight
     * @param options.address    Address hash to open on insight
     */
    function openInsightAddress(options) { //address
        return new Promise(async (resolve, reject) => {
            try {
                if (!options.address) {
                    reject({ response: 1, m: msg.invalidParameter });
                    console.error({ response: 1, m: msg.invalidParameter });
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

                    let windowReference = window.open();

                    getInisght().then(res => {
                        resolve({ c: 0, d: `${insightURL}address/${res.d}` });
                        windowReference.location = `${insightURL}address/${res.d}`;
                        return;
                    }).catch(res => {
                        reject(res);
                        console.error(res);
                        return window.alert(res.m);
                    });
                }
            } catch (e) {
                console.error({ c: 1, m: msg.serverError, e: String(e) });
                return reject({ c: 1, m: msg.serverError, e: String(e) });
            }

        });
    };


    function openInsightTransaction(options) { //txid
        return new Promise(async (resolve, reject) => {
            try {
                if (!options.txid) {
                    reject({ response: 1, m: msg.invalidParameter });
                    console.error({ response: 1, m: msg.invalidParameter });
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

                    let windowReference = window.open();

                    getInisght().then(res => {
                        resolve({ c: 0, d: `${insightURL}tx/${res.d}` });
                        windowReference.location = `${insightURL}tx/${res.d}`;
                        return;
                    }).catch(res => {
                        reject(res);
                        console.error(res);
                        return window.alert(res.m);
                    });
                }
            } catch (e) {
                console.error({ c: 1, m: msg.serverError, e: String(e) });
                return reject({ c: 1, m: msg.serverError, e: String(e) });
            }
        });
    };

    return {
        // login,
        payToWallet: payToWallet,
        loginRequest: loginRequest,
        walletParams: walletParams,
        insightURL: insightURL,
        insightApiURL: insightApiURL,
        openInsightBlock: openInsightBlock,
        openInsightAddress: openInsightAddress,
        openInsightTransaction: openInsightTransaction,
    };
})(window);
