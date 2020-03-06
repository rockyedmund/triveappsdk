# Introduction

You can now build your games and applications and publish on our wallet [trvc.app](https://trvc.app). We provide the simplest method even without SDK for developers who are interested in building their applications.

First thing first, every application will get a URL query string as below: 

```html
?address=TD748Hb6RX3dWuziSLL7xQ6LzSxpP4HJFY&lang=en&dapp=yourdapp
```
Parameters:

| Name        | Description           | Example  |
| ----------- | --------------------- | -------- |
| address | User's TRVC address on [trvc.app](https://trvc.app) | TD748Hb6RX3dWuziSLL7xQ6LzSxpP4HJFY |
| lang | Language that uses by user on [trvc.app](https://trvc.app) | en or zh |
| dapp | The short name of your application | - |
You can use these parameters in your Dapp as any dapp that open from trvc app will have these parameters.

## Trivechain's Insight API
You can query user's information such as user's TRVC balance and transaction history from [insight](https://insight.trivechain.com/). The documentation of Trivechain's Insight API is written [here](https://github.com/trivechain/trivechain-insight-api#insight-api).
You can also utilize [Explorer](https://explorer.trivechain.com/) in your Dapp.

## Login with TRVC APP
```javascript
loginRequest()
```
This method allows user to login with [trvc.app](https://trvc.app) before user use your Dapp (or anytime). 
Parameters:
| Name        | Description           | Example  |
| ----------- | --------------------- | -------- |
| url | The full URL that you want to redirect from TRVC APP after the user has granted login access from TRVC APP | https://redpacket.trvc.app/receive/verify |
| type | This is for you to insert any data you want to sign with the URL. | - |
| appName | This is the name of your Dapp that show on TRVC APP's authorization page | TRVC Red Packet |

Flow:
1. Call the `loginRequest()` function and with the parameters stated above.
2. SDK will redirect user to TRVC APP's [authorization page](https://trvc.app/authorize).
3. User press "Continue" Button to login. (If the user is have not login in TRVC APP, it will redirect user to Sign In page.)
4. TRVC APP will sign the message (`URL` and `type`). The message is in JSON format:
```javascript
{url: "https://redpacket.trvc.app/receive/verify", type: "testdata"}
```
5. TRVC APP will redirect user back to the `URL` given, with queries. For example: 
```html
https://redpacket.trvc.app/receive/verify?lang=en&useraddress=TRVC3h1tf2252uKLdvYB2B3LshippzmzPM&signature=THESIGNATURETHATSIGNFROMURLANDTYPE&type=THEDATATHATYOUINSERT
```
Returning Parameters:
| Name        | Description           | Example  |
| ----------- | --------------------- | -------- |
| lang | Language that uses by user on [trvc.app](https://trvc.app) | en or zh |
| useraddress | User's TRVC address. | - |
| signature | The signature that sign with `URL` and `type` | - |
| type | This is for you to insert any data you want to sign with the URL. | - |

6. Now, user are on your Dapp again. You will need to verify the signature with user's TRVC address and the message. As mentioned before, the message is in JSON format. You need to stringify it with `JSON.stringify(message)`. For example:
```javascript
JSON.stringify({url: "https://redpacket.trvc.app/receive/verify", type: "testdata"})
```
You can verify the message with: 
- Trivechain's Insight API : https://insight.trivechain.com/trivechain-insight-api/messages/verify (POST). The payload are `address`, `signature`, and `message`.
- Trivechaincore-lib: https://github.com/trivechain/trivechaincore-lib/blob/master/docs/examples.md#verify-a-trivechain-message
Both method will return a BOOLEAN for you to verify whether the user has the right access. 
7. The the verification return `True`, means that the user has the right authorization. 

## Payment / TRVC Transfer
```javascript
payToWallet()
```
The method we provide here is by using the URL query string. All users are required to login to view and open the application from our TriveAppstore. You just have to open a new browser tab and direct user to TRVC sending page in our [trvc.app](https://trvc.app). 

The flow is as below:
1. User clicks on payment/transfer TRVC in your application UI.
2. Open a new browser tab with a URL query string consists of:
```html
https://trvc.app/send?trivechain:TD748Hb6RX3dWuziSLL7xQ6LzSxpP4HJFY&dapp=yourdapp&amount=100000000
```
Parameters:

| Name        | Description           | Example  |
| ----------- | --------------------- | -------- |
| trivechain | Receiving address [trvc.app](https://trvc.app) | TD748Hb6RX3dWuziSLL7xQ6LzSxpP4HJFY |
| dapp | The short name of your application | - |
| amount | Amount of satoshi to be transferred | 100000000 |

3. User will have to key-in their security pin to confirm the payment/transfer.
4. The payment/transfer tab will be closed and back to your application tab when the transaction is successfully sent.

Remarks:
* The receiving address's key in the URL query string is ```trivechain:``` instead of ~~trivechain=~~.
* The amount to be transferred must be in satoshi value.
  * For example 1 TRVC = 100000000 satoshi

You may query and check the payment/transaction from your application's backend by using our [Trivechain's Insight API](https://github.com/trivechain/trivechain-insight-api#insight-api) or [Trivechain-core](https://github.com/trivechain/trivechain-core).

Last but not least, TRVC APP has a Dapp called [TRVC Red Packet](https://trvc.app/apps/2226212508471919999), that uses all the SDK's features. You may check out the app and play around it to understand the feature of the SDK.  

