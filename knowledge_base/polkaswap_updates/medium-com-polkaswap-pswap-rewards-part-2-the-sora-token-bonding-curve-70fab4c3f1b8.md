---
title: 'PSWAP Rewards Part 2: The SORA Token Bonding Curve'
source: polkaswap_update
source_url: >-
  https://medium.com/polkaswap/pswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8
doc_id: 897c8e0288cd35e5
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:06:32.950Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: a6245a9f6b451f7557e21d5cf8fd682b9f55b0e31877db41497130fb351f56b4
content_hash: a6245a9f6b451f7557e21d5cf8fd682b9f55b0e31877db41497130fb351f56b4
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:06:32.722Z'
---
PSWAP Rewards Part 2: The SORA Token Bonding Curve | by Polkaswap | Polkaswap | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F70fab4c3f1b8&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

Polkaswap

-------------

](https://medium.com/polkaswap?source=post_page---publication_nav-7dd150c29856-70fab4c3f1b8---------------------------------------)

·

[

![Polkaswap](./images/cf82f8d65570f4817d617e2117ee39a73d7a6500e311d37c8e16e183b5c2cfb0.png)

](https://medium.com/polkaswap?source=post_page---post_publication_sidebar-7dd150c29856-70fab4c3f1b8---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

PSWAP Rewards Part 2: The SORA Token Bonding Curve
==================================================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/@polkaswap?source=post_page---byline--70fab4c3f1b8---------------------------------------)

[Polkaswap](/@polkaswap?source=post_page---byline--70fab4c3f1b8---------------------------------------)

10 min read

·

Mar 9, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F70fab4c3f1b8&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8&user=Polkaswap&userId=246f0843d222&source=---header_actions--70fab4c3f1b8---------------------clap_footer------------------)

\--

3

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F70fab4c3f1b8&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8&source=---header_actions--70fab4c3f1b8---------------------bookmark_footer------------------)

Listen

Share

TL;DR
-----

* The token bonding curve is a smart contract that holds assets of reserve currencies to enable forward guidance price predictability for the XOR token
* At the launch of the SORA v2 network, 350,000 XOR will already be in existence that will not have any reserve asset backing
* To help collateralize the token bonding curve, 2.5 Billion PSWAP are provided as special bonus rewards when buying newly minted XOR from the token bonding curve
* These PSWAP rewards will start at launch
* DOT and KSM held in reserves by the token bonding curve will be used to secure parachain slots for the SORA ecosystem

Press enter or click to view image in full size

Biker waifu **Ichigo Soramoto**

ソラの分散型大蔵省
---------

The SORA token bonding curve acts as the decentralized, on-chain manager of the XOR token. It works by taking in reserve assets and minting new XOR, or conversely, de-mints XOR and releases reserve assets.

The XOR token supply is elastically determined through market forces using the token bonding curve. It is important to note that **the token bonding curve does not guarantee stability of the price of XOR, but rather a measure of** [**forward-guided**](https://www.ecb.europa.eu/explainers/tell-me/html/what-is-forward_guidance.en.html) **price predictability**.

At the initial beta launch, the token bonding curve will support the following assets as reserves:

* DOT (at full launch, not beta launch)
* KSM (at full launch, not beta launch)
* ETH
* DAI
* VAL
* PSWAP

**After bridges to Kusama and Polkadot relay chains are complete, the token bonding curve will be extended to support KSM and DOT as reserve assets.**

Decentralized Reserve Collateralization Incentives
--------------------------------------------------

At the launch of the SORA v2 network, 350,000 XOR will already be in existence. This means that the SORA token bonding curve will have an unfunded liability of 350,000 XOR worth of DAI, 350,000 XOR worth of ETH, 350,000 worth of VAL, and 350,000 XOR worth of PSWAP.

To ensure that sufficient reserves in the SORA token bonding curve are built up, 25% of the PSWAP token supply (2.5 billion PSWAP) will be used as rewards to those who buy XOR from the SORA token bonding curve using reserve currencies, except for PSWAP and VAL. PSWAP bonus rewards for putting VAL and PSWAP tokens into the token bonding curve are not available, as this would be analogous to selling VAL and PSWAP, which would be an anti-soralutionary anathema!

After KSM and DOT are available on the SORA network, **double rewards will be given to KSM and DOT**, as these two currencies are needed to secure parachain slots for the SORA ecosystem (that’s right: the SORA Parliament will join the parachain auctions using reserves from the token bonding curve).

Previously, it was stated that [PSWAP would be used to reward people for parachain auctions](/polkaswap/sora-network-parachain-for-polkaswap-intro-859558753f48), but now t**his will not take place and users will not get PSWAP for locking up DOT or KSM, only for using their DOT and KSM to buy XOR from the token bonding curve**, and then the DOT and KSM from the token bonding curve will be used for the parachain auctions as needed.

Reward Calculation
------------------

**There are 2.5 Billion PSWAP reserved for incentivizing the build up of reserves in the token bonding curve.** The rewards will be distributed according to the following calculations.

_Unfunded liabilities_ of the token bonding curve is the difference between the ideal liabilities and actual liabilities. PSWAP rewards are given to users for reducing the ratio between unfunded and ideal liabilities. The formula,

is used to determine _R_, the reward amount, when buying from the token bonding curve, where _a_ is the ratio of unfunded liabilities to ideal reserves of the token bonding curve before the trade, _b_ is the ratio of unfunded liabilities to ideal reserves after the trade, P is 2,500,000,000 (the number of PSWAP total rewards), and _N_ is the number of reserve currencies that are applicable for the PSWAP reward bonuses (initially 2).

For example, if the token bonding curve has no reserves and we assume unfunded liabilities of $270,000,000, then the first $1000 worth of DAI used to buy XOR would get approximately a 3,700 PSWAP token bonus for reducing the under-collateralization ratio from 270,000,000/270,000,000 to 270,000,000/270,000,800 (unfunded liabilities/ideal reserves). This is because only $800 of the $1000 (80%) goes into reserves and the unfunded liabilities of $270 million are the same. Over time, XOR will be burned in transaction fees, so the unfunded liabilities will get better naturally over time.

Press enter or click to view image in full size

NOTE: these numbers are for illustration purposes only!

Vesting
-------

After being earned, rewards are not given instantly to the user. [As with the Polkaswap liquidity reward farming program](/polkaswap/pswap-rewards-1-polkaswap-liquidity-reward-farming-3e045d71509), the special PSWAP rewards for users who purchase XOR from the token bonding curve are distributed as a fraction of the daily burn. This gives guarantees that a sudden supply of tokens will not immediately flood the market and gives clear forward guidance about the supply of tokens in circulation.

The vesting speed depends on the amount of PSWAP burned from Polkaswap usage fees. Farmed PSWAP are vested as **Strategic Bonus Vesting**, where the amount vested is a percentage of the daily amount of PSWAP burned in transaction fees, as shown in the figure below.

Press enter or click to view image in full size

The PSWAP strategic bonus vesting curve is defined by the line: y=-0.000357x+1 until it reaches 0.45 (45%). Then it is flat until all rewards are vested.

PSWAP Rewards Claiming
----------------------

Users can claim only vested tokens and the claiming will be possible at any time as long as there are non-zero rewards for an account.

Buy Price Function
------------------

The _buy price_ function of the token bonding curve is the price at which XOR can be bought at.

The current price of the buy price function depends on the supply of XOR in circulation, and is defined by the line _y=mx+b_ where _b_ is the starting price of the token bonding curve and the slope, _m := 1/1337_ (meaning $1 increase for each 1337 XOR in circulation), and _y_ is the current price quote for XOR from the token bonding curve.

_b_, the starting price of the token bonding curve, will be decided right before launch and will first be made public in the source code deployable that the community will have to vote on to deploy and use the DEX.

Example: Buying XOR with DAI
----------------------------

Assume:
-------

* 1,400 DAI in reserves
* Current Buy price for XOR from the token bonding curve is $306
* The secondary market has 5 XOR and 1,400 DAI in an _xy=k_ constant product liquidity pool

If the user wants to buy 5 million DAI worth of XOR, then there is not enough XOR in the secondary market, so the primary market (token bonding curve) will _automagically_ be activated for part of the order. First, we should figure out the amount of XOR to be bought on the secondary market before the price asymptotically rises so high that the token bonding curve will be cheaper.

Press enter or click to view image in full size

The _k_ constant in the secondary market is _5\*1400=7,000 ,_ giving an average price of $280 per XOR at the start. We can consider that after the trade, _x_ and _y_ change to new values, _x2_ and _y2_, such that _x2\*y2=k_. To find how much XOR we can trade before the price will exceed $306 (that is, _y2/x2=306_), we calculate the amount of XOR that would be in the secondary market liquidity pool when the price is $306:

Press enter or click to view image in full size

This means that we can buy

for

leaving us $4,999,936.442689882 left to buy XOR from the token bonding curve (ignoring transaction fees).

Sell Price Function
-------------------

To calculate the difference between the ideal reserve amount and the actual reserves, we just subtract the area under the actual reserve curve from the area under the ideal curve.

Press enter or click to view image in full size

It should be noted that there will be higher fees for selling into reserves that are undercollateralized:

* under 30% collateralized: +1% fee
* under 20% collateralized: +3% fee
* under 10% collateralized: +6% fee
* under 5% collateralized: +9% fee

These extra fees will be burned.

Example: Selling XOR for DAI
----------------------------

Assume:
-------

* 50,000,000 DAI in reserves
* Current sell price for XOR from the token bonding curve is $255
* The secondary market has 5 XOR and 1,400 DAI in an _xy=k_ constant product liquidity pool

If the user wants to sell 5 XOR for DAI into the token bonding curve, then we use _xy=k_ constant product curve to calculate how much DAI will be given to the user for 5 XOR. Because there are 50 million DAI, we pretend there are also 50 million DAI worth of XOR, which would be 50,000,000/255=196,078.431372549 XOR. **It is important to note that these XOR don’t actually exist**, but we just pretend they exist as the token bonding curve is an infinitely liquid market maker anyway. Doing this allows us to calculate _k_ as _(50,000,000/255)\*50,000,000=9,803,921,568,627.451_.

This kind of fiction is necessary because while the ideal reserves are equal to the area under the sell-price function, often under-collateralization will exist and the sell-price function will have a curve with a much steeper slope, as shown illustratively in the figures below.

Press enter or click to view image in full size

In this example, after the user sells 5 XOR, there will be _196,078.431372549+5=_196,083.431372549 _pretend_ XOR (because these XOR don’t really exist and even the 5 that are inputted shall be de-minted) in the token bonding curve. After the trade, _k_ should still be the same, so there will be

Press enter or click to view image in full size

in the token bonding curve reserves and the seller will have gotten _50,000,000–49,998,725.032511674=_1,274.9674883261323 DAI for her 5 XOR.

Some Notes on the Multicollateral Bonding Curve
-----------------------------------------------

When user deposits collateral token which is not a reference token (i.e., not DAI) the buy function determines its reference (DAI) price in order to perform calculations w.r.t. the USD representation.

In sell function XOR price is 80% of buy function and a reference (DAI) price for collateral tokens, apart from these USD price conversions model matches above description.

To calculate actual reserves, the cumulative DAI price of reserve tokens is used in rewards calculation.

Use of the Token Bonding Curve Margin
-------------------------------------

When users buy from the XOR primary market (token bonding curve), 20% of the amount of deposited tokens are put into a pool that periodically buys back and burns XOR and then the amount of XOR burned is re-minted and distributed proportionally as shown below. The other 80% of deposited tokens are stored in the token bonding curve as reserves.

The 20% buy-sell margin is distributed to the following uses:

* VAL buy back and burn: 1%
* VAL holders allocation: 9%
* SORA citizens: 0.1%
* Stores and shoppers: 0.4%
* Parliament and development: 0.5%
* Projects: 9%

In this way, the SORA ecosystem can be funded into perpetuity and properly incentive a diverse set of critical actors.

Unidad de FOMOnto
-----------------

Those who have been paying attention have probably already noticed that the token bonding curve as initially designed inextricably links XOR to the value of the USD. This is potentially a problem because the purchasing power of the USD can fluctuate, exogenously impacting the value of XOR.

In order to link XOR to real purchasing power rather than a specific fiat currency, the token bonding curve should in the future use the [Unidad de Fomento (UF)](https://si3.bcentral.cl/Indicadoressiete/secure/Indicadoresdiarios.aspx) index, which is an [inflation-indexed unit of account](https://si3.bcentral.cl/estadisticas/Principal1/metodologias/EC/IND_DIA/ficha_tecnica_UF_EN.pdf).

Long term, the SORA Parliament should create and maintain its own index of goods for the token bonding curve to use, in order to target forward guidance of purchasing power.

Conclusion
----------

The SORA token bonding curve acts as a completely decentralized monetary authority for the XOR token, autonomously managing the XOR token supply using market forces. The provision of reserves in the token bonding curve is crucial to maintain forward exchange rate guidance for XOR.

While the token bonding curve, by nature of its upward sloping buy and sell functions naturally provides incentives for early adopters, additionally 25 million PSWAP tokens (25% of the fully diluted PSWAP supply) are provided as extra bonuses for those who buy XOR

Large sums of DOT and KSM that are expected to be locked up in the token bonding curve also make a convenient pool from which the SORA ecosystem can borrow DOT and KSM in order to win parachain auctions, and this is exactly the current strategy for funding the required parachains _ad infinitum_.

In addition to SORA Farming and the token bonding curve PSWAP bonus rewards, there will be 1 other special PSWAP bonus reward program, which will be introduced next week!

About SORA NEO Network, Polkaswap, and Fearless Wallet
------------------------------------------------------

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

](/tag/blockchain?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----70fab4c3f1b8---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F70fab4c3f1b8&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8&user=Polkaswap&userId=246f0843d222&source=---footer_actions--70fab4c3f1b8---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F70fab4c3f1b8&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8&user=Polkaswap&userId=246f0843d222&source=---footer_actions--70fab4c3f1b8---------------------clap_footer------------------)

\--

3

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F70fab4c3f1b8&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fpswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8&source=---footer_actions--70fab4c3f1b8---------------------bookmark_footer------------------)

[

![Polkaswap](./images/a2a865cdc58a8abc70d9e706fdd5cb5d57868fc11d220491eb8adec8e809cc84.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--70fab4c3f1b8---------------------------------------)

[

![Polkaswap](./images/326954642349c766b8441b9782015786a61edcd12b2af6bfc5c3ba7cd067ad83.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--70fab4c3f1b8---------------------------------------)

[

Published in Polkaswap
----------------------

](https://medium.com/polkaswap?source=post_page---post_publication_info--70fab4c3f1b8---------------------------------------)

[1.5K followers](/polkaswap/followers?source=post_page---post_publication_info--70fab4c3f1b8---------------------------------------)

·[Last published Jun 2, 2025](/polkaswap/polkaswap-ecosystem-updates-84-may-33-2025-40214bd1d82e?source=post_page---post_publication_info--70fab4c3f1b8---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/@polkaswap?source=post_page---post_author_info--70fab4c3f1b8---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/@polkaswap?source=post_page---post_author_info--70fab4c3f1b8---------------------------------------)

[

Written by Polkaswap
--------------------

](/@polkaswap?source=post_page---post_author_info--70fab4c3f1b8---------------------------------------)

[3.6K followers](/@polkaswap/followers?source=post_page---post_author_info--70fab4c3f1b8---------------------------------------)

·[7 following](/@polkaswap/following?source=post_page---post_author_info--70fab4c3f1b8---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

Responses (3)
-------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--70fab4c3f1b8---------------------------------------)

See all responses

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----70fab4c3f1b8---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----70fab4c3f1b8---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----70fab4c3f1b8---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----70fab4c3f1b8---------------------------------------)
