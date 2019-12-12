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

## Trivechain's Insight API


You can query user's information such as user's TRVC balance and transaction history from [insight](https://insight.trivechain.com/). The documentation of Trivechain's Insight API is written [here](https://github.com/trivechain/trivechain-insight-api#insight-api).

## Payment / TRVC Transfer
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



