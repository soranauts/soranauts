---
title: "December 25, 2020 \U0001F384 SORA, Polkaswap, and Fearless Dev Update"
source: polkaswap_update
source_url: >-
  https://medium.com/spf-dev-update-archive/december-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3
doc_id: 6a51d28120eb58aa
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:06:14.491Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: 898b264bada53d2b38dea326d82e3c7228ce60112cdb9f86049b4114281f6a90
content_hash: 898b264bada53d2b38dea326d82e3c7228ce60112cdb9f86049b4114281f6a90
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:06:14.275Z'
---
December 25, 2020 🎄 SORA, Polkaswap, and Fearless Dev Update | by Polkaswap | SPF Dev Update Archive | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F10bd43ec34b3&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fdecember-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fdecember-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SPF Dev Update Archive

--------------------------

](https://medium.com/spf-dev-update-archive?source=post_page---publication_nav-5c1f6a55a5b4-10bd43ec34b3---------------------------------------)

·

[

![SPF Dev Update Archive](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_sidebar-5c1f6a55a5b4-10bd43ec34b3---------------------------------------)

The SORA, Polkaswap, and Fearless Wallet projects are all closely related as they form integral parts of the SORA ecosystem. This archive contains development status updates released for these three projects, in one convenient place

December 25, 2020 🎄 SORA, Polkaswap, and Fearless Dev Update
=============================================================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/@polkaswap?source=post_page---byline--10bd43ec34b3---------------------------------------)

[Polkaswap](/@polkaswap?source=post_page---byline--10bd43ec34b3---------------------------------------)

4 min read

·

Dec 25, 2020

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fspf-dev-update-archive%2F10bd43ec34b3&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fdecember-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3&user=Polkaswap&userId=246f0843d222&source=---header_actions--10bd43ec34b3---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F10bd43ec34b3&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fdecember-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3&source=---header_actions--10bd43ec34b3---------------------bookmark_footer------------------)

Listen

Share

The [SORA](https://sora.org), [Polkaswap](https://polkaswap.io), and [Fearless Wallet](https://fearlesswallet.io) projects are all closely related as they form integral parts of the SORA ecosystem. That is why development status updates are released every two weeks for these three projects, in one convenient place. Enjoy the December 25, 2020 🎄 Dev update! If you missed the previous ones:

[December 11th DEV update](/polkaswap/december-11-2020-sora-polkaswap-fearless-dev-updates-5340e33e4ae)

[November 27th DEV update](/polkaswap/november-27-2020-spf-dev-updates-5f7965f74a9e)

[November 13th DEV update](/polkaswap/november-13-2020-sora-polkaswap-fearless-wallet-dev-update-d159d70c9ea8)

[October 30th DEV update](https://sora-xor.medium.com/october-30-2020-dev-updates-for-sora-polkaswap-and-fearless-wallet-9ff465a6d751)

[October 16th DEV update](https://sora-xor.medium.com/october-16-2020-dev-updates-for-sora-polkaswap-and-fearless-wallet-71e4884e29d7)

SORA Dev Update #6
------------------

— — — — — — — — — — — — — — — — —

Press enter or click to view image in full size

👨‍🔬𒀭𒋾 Worked on the technical design for migration to the SORA v2 [Substrate](https://www.parity.io/substrate/)\-based network.

📱 Finalizing design for the SORA 1.7 mobile app

🌾𒉆𒀳 [**SORA farm**](https://sora.farm/) community game changes are being implemented:

* The rewards will not decrease everyday anymore; equal amount of rewards will be distributed every day instead! Rewards won’t change retroactively, but this new method will go into effect at the update. More information will come with the SORA farm update!
* The end of the game will be linked to the Polkaswap launch and there will not be an exact block ending anymore. Therefore the specific end time will be announced later.

Press enter or click to view image in full size

Polkaswap Dev Update #8
-----------------------

— — — — — — — — — — — — — — — — —

⛩️ [Polkaswap](https://polkaswap.io) testnet API is now available in the [polkadot js apps](https://polkadot.js.org/apps). You can play with API!

🌐 Web UI for the wallet, pool, and swap features is being finalized

📈 The QA team is working on the test network stability in preparation to release for public testing

Press enter or click to view image in full size

Fearless Wallet Dev Update #12
------------------------------

— — — — — — — — — — — — — — — — —

🎉 [Fearless Wallet](https://fearlesswallet.io/) 1.1 was released on 2020–12–23 🎉

🌟 You can now buy DOT tokens (KSM soon), there’s a new UI for the Wallet tab, and improvements for Sending KSM and DOT.

🎄 Learn more about the release in the [article](https://polkaswap.medium.com/fearless-wallet-integrates-ramp-for-easy-fiat-to-crypto-on-ramps-1e36ba014217)

🎁 Proposal for Stage 3 will soon be submitted to the Kusama Treasury, includes the following features:

🥞 Staking — convenient and easy way to stake KSM/DOT tokens

💠 [Polkaswap](https://polkaswap.io) — mobile interface for DEX swapping in the Polkadot and Kusama ecosystems

📚 Libraries — improvements to the open source Fearless libraries which will help the community to build native mobile apps for Substrate networks

Press enter or click to view image in full size

Get Fearless Wallet: 🚀 [Google Play](https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless) 🍎 [AppStore](https://apps.apple.com/us/app/fearless-wallet/id1537251089)

— — — — — — — — — — — — — — — — —
---------------------------------

About SORA NEO Network, Polkaswap, and Fearless Wallet
------------------------------------------------------

[SORA NEO (New Economic Order)](/@sora.xor/sora-the-new-economic-order-3ec3f0327e5a) is a new economic system aimed at creating a supranational, decentralized central bank (DCB) with built-in tools for decentralized finance (DeFi). The [SORA](https://sora.org) network implements a new way of parachain architecture on [Polkadot](https://polkadot.network/) and [Kusama](https://kusama.network/) network, with the capability to [bridge](https://wiki.polkadot.network/docs/en/learn-bridges) external blockchains (like Ethereum) to Polkadot ecosystem. One of the DeFi applications that will run on the SORA network is [Polkaswap](https://polkaswap.io/), a non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind **Aggregate Liquidity Technology (ALT)** with the security and convenience of a DEX.

[Fearless Wallet](https://fearlesswallet.io/) is a mobile wallet designed for the decentralized future on the Kusama and Polkadot network, with support for iOS and Android platforms. An awesome user experience, fast performance, and secure storage for your accounts. The Fearless wallet will integrate Polkaswap for easy, decentralized swaps of assets.

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

](/tag/blockchain?source=post_page-----10bd43ec34b3---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----10bd43ec34b3---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----10bd43ec34b3---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----10bd43ec34b3---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----10bd43ec34b3---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fspf-dev-update-archive%2F10bd43ec34b3&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fdecember-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3&user=Polkaswap&userId=246f0843d222&source=---footer_actions--10bd43ec34b3---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fspf-dev-update-archive%2F10bd43ec34b3&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fdecember-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3&user=Polkaswap&userId=246f0843d222&source=---footer_actions--10bd43ec34b3---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F10bd43ec34b3&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fspf-dev-update-archive%2Fdecember-25-2020-sora-polkaswap-and-fearless-dev-update-10bd43ec34b3&source=---footer_actions--10bd43ec34b3---------------------bookmark_footer------------------)

[

![SPF Dev Update Archive](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_info--10bd43ec34b3---------------------------------------)

[

![SPF Dev Update Archive](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_info--10bd43ec34b3---------------------------------------)

[

Published in SPF Dev Update Archive
-----------------------------------

](https://medium.com/spf-dev-update-archive?source=post_page---post_publication_info--10bd43ec34b3---------------------------------------)

[16 followers](/spf-dev-update-archive/followers?source=post_page---post_publication_info--10bd43ec34b3---------------------------------------)

·[Last published Aug 25, 2021](/spf-dev-update-archive/august-25-2021-dev-updates-for-sora-polkaswap-and-fearless-wallet-4529e29ace82?source=post_page---post_publication_info--10bd43ec34b3---------------------------------------)

The SORA, Polkaswap, and Fearless Wallet projects are all closely related as they form integral parts of the SORA ecosystem. This archive contains development status updates released for these three projects, in one convenient place

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/@polkaswap?source=post_page---post_author_info--10bd43ec34b3---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/@polkaswap?source=post_page---post_author_info--10bd43ec34b3---------------------------------------)

[

Written by Polkaswap
--------------------

](/@polkaswap?source=post_page---post_author_info--10bd43ec34b3---------------------------------------)

[3.6K followers](/@polkaswap/followers?source=post_page---post_author_info--10bd43ec34b3---------------------------------------)

·[7 following](/@polkaswap/following?source=post_page---post_author_info--10bd43ec34b3---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--10bd43ec34b3---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----10bd43ec34b3---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----10bd43ec34b3---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----10bd43ec34b3---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----10bd43ec34b3---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----10bd43ec34b3---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----10bd43ec34b3---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----10bd43ec34b3---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----10bd43ec34b3---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----10bd43ec34b3---------------------------------------)
