---
title: 'PSWAP Rewards 1: Polkaswap Liquidity Reward Farming'
source: polkaswap_update
source_url: >-
  https://medium.com/polkaswap/pswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509
doc_id: ca2cc68924d9d6a2
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:06:28.445Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: a28f3a0a9b4fa51fa5e4f6f1d59b99dc48e4f32bf67a9d8658ded0c924a5bda2
content_hash: a28f3a0a9b4fa51fa5e4f6f1d59b99dc48e4f32bf67a9d8658ded0c924a5bda2
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:06:28.219Z'
---
PSWAP Rewards 1: Polkaswap Liquidity Reward Farming | by Polkaswap | Polkaswap | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F3e045d71509&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

Polkaswap

-------------

](https://medium.com/polkaswap?source=post_page---publication_nav-7dd150c29856-3e045d71509---------------------------------------)

·

[

![Polkaswap](./images/cf82f8d65570f4817d617e2117ee39a73d7a6500e311d37c8e16e183b5c2cfb0.png)

](https://medium.com/polkaswap?source=post_page---post_publication_sidebar-7dd150c29856-3e045d71509---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

PSWAP Rewards 1: Polkaswap Liquidity Reward Farming
===================================================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/@polkaswap?source=post_page---byline--3e045d71509---------------------------------------)

[Polkaswap](/@polkaswap?source=post_page---byline--3e045d71509---------------------------------------)

5 min read

·

Mar 1, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F3e045d71509&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509&user=Polkaswap&userId=246f0843d222&source=---header_actions--3e045d71509---------------------clap_footer------------------)

\--

1

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F3e045d71509&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509&source=---header_actions--3e045d71509---------------------bookmark_footer------------------)

Listen

Share

TL;DR
-----

* There are 3.5 Billion PSWAP available for farming rewards, over approximately 4 years, at 2.5 million PSWAP per day
* For calculating rewards, only the XOR portion of liquidity is included, to normalize across all token pairs
* Rewards are calculated with a temporal vesting coefficient, so the longer liquidity is provided for, the higher the rewards
* To farm PSWAP rewards, at least 1 XOR has to be in a liquidity pool
* **Providing liquidity for XOR-VAL, XOR-PSWAP, XOR-ETH, and XOR-DAI pairs will have double rewards**

𒊹𒂵𒆜𒉆𒀳🌾ソラ農業組合
------------------

[Sora.farm](http://sora.farm) has been an exciting game that has energized the community to provide liquidity for XOR-VAL, XOR-ETH, and VAL-ETH token pairs. Lessons learned from the [sora.farm](http://sora.farm) game are that our community really enjoys this type of engagement and that having a vesting coefficient makes the liquidity sticky, but having too high of a vesting coefficient makes the game hard to enter for late-comers. For liquidity farming rewards on the [Polkaswap](https://polkaswap.io) exchange, we are modifying the algorithm used on [sora.farm](https://sora.farm) to have less of a vesting coefficient, as well as to apply liquidity farming to all pairs on the Polkaswap DEX.

Farming provides incentives for users who add liquidity on Polkaswap. Every token pair can participate in this incentive distribution. To normalize value across liquidity pools, only the XOR portion of provided liquidity is counted for farming rewards.

Farming on Polkaswap is _automagic_ — the user doesn’t need to stake LP tokens, but can just claim rewards as desired, once they accumulate! To qualify, a user just needs to maintain more than 1 XOR in their liquidity pool for a pair.

Press enter or click to view image in full size

Space Farm Waifu, Noriko Soramoto

**Example:** A user provides liquidity for the DAI-XOR pair. She provides 200 DAI and 1 XOR. So for this moment, we count only 1 XOR of liquidity for this user to calculate farming rewards. If later after price changes she has 300 DAI and 0.5 XOR of liquidity provided at the moment of recalculations, then the user’s liquidity would no longer be counted, as it is less than 1 XOR in the liquidity pool. On the other hand if the price changes such that the user has 100 DAI and 2 XOR in the liquidity pool, then 2 XOR would be counted towards farming rewards at that time window.

2,500,000 PSWAP will be distributed per day out of a pool of 3.5 Billion PSWAP tokens (35% of maximum supply), for approximately 4 years (1,400 days). **For providing liquidity for XOR-VAL and XOR-PSWAP pairs, the reward score will be doubled.** After being farmed, incentives should be vested to be claimed. The vesting speed depends on the amount of PSWAP burned from Polkaswap usage fees.

Vesting
-------

After being farmed, rewards are not given instantly to the user. Rewards should be vested for the user to be able to claim it. The vesting speed depends on the amount of PSWAP burned from Polkaswap usage fees. Farmed PSWAP are vested as **Strategic Bonus Vesting**, where the amount vested is a percentage of the daily amount of PSWAP burned in transaction fees, as shown in the figure below.

Press enter or click to view image in full size

The PSWAP strategic bonus vesting curve is defined by the line: y=-0.000357x+1 until it reaches 0.45 (45%). Then it is flat at 45% of the daily burn, until all rewards are vested.

Claiming
--------

Users can claim only vested tokens and the claiming will be possible at any time as long as there are non-zero rewards for an account.

Conclusion
----------

SORA Farming will not end at the launch of Polkaswap, just change its form! Special PSWAP bonuses will continue on for almost another 4 years, to incentivize the provision of boundless liquidity.

In addition to SORA Farming, there will be 2 other special PSWAP bonus reward programs, which will be introduced in future articles, over the next two weeks!

Farming — The Maths
-------------------

Annual Percentage Yield (APY)
-----------------------------

It is possible to quickly approximate the current APY using the formula below, for the current day:

Press enter or click to view image in full size

Note that the above formula is a bit **conservative** about APY calculation, as it just includes all XOR provided in liquidity pools, even though rewards will actually only be given out when greater than 1 XOR are in a pool for a user. However, calculating the APY this way is faster computationally and it should be fairly close.

Press enter or click to view image in full size

There is a vesting coefficient to incentivise users who provide liquidity for a long time:

Distributed reward at time t for 1 pool from block 1 until tokens run out, checking liquidity every 1,200 blocks (approx. 2 hours):

Distributed reward at time t for 1 pool from starting block:

Reward for a user i at time t with applied vesting coefficient:

Total rewards for user i:

About SORA, Polkaswap, and Fearless Wallet
------------------------------------------

[**SORA**](/@sora.xor/sora-the-new-economic-order-3ec3f0327e5a) is a new economic system aimed at creating a supranational, world economic system with built-in tools for decentralized finance (DeFi). The [SORA](https://sora.org) network implements a new way of parachain architecture on [Polkadot](https://polkadot.network/) and [Kusama](https://kusama.network/) network, with the capability to [bridge](https://wiki.polkadot.network/docs/en/learn-bridges) external blockchains (like Ethereum) to the Polkadot ecosystem.

One of the DeFi applications that will run on the SORA network is [**Polkaswap**](https://polkaswap.io/), a non custodial liquidity aggregating, cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through its one-of-a-kind **Aggregate Liquidity Technology (ALT)**.

[**Fearless Wallet**](https://fearlesswallet.io/) is a mobile wallet designed for the decentralized future on the Kusama and Polkadot networks, with support for iOS and Android platforms. An awesome user experience, fast performance, and secure storage for your accounts. Fearless wallet will integrate Polkaswap for easy, decentralized swaps of assets.

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

](/tag/blockchain?source=post_page-----3e045d71509---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----3e045d71509---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----3e045d71509---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----3e045d71509---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----3e045d71509---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F3e045d71509&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509&user=Polkaswap&userId=246f0843d222&source=---footer_actions--3e045d71509---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F3e045d71509&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509&user=Polkaswap&userId=246f0843d222&source=---footer_actions--3e045d71509---------------------clap_footer------------------)

\--

1

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F3e045d71509&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509&source=---footer_actions--3e045d71509---------------------bookmark_footer------------------)

[

![Polkaswap](./images/a2a865cdc58a8abc70d9e706fdd5cb5d57868fc11d220491eb8adec8e809cc84.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--3e045d71509---------------------------------------)

[

![Polkaswap](./images/326954642349c766b8441b9782015786a61edcd12b2af6bfc5c3ba7cd067ad83.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--3e045d71509---------------------------------------)

[

Published in Polkaswap
----------------------

](https://medium.com/polkaswap?source=post_page---post_publication_info--3e045d71509---------------------------------------)

[1.5K followers](/polkaswap/followers?source=post_page---post_publication_info--3e045d71509---------------------------------------)

·[Last published Jun 2, 2025](/polkaswap/polkaswap-ecosystem-updates-84-may-33-2025-40214bd1d82e?source=post_page---post_publication_info--3e045d71509---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/@polkaswap?source=post_page---post_author_info--3e045d71509---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/@polkaswap?source=post_page---post_author_info--3e045d71509---------------------------------------)

[

Written by Polkaswap
--------------------

](/@polkaswap?source=post_page---post_author_info--3e045d71509---------------------------------------)

[3.6K followers](/@polkaswap/followers?source=post_page---post_author_info--3e045d71509---------------------------------------)

·[7 following](/@polkaswap/following?source=post_page---post_author_info--3e045d71509---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

Responses (1)
-------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--3e045d71509---------------------------------------)

See all responses

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----3e045d71509---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----3e045d71509---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----3e045d71509---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----3e045d71509---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----3e045d71509---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----3e045d71509---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----3e045d71509---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----3e045d71509---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----3e045d71509---------------------------------------)
