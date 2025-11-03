---
title: Security in Fearless Wallet
source: fearless_update
source_url: 'https://medium.com/fearlesswallet/security-in-fearless-wallet-773151bf64cb'
doc_id: a72fc8b2cab4e4a8
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:15:12.958Z'
lang: en
license: Fearless Wallet Official / Medium
checksum_sha256: 14b774ca75978eb63d308e810f0efc25c972f4d08f8bd1f14e668071a5b727fa
content_hash: 14b774ca75978eb63d308e810f0efc25c972f4d08f8bd1f14e668071a5b727fa
image_rights: Fearless Wallet Official / Medium
publishDate: '2025-11-02T16:15:12.786Z'
---
Security in Fearless Wallet. Fearless Wallet keeps your data safe by… | by Fearless Wallet | Fearless Wallet | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F773151bf64cb&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Ffearlesswallet%2Fsecurity-in-fearless-wallet-773151bf64cb&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Ffearlesswallet%2Fsecurity-in-fearless-wallet-773151bf64cb&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

Fearless Wallet

-------------------

](https://medium.com/fearlesswallet?source=post_page---publication_nav-662fd2992f66-773151bf64cb---------------------------------------)

·

[

![Fearless Wallet](./images/38e9f7a505359200be09ebfe5e16cdfd51cf50288d51c5f379e22f48201f7cc8.png)

](https://medium.com/fearlesswallet?source=post_page---post_publication_sidebar-662fd2992f66-773151bf64cb---------------------------------------)

Fearless Wallet is designed especially for the DeFi future on Polkadot and Kusama. iOS and Android native apps, the best UX, fast performance, secure accounts.

Security in Fearless Wallet
===========================

Fearless Wallet keeps your data safe by implementing best practices that ensure that user account information is SAFU
---------------------------------------------------------------------------------------------------------------------

[

![Fearless Wallet](./images/6f69985fed452933d93f38d1c1248611eba67067b292fb37398c3ce97bc79a40.png)

](/@fearlesswallet?source=post_page---byline--773151bf64cb---------------------------------------)

[Fearless Wallet](/@fearlesswallet?source=post_page---byline--773151bf64cb---------------------------------------)

5 min read

·

Oct 28, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Ffearlesswallet%2F773151bf64cb&operation=register&redirect=https%3A%2F%2Fmedium.com%2Ffearlesswallet%2Fsecurity-in-fearless-wallet-773151bf64cb&user=Fearless+Wallet&userId=444358cd5404&source=---header_actions--773151bf64cb---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F773151bf64cb&operation=register&redirect=https%3A%2F%2Fmedium.com%2Ffearlesswallet%2Fsecurity-in-fearless-wallet-773151bf64cb&source=---header_actions--773151bf64cb---------------------bookmark_footer------------------)

Listen

Share

TL;DR
-----

* Fearless Wallet is inherently secure and takes advantage of mobile security mechanisms provided by iOS and Android
* Fearless Wallet is non-custodial, and does not store your funds on your device, everything is on-chain
* No other application on your mobile has access to Fearless Wallet during the creation of an account. If your device was compromised, your mnemonic will not be liable to be lost.

Press enter or click to view image in full size

With [Polkadot crowdloans](https://parachains.info/auctions/polkadot) about to begin and [Kusama crowdloans ongoing](https://parachains.info/auctions/kusama), the topic of security in Fearless Wallet has come to the surface, as users are thinking ahead about the sweet rewards from [participating in parachain auction campaigns](/fearlesswallet/polkadot-parachain-auction-and-crowdloans-explained-1cd18675b401).

To some users, it may seem as though the use of a pin code or biometrics while creating/accessing an account on Fearless Wallet is not as secure as creating an account on the Polkadot.js interface, however, this is not at all the case.

This article will illustrate the differences (_and similarities_) between [Fearless Wallet](https://fearlesswallet.io/) and [Polkadot.js](https://polkadot.js.org/) regarding account security and protection, as well as the added security protocols to the Fearless Wallet mobile apps.

Polkadot.js, Security over Convenience
--------------------------------------

If you have set up an account using the Polkadot.js interface or extension, you will know that there are some steps required to securely generate an account, however, as this is done on a desktop computer, there may be security breaches when using this platform. They can be as simple as someone looking over your shoulder while you are setting up an account (_Never do this in a public place!_) or as complicated as malicious software that copies the content of your clipboard when Polkadot.js prompts you to copy your mnemonic, or a malicious extension that could siphon a user’s keys.

> Browser extensions have a broad range of permissions to read a user’s input, content, and browser’s cookies. Always make sure to download extensions from verified sources, as there could be clones in a browser’s store that could be contain malicious code.

Another product of creating an account (_and recovery option_) is the JSON file. This metadata file is the only alternative to recovering your account if you lose your mnemonic. Polkadot.js provides the JSON file when you set up an account, so if you have misplaced your mnemonic, but you remember your password, this is the best way to recover your account. If you have saved your JSON in a safe location (_so_ **_NOT_** _your downloads folder_), this should be, in theory, the safest way to keep your account from any attacks.

You can also generate a Multisig account(_more than one account required to sign a transaction before enacting it on a blockchain_), but you will need to use Polkadot.js apps every time you want to sign, verify or transact on the blockchain (_you also can’t import a multisig account to a wallet, such as Fearless Wallet_)

Alternatively, the password you have chosen should follow security best practices to prevent it from being cracked or stolen. Naturally, passwords such as birthdays, pet’s names, or the dreaded “_password_” will simply not do if fund security is a priority for you.

Always make sure to keep your passwords in a safe place and do not share them with anyone. If you happen to lose your password for one reason or another, make sure that your JSON and mnemonic are saved somewhere safe, if they’re misplaced too, _your funds are as good as gone_.

> A password will not protect you if your seed phrase has been compromised. If a malicious third party is in possession of the seed, they will be able to control the account, without having to know the password.

Fearless Wallet, Uncompromising Security, and Ease of Use
---------------------------------------------------------

Fearless Wallet is open-sourced, non-custodial, and decentralized. This statement on its own is a great assurance that the app is secure and that user funds and account information are kept safe. You own your keys at all times.

Along with the device safety that is available in [Android](https://www.android.com/safety/) and [iOS](https://support.apple.com/guide/security/welcome/web), Fearless Wallet keeps your data safe by implementing best practices that ensure that user account information is also protected from other apps on your phone and your operating system.

Additional Fearless Wallet security measures are:

1. Every key is encrypted and stored on-device in an application local folder.
2. Exporting keys can only be done through the “**Export account**” feature in the FW user interface, which is password protected.

If your device were to be lost, misplaced, or stolen, the pin acts as a safety net for you to immediately recover your account and open it on a different device to change your credentials and avoid a possible compromise. As your funds are stored on the blockchain, you don’t need to worry about their integrity if your mobile phone is compromised, this is why being non-custodial is so important in Fearless Wallet.

In Conclusion
-------------

Mobile wallets offer a fast and convenient way to access your coins. In comparison with a browser extension, its security is similar to any hot wallet, since the device is connected to the Internet.

Despite all the security measures implemented, _nothing is 100% secure_. The following advice can and should help you and your funds to stay SAFU:

1. Enable a screen lock for your phone with a password that cannot be easily guessed.
2. Store your mnemonics in physical offline storage and don’t share them with anyone.
3. Don’t use a rooted device for your funds.
4. Keep your phone’s OS up to date and use antivirus software.

Finally, #StayFearless

About Fearless Wallet
---------------------

Press enter or click to view image in full size

[Fearless Wallet](https://fearlesswallet.io/) is a mobile wallet designed for the decentralized future on the Kusama and Polkadot ecosystem, with support for iOS and Android platforms. An awesome user experience, fast performance, and secure storage for your accounts. Fearless Wallet will integrate Polkaswap for easy, decentralized swaps of assets.

Connect with Us:
----------------

[Fearless Wallet](https://fearlesswallet.io/) community:
--------------------------------------------------------

[**Twitter**](https://twitter.com/FearlessWallet) **|** [**Telegram**](https://t.me/fearlesswallet) **|** [**Android App**](https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless) **|** [**iOS App**](https://apps.apple.com/us/app/fearless-wallet/id1537251089)

Press enter or click to view image in full size

[

Blockchain

](/tag/blockchain?source=post_page-----773151bf64cb---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----773151bf64cb---------------------------------------)

[

Kusama

](/tag/kusama?source=post_page-----773151bf64cb---------------------------------------)

[

Fearless Wallet

](/tag/fearless-wallet?source=post_page-----773151bf64cb---------------------------------------)

[

Cryptocurrency

](/tag/cryptocurrency?source=post_page-----773151bf64cb---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Ffearlesswallet%2F773151bf64cb&operation=register&redirect=https%3A%2F%2Fmedium.com%2Ffearlesswallet%2Fsecurity-in-fearless-wallet-773151bf64cb&user=Fearless+Wallet&userId=444358cd5404&source=---footer_actions--773151bf64cb---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Ffearlesswallet%2F773151bf64cb&operation=register&redirect=https%3A%2F%2Fmedium.com%2Ffearlesswallet%2Fsecurity-in-fearless-wallet-773151bf64cb&user=Fearless+Wallet&userId=444358cd5404&source=---footer_actions--773151bf64cb---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F773151bf64cb&operation=register&redirect=https%3A%2F%2Fmedium.com%2Ffearlesswallet%2Fsecurity-in-fearless-wallet-773151bf64cb&source=---footer_actions--773151bf64cb---------------------bookmark_footer------------------)

[

![Fearless Wallet](./images/1d249531e130620587d92e337ff7f98a5684d671641715c9f69bd4dbde1d1512.png)

](https://medium.com/fearlesswallet?source=post_page---post_publication_info--773151bf64cb---------------------------------------)

[

![Fearless Wallet](./images/d2f27a2ed032d2ccd29ecd0c26419133f689b8b24d6a13d257112457543ea6e3.png)

](https://medium.com/fearlesswallet?source=post_page---post_publication_info--773151bf64cb---------------------------------------)

[

Published in Fearless Wallet
----------------------------

](https://medium.com/fearlesswallet?source=post_page---post_publication_info--773151bf64cb---------------------------------------)

[181 followers](/fearlesswallet/followers?source=post_page---post_publication_info--773151bf64cb---------------------------------------)

·[Last published Mar 11, 2025](/fearlesswallet/fearless-wallet-ecosystem-updates-84-march-7-2025-44e1b2380a37?source=post_page---post_publication_info--773151bf64cb---------------------------------------)

Fearless Wallet is designed especially for the DeFi future on Polkadot and Kusama. iOS and Android native apps, the best UX, fast performance, secure accounts.

[

![Fearless Wallet](./images/1d249531e130620587d92e337ff7f98a5684d671641715c9f69bd4dbde1d1512.png)

](/@fearlesswallet?source=post_page---post_author_info--773151bf64cb---------------------------------------)

[

![Fearless Wallet](./images/d2f27a2ed032d2ccd29ecd0c26419133f689b8b24d6a13d257112457543ea6e3.png)

](/@fearlesswallet?source=post_page---post_author_info--773151bf64cb---------------------------------------)

[

Written by Fearless Wallet
--------------------------

](/@fearlesswallet?source=post_page---post_author_info--773151bf64cb---------------------------------------)

[188 followers](/@fearlesswallet/followers?source=post_page---post_author_info--773151bf64cb---------------------------------------)

·[31 following](/@fearlesswallet/following?source=post_page---post_author_info--773151bf64cb---------------------------------------)

Fearless Wallet is designed especially for the DeFi future on Polkadot and Kusama. iOS and Android native apps, the best UX, fast performance, secure accounts.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--773151bf64cb---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----773151bf64cb---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----773151bf64cb---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----773151bf64cb---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----773151bf64cb---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----773151bf64cb---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----773151bf64cb---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----773151bf64cb---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----773151bf64cb---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----773151bf64cb---------------------------------------)
