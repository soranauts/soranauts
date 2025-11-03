---
title: >-
  Testing SORA’s HASHI bridge Substrate XCM transfers between Rococo and SORA
  testnet
source: update
source_url: >-
  https://medium.com/sora-xor/testing-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1
doc_id: 541aec0c5d1e625a
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T15:40:00.976Z'
lang: en
license: SORA Official / Medium
checksum_sha256: c4a9135a1e7ab5b2ecc547bcc76211ada163bef3fce831defe4b9d0d5f364365
content_hash: c4a9135a1e7ab5b2ecc547bcc76211ada163bef3fce831defe4b9d0d5f364365
image_rights: SORA Official / Medium
publishDate: '2025-11-02T15:40:00.854Z'
---
Testing SORA’s HASHI bridge Substrate XCM transfers between Rococo and SORA testnet | by SORA | SORA | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F3a8f8ba764c1&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftesting-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftesting-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SORA

--------

](https://medium.com/sora-xor?source=post_page---publication_nav-4476c249dd22-3a8f8ba764c1---------------------------------------)

·

[

![SORA](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/sora-xor?source=post_page---post_publication_sidebar-4476c249dd22-3a8f8ba764c1---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

Testing SORA’s HASHI bridge Substrate XCM transfers between Rococo and SORA testnet
===================================================================================

Help us test the latest upgrade to the HASHI Substrate bridge!
--------------------------------------------------------------

[

![SORA](./images/be3254c2c7d7cd92d0a16e9801a0d41459927feb410386d18ed86145d944ba9f.png)

](/@sora-xor?source=post_page---byline--3a8f8ba764c1---------------------------------------)

[SORA](/@sora-xor?source=post_page---byline--3a8f8ba764c1---------------------------------------)

3 min read

·

Jun 23, 2023

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2F3a8f8ba764c1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftesting-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1&user=SORA&userId=1a19bb1bbd4a&source=---header_actions--3a8f8ba764c1---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F3a8f8ba764c1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftesting-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1&source=---header_actions--3a8f8ba764c1---------------------bookmark_footer------------------)

Listen

Share

Press enter or click to view image in full size

Ahead of the full release of the HASHI bridge Substrate XCM upgrade, it is already possible to test sending assets to and from [Rococo](https://polkadot.network/blog/introducing-rococo-polkadots-parachain-testnet) (Polkadot’s Parachain Testnet) and the [SORA](http://sora.org) testnet (a standalone Substrate test network), utilizing the SORA Rococo parachain and [Substrate XCM](https://docs.substrate.io/learn/xcm-communication/).

### Here is a quick tutorial on how you can help test this feature:

You will need a Substrate account on [Dotapps.io](https://cloudflare-ipfs.com/ipns/rococo.dotapps.io/#/accounts) that allows use on any chain. You can get Rococo testnet tokens from the [faucet provided by Parity](https://paritytech.github.io/polkadot-testnet-faucet/). To claim these tokens, input your Substrate address and then verify you’re a human and click the “Get some $ROC” button. _Make sure you’ve updated your extension in Settings._

Press enter or click to view image in full size

[Rococo faucet provided by Parity](https://paritytech.github.io/polkadot-testnet-faucet/)

With $ROC tokens on your account, navigate to dotapps.io and switch the network to the [Rococo relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/explorer).

Next, navigate to Developer > Extrinsics. Here you will need to select the account that has $ROC tokens from the faucet.

* The extrinsic to submit is `xcmPallet` then `reserveTransferAssets(dest,beneficiary,assets,feeAssetitem)`
* The `dest:` is `V3`
* The `interior:XCMV3Junctions` is `X1`
* The `Parachain` is `2011`
* Then in the next section, the `Beneficiary:XCMVersionedMultiLocation` is `V3`
* Under `V3:XCMMultilocation` the `interior:XCMV3Junctions` is `X1`
* The `X1:XCMV3Junction` is `Accountid32` and in the `id:[u8:32]` section, input your SORA test network account address (to transfer tokens to)

So far, you now have the sender and the receiver for the transfer, now let’s input the asset.

* In assets: `XcmVersionedMultiAssets` select `V3`, then click Add Item
* In the field `Fungible:Compact<128>` add the number of tokens to be transferred. You have to add twelve zeroes after the amount. In this case, we are sending 50, so the input is `5000000000000`

With all the fields filled in, this is how it should look like:

Press enter or click to view image in full size

* Finally, **submit the transaction and sign** on the pop-up using your password

After the transaction is successful (when the ✅ appears on the upper-right corner), you will notice the $ROC balance is reduced. Let’s double-check in Polkaswap (testnet):

* Open [test.polkaswap.io](https://test.polkaswap.io/) and navigate to the Bridge section. Choose the Rococo network and connect the account that you just used to test
* Select the ROC token from the list. If the transfer was successful, it will look like this:

Press enter or click to view image in full size

[test.polkaswap.io](https://test.polkaswap.io/)

If you have any questions while testing, please contact an admin or ambassador.

We are working to get the UI for the HASHI Substrate bridge, utilizing XCM, on Polkaswap, ready for testing as well. Please stay fearless for an update soon!

**Update:** The Rococo testnet token has been whitelisted on [test.polkaswap.io](https://test.polkaswap.io/), so you can simply add the asset to your account there to verify the transaction was successful.

### About SORA

[**SORA**](/@sora.xor/sora-the-new-economic-order-3ec3f0327e5a) is a movement that advances humanity by empowering people with decentralized technology, DeFi, and with a new economic system geared towards enabling human progress. The [SORA](https://sora.org/) network implements a new way of parachain architecture on [Polkadot](https://polkadot.network/) and [Kusama](https://kusama.network/) network, with the capability to [bridge](https://wiki.polkadot.network/docs/en/learn-bridges) external blockchains (like Ethereum) to the Polkadot ecosystem.

### Connect With Us:

### [SORA](https://sora.org/) 𒀭 community:

[Twitter](https://twitter.com/sora_xor) | [Telegram](https://t.me/sora_xor) | [Reddit](https://www.reddit.com/r/SORA/) | [YouTube](https://www.youtube.com/channel/UCb2i3VaGrggBhfo2ytg8xCA) | [Announcements Channel](https://t.me/sora_announcements)

### [Polkaswap](https://polkaswap.io/) 𒊹𒂵𒆜 community:

[Twitter](https://twitter.com/polkaswap) | [Telegram](https://t.me/polkaswap) | [Reddit](https://www.reddit.com/r/Polkaswap/) | [YouTube](https://www.youtube.com/channel/UC6piTNmXCIfql72tNu183FA) | [Announcements Channel](https://t.me/polkaswap_announcements)

### [Fearless Wallet](https://fearlesswallet.io/) 𒉡𒉎𒋼 community:

[Twitter](https://twitter.com/FearlessWallet) | [Telegram](https://t.me/fearlesswallet) | [Element](https://matrix.to/#/#fearlesswallet:matrix.org) | [YouTube](https://www.youtube.com/channel/UCE9Jjr6kFQgt8IJmv0rCIFQ) | [Android App](https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless) | [iOS App](https://apps.apple.com/us/app/fearless-wallet/id1537251089)

[

Substrate

](/tag/substrate?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Xcm

](/tag/xcm?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Kusama

](/tag/kusama?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----3a8f8ba764c1---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2F3a8f8ba764c1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftesting-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--3a8f8ba764c1---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2F3a8f8ba764c1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftesting-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--3a8f8ba764c1---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F3a8f8ba764c1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftesting-xcm-transfers-to-sora-through-dotapps-io-3a8f8ba764c1&source=---footer_actions--3a8f8ba764c1---------------------bookmark_footer------------------)

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--3a8f8ba764c1---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--3a8f8ba764c1---------------------------------------)

[

Published in SORA
-----------------

](https://medium.com/sora-xor?source=post_page---post_publication_info--3a8f8ba764c1---------------------------------------)

[1.4K followers](/sora-xor/followers?source=post_page---post_publication_info--3a8f8ba764c1---------------------------------------)

·[Last published Jul 11, 2025](/sora-xor/sora-ecosystem-updates-88-june-33-2025-01ffc03a468b?source=post_page---post_publication_info--3a8f8ba764c1---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](/@sora-xor?source=post_page---post_author_info--3a8f8ba764c1---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](/@sora-xor?source=post_page---post_author_info--3a8f8ba764c1---------------------------------------)

[

Written by SORA
---------------

](/@sora-xor?source=post_page---post_author_info--3a8f8ba764c1---------------------------------------)

[2.3K followers](/@sora-xor/followers?source=post_page---post_author_info--3a8f8ba764c1---------------------------------------)

·[26 following](/@sora-xor/following?source=post_page---post_author_info--3a8f8ba764c1---------------------------------------)

SORA is working to become a decentralized world economic system, under the democratic supervision of the SORA Parliament. Many Worlds. One Economy. SORA.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--3a8f8ba764c1---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----3a8f8ba764c1---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----3a8f8ba764c1---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----3a8f8ba764c1---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----3a8f8ba764c1---------------------------------------)
