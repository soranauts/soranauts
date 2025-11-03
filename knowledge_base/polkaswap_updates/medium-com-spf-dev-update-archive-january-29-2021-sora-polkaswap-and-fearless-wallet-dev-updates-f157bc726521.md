---
title: 'January 29, 2021 — SORA, Polkaswap, and Fearless Wallet Dev Updates'
source: polkaswap_update
source_url: >-
  https://medium.com/spf-dev-update-archive/january-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521
doc_id: 7f490e8dff807550
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:06:20.540Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: e60b01f11ce57f41a49c071e9786db7ebaefd7480952863ef748a9d422667798
content_hash: e60b01f11ce57f41a49c071e9786db7ebaefd7480952863ef748a9d422667798
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:06:20.201Z'
---
January 29, 2021 — SORA, Polkaswap, and Fearless Wallet Dev Updates | by Polkaswap | SPF Dev Update Archive | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2Ff157bc726521&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fjanuary-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fjanuary-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SPF Dev Update Archive

--------------------------

](https://medium.com/spf-dev-update-archive?source=post_page---publication_nav-5c1f6a55a5b4-f157bc726521---------------------------------------)

·

[

![SPF Dev Update Archive](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_sidebar-5c1f6a55a5b4-f157bc726521---------------------------------------)

The SORA, Polkaswap, and Fearless Wallet projects are all closely related as they form integral parts of the SORA ecosystem. This archive contains development status updates released for these three projects, in one convenient place

January 29, 2021 — SORA, Polkaswap, and Fearless Wallet Dev Updates
===================================================================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/@polkaswap?source=post_page---byline--f157bc726521---------------------------------------)

[Polkaswap](/@polkaswap?source=post_page---byline--f157bc726521---------------------------------------)

4 min read

·

Jan 29, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fspf-dev-update-archive%2Ff157bc726521&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fjanuary-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521&user=Polkaswap&userId=246f0843d222&source=---header_actions--f157bc726521---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Ff157bc726521&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fjanuary-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521&source=---header_actions--f157bc726521---------------------bookmark_footer------------------)

Listen

Share

The [SORA](https://sora.org), [Polkaswap](https://polkaswap.io), and [Fearless Wallet](https://fearlesswallet.io) projects are all closely related as they form integral parts of the SORA ecosystem. That is why development status updates are released every two weeks for these three projects, in one convenient place. Enjoy the January 29, 2021 Dev update! If you missed the previous ones:

[January 15th DEV update](/polkaswap/january-15-2021-sora-polkaswap-fearless-dev-update-d02c9d7348e) / [December 25th DEV update](/polkaswap/december-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3) / [December 11th DEV update](/polkaswap/december-11-2020-sora-polkaswap-fearless-dev-updates-5340e33e4ae) / [November 27th DEV update](/polkaswap/november-27-2020-spf-dev-updates-5f7965f74a9e) / [November 13th DEV update](/polkaswap/november-13-2020-sora-polkaswap-fearless-wallet-dev-update-d159d70c9ea8) / [October 30th DEV update](https://sora-xor.medium.com/october-30-2020-dev-updates-for-sora-polkaswap-and-fearless-wallet-9ff465a6d751) / [October 16th DEV update](https://sora-xor.medium.com/october-16-2020-dev-updates-for-sora-polkaswap-and-fearless-wallet-71e4884e29d7)

SORA Dev Update #8
------------------

⛓️🕯️ SORA v2 network was listed on the Rococo parachain proposal [list](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-rpc.polkadot.io#/parachains/proposals) under #**1337**

📺🔭 The SORA v2 testnet was added to [Polkadot telemetry](https://telemetry.polkadot.io/#list/SORA-staging%20Testnet)

Press enter or click to view image in full size

📱🚀🍏 SORAlution (TESTNET) 1.7 mobile app with new design is going to be released next week

Press enter or click to view image in full size

Polkaswap Dev Update #10
------------------------

[Testnet](https://test.polkaswap.io/) update has been updated:

🔄 Swap:

* Users are able to make reverse swaps on the XYK pools
* Calculation of token prices on the swap screen is improved
* Precision issues are fixed
* New token is displayed in wallet after the swap automatically
* Only swaps to and from XOR work currently

🚰 Faucet:

* Faucet fixes for better transaction processing
* [https://testfaucet.polkaswap.io/](https://testfaucet.polkaswap.io/)

💼 Wallet:

* All liquidity pool tokens moved to the Pool menu
* Slippage tolerance configuration was added to the Settings and Swap menus

❗️General improvements:

* Improvements in user notification about transaction submission and completion; there is still a long delay between swap and user notification, however
* Navigation menu fixes

🔄 Working on further improvements for swapping

🥞 Working on creating liquidity UI

🔐 Security audit of our code has started!

Press enter or click to view image in full size

Fearless Wallet Dev Update #14
------------------------------

🎁 The proposal for **Stage 3** was sent to Polkadot and Kusama Treasuries:

🥞 The focus is on **Staking**, new **Wallet features**, and **mobile libraries improvements**.

🐦 **Kusama Council** approved the Proposal! 🎉

👨‍💻 The team has started a new **development Sprint** on 21st of January — main focus on preparing libraries for Staking features.

🌙 **Collaboration with Moonbeam —** currently the team is working on composing a proposal to the Moonbeam Treasury. The goal of integration is to support Moonbeam parachain assets in Fearless Wallet.

💸 **MoonPay integration** — in addition to Ramp, the team is working on adding MoonPay support for crypto on-ramp.

🤝 Fearless Wallet Joined the [**Polkadot DeFi Alliance**](https://www.polkadotdefialliance.com/)**!**

About SORA NEO Network, Polkaswap, and Fearless Wallet
------------------------------------------------------

[**SORA**](/@sora.xor/sora-the-new-economic-order-3ec3f0327e5a) is a new economic system aimed at creating a supranational, **Decentralized Central Bank (DCB)** with built-in tools for decentralized finance (DeFi). The [SORA](https://sora.org) network implements a new way of parachain architecture on [Polkadot](https://polkadot.network/) and [Kusama](https://kusama.network/) network, with the capability to [bridge](https://wiki.polkadot.network/docs/en/learn-bridges) external blockchains (like Ethereum) to Polkadot ecosystem.

One of the DeFi applications that will run on the SORA network is [**Polkaswap**](https://polkaswap.io/), a non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind **Aggregate Liquidity Technology (ALT)** with the security and convenience of a DEX.

[**Fearless Wallet**](https://fearlesswallet.io/) is a mobile wallet designed for the decentralized future on the Kusama and Polkadot network, with support for iOS and Android platforms. An awesome user experience, fast performance, and secure storage for your accounts. The Fearless wallet will integrate Polkaswap for easy, decentralized swaps of assets.

Connect with Us:
----------------

[SORA](https://sora.org/) community:
------------------------------------

[**Twitter**](https://twitter.com/sora_xor) | [**Telegram**](https://t.me/sora_xor) **|** [**Reddit**](https://www.reddit.com/r/SORA/) **|** [**Announcements Channel**](https://t.me/sora_announcements)

Press enter or click to view image in full size

[Polkaswap](https://polkaswap.io/) community:
---------------------------------------------

[**Twitter**](https://twitter.com/polkaswap) **|** [**Telegram**](https://t.me/polkaswap) **|** [**Reddit**](https://www.reddit.com/r/Polkaswap/) **|** [**Announcement Channel**](https://t.me/polkaswap_announcements)

Press enter or click to view image in full size

[Fearless Wallet](https://fearlesswallet.io/) community:
--------------------------------------------------------

[**Twitter**](https://twitter.com/FearlessWallet) **|** [**Telegram**](https://t.me/fearlesswallet) **|** [**Android App**](https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless) **|** [**iOS App**](https://apps.apple.com/us/app/fearless-wallet/id1537251089)

Press enter or click to view image in full size

[

Blockchain

](/tag/blockchain?source=post_page-----f157bc726521---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----f157bc726521---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----f157bc726521---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----f157bc726521---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fspf-dev-update-archive%2Ff157bc726521&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fjanuary-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521&user=Polkaswap&userId=246f0843d222&source=---footer_actions--f157bc726521---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fspf-dev-update-archive%2Ff157bc726521&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fjanuary-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521&user=Polkaswap&userId=246f0843d222&source=---footer_actions--f157bc726521---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Ff157bc726521&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fjanuary-29-2021-sora-polkaswap-and-fearless-wallet-dev-updates-f157bc726521&source=---footer_actions--f157bc726521---------------------bookmark_footer------------------)

[

![SPF Dev Update Archive](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_info--f157bc726521---------------------------------------)

[

![SPF Dev Update Archive](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_info--f157bc726521---------------------------------------)

[

Published in SPF Dev Update Archive
-----------------------------------

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_info--f157bc726521---------------------------------------)

[16 followers](/spf-dev-update-archive/followers?source=post_page---post_publication_info--f157bc726521---------------------------------------)

·[Last published Aug 25, 2021](/spf-dev-update-archive/august-25-2021-dev-updates-for-sora-polkaswap-and-fearless-wallet-4529e29ace82?source=post_page---post_publication_info--f157bc726521---------------------------------------)

The SORA, Polkaswap, and Fearless Wallet projects are all closely related as they form integral parts of the SORA ecosystem. This archive contains development status updates released for these three projects, in one convenient place

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/@polkaswap?source=post_page---post_author_info--f157bc726521---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/@polkaswap?source=post_page---post_author_info--f157bc726521---------------------------------------)

[

Written by Polkaswap
--------------------

](/@polkaswap?source=post_page---post_author_info--f157bc726521---------------------------------------)

[3.6K followers](/@polkaswap/followers?source=post_page---post_author_info--f157bc726521---------------------------------------)

·[7 following](/@polkaswap/following?source=post_page---post_author_info--f157bc726521---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--f157bc726521---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----f157bc726521---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----f157bc726521---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----f157bc726521---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----f157bc726521---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----f157bc726521---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----f157bc726521---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----f157bc726521---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----f157bc726521---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----f157bc726521---------------------------------------)
