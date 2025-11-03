---
title: All You Need to Know About SORA Synthetics (XST) on Polkaswap
source: polkaswap_update
source_url: >-
  https://medium.com/polkaswap/all-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216
doc_id: 5b8158a7328bc3dc
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:07:28.769Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: b6ec58e87423488d0590af3a7617a76861eff61aab83c3fdc09fd203deee12b3
content_hash: b6ec58e87423488d0590af3a7617a76861eff61aab83c3fdc09fd203deee12b3
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:07:28.566Z'
---
All You Need to Know About SORA Synthetics (XST) on Polkaswap | by Polkaswap | Polkaswap | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F841a4bf35216&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fall-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fall-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

Polkaswap

-------------

](https://medium.com/polkaswap?source=post_page---publication_nav-7dd150c29856-841a4bf35216---------------------------------------)

·

[

![Polkaswap](./images/cf82f8d65570f4817d617e2117ee39a73d7a6500e311d37c8e16e183b5c2cfb0.png)

](https://medium.com/polkaswap?source=post_page---post_publication_sidebar-7dd150c29856-841a4bf35216---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

All You Need to Know About SORA Synthetics (XST) on Polkaswap
=============================================================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/@polkaswap?source=post_page---byline--841a4bf35216---------------------------------------)

[Polkaswap](/@polkaswap?source=post_page---byline--841a4bf35216---------------------------------------)

7 min read

·

Aug 18, 2023

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F841a4bf35216&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fall-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216&user=Polkaswap&userId=246f0843d222&source=---header_actions--841a4bf35216---------------------clap_footer------------------)

\--

2

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F841a4bf35216&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fall-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216&source=---header_actions--841a4bf35216---------------------bookmark_footer------------------)

Listen

Share

The article aims to address community questions ahead of the SORA Synthetics (XST) launch.

**TL;DR**

* The XST platform will have the same network fees as regular swaps on Polkaswap, although the liquidity route will differ, and there will be a synthetic asset fee based on the asset.
* Swapping XST tokens for XST-based assets, like XSTUSD, will burn the equivalent amount of XST tokens reducing their supply. Likewise, if XSTUSD is swapped to XST, the XST supply will increase proportionately.
* Oracles will have 4-minute interval feed updates to help protect against front-running and keep asset prices constantly up to date.

Press enter or click to view image in full size

We have previously covered an [introduction to SORA Synthetics (XST) assets](/sora-xor/xst-a-platform-for-synthetic-assets-on-sora-b45ca526d8d5) and the precursor to the platform [XSTUSD](/sora-xor/introducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e). With the announcement of SORA Synthetics (XST) and the testnet that allowed the community to mint their algorithmic synthetic assets, questions began flooding the platform on details about XST.

In this article, we will answer some questions the community raised before the platform release so that you can mint XST assets with style and freedom and the confidence that you are using a secure platform.

What are the swap fees, where do they go, and what is burned?
-------------------------------------------------------------

As with other swaps on Polkaswap, the fee is currently 0.7 XOR (about 15 cents at the time of writing). Additionally, the XST traded is burnt as collateral for the asset in question, so, for example, to mint $1 XSTUSD, $1 worth of XST tokens would be burnt.

The swap fees are similar to any swap on Polkaswap. There are two differences, however. The first is that the underlying liquidity source, as all XST swaps, regardless of the pair, needs to follow the route X > XST > XSTXXX, and vice versa, XSTXXX > XST > X.

The second is that there will be a Synthetic asset fee specific to each synthetic _(e.g., XSTBTC will have fee A, and XSTCHF will have fee B. Although A = B is possible)._ The Synthetic Asset Fee is determined upon creating the synthetic asset through governance and can be modified through governance later on. Those fees are calculated in XST, 0.666%, and the amount is converted and charged in XOR.

Here are two examples of asset flows and their respective fees;

**1) To** Swap **XSTRUB > XSTCHF**, the swap route would be: **XSTRUB > XST > XSTCHF**. There would be no LP fee involved, but some Synthetic Asset fees involved.

**The** **total fees would be**: `**Total fee** = XSTRUB(fee_ratio + dynamic_fee_ratio) + XSTCHF(fee_ratio + dynamic_fee_ratio)`

`fee_ratio:` fee, which is set during synthetic asset registration

`dynamic_fee_ratio:` dynamic fee calculated in the band pallet ([more details](https://github.com/sora-xor/sora2-network/issues/553)).

**2)** To Swap **XSTBTC > XOR**, the swap route would be: **XSTBTC > XST > XOR**. In this case, an LP fee is involved, as well as a synthetic asset fee.

Then, the total fees would be: `Total fee** = XSTBTC(fee_ratio + dynamic_fee_ratio) + fee_LP(XST-XOR)`

How do the assets flow, what are the pools impacted, and can you give some examples?
------------------------------------------------------------------------------------

As mentioned above, the asset route is X > XST > XSTXXX, and vice versa, XSTXXX > XST > X. When any token is traded for an XST-based asset, it is first traded for XST, which is then burnt to mint the desired asset, so if a user wants to trade XOR for XSTCHF, the route would be XOR > XST (burn) > XSTCHF (mint). Or vice versa, XSTCHF (burn) > XST (mint) > XOR.

In this case, the XOR-XST pool would be impacted. It is also important to note that XST-based assets cannot be pooled, although as an exception, it is possible to pool XSTUSD with other SORA network tokens (excluding XST-based assets).

How do the Oracles work exactly? What front-running prevention mechanisms are in place?
---------------------------------------------------------------------------------------

Through collaboration with our partners at Band Protocol, the price feeds for over 30 assets, including cryptocurrencies, fiat currencies, and RWA (real-world assets), are fed into SORA Synthetics (XST), allowing users to mint any of these assets.

Currently, the front-running mechanism is a constant (4-minute interval) update of the price feed, enabling SORA Synthetics (XST) to have the most updated price and prevent people or their bots from taking advantage of any price offset.

To prevent front-running, we have implemented a dynamic fee for the synthetic assets based on the percentage change in the Oracle price. This dynamic exchange fee is based on [**SIP-184: Dynamic Exchange Fees**](https://github.com/Synthetixio/SIPs/blob/master/content/sips/sip-184.md). **More information about** [**the implementation is available here**](https://github.com/sora-xor/sora2-network/issues/553)**.**

Additionally, we have implemented a fallback mechanism for market manipulation if there is an Oracle data feed outage for any synthetic asset. If the last price update for a specific synthetic asset happened more than one hour prior, the synthetic asset will automatically be disabled. Once the Oracle data feed resumes, the synthetic asset must be reenabled through governance.

What are the pros and cons of using XST, and why is XST needed?
---------------------------------------------------------------

Using XST as collateral, stable XST-based tokens can be minted “synthetically,” which removes the requirement for over-collateralization when minting the asset. So, for example, 1 XSTUSD is $1 worth of XST, unlike other synthetic assets where to mint a token worth $1, about $1.20 has to be put as collateral.

What is the current XST supply?
-------------------------------

The total supply of XST varies. Check the [SORA Ministry of Finance XST quantity live data feed](https://mof.sora.org/qty/xst) for the latest amount. As of the time of writing this, there is currently 1,471,530,869.11 XST.

How much XST remains to be farmed, and when will the farming conclude?
----------------------------------------------------------------------

Within the XOR-XST farming pool on [Demeter](https://farming.deotoken.io/), there are still 108,227,836 XST left to be farmed, with the farm ending on the **5th of February 2024**. On the XOR-ETH and XOR-DAI pools, there is still 26,400,263 XST left to be farmed, with the farm also ending on the **5th of February 2024**.

If I pool XOR + XST assets, what do I earn?
-------------------------------------------

Unfortunately, XST assets are not available for pooling, only the XST token itself. The only XST asset that can be pooled is XSTUSD. However, it cannot be paired in a pool with other XST-based assets.

How is XST different to SNX?
----------------------------

The main difference between SORA Synthetics (XST) and Synthetix is that for users to mint Synthetix assets, they need to add their $SNX token to a liquidity pool, whereas, in the case of SORA Synthetics (XST), the XST token put as collateral gets burnt. ETH, LUSD, and DAI also collateralize SNX tokens.

Synthetix is a debt-based system where the stakers incur debt by minting the synthetic asset staking $SNX and are freed from the debt when the synthetic asset is burnt. The XST platform, on the other hand, does not cause debt to its user and instead burns the collateral $XST tokens to mint the XST-based asset.

Stakers on the SNX platform must maintain their collateralisation ratio (C-Ratio), or they will be penalised. Source: SNX Litepaper.

How is XST different to LUNA?
-----------------------------

The main difference between XST and LUNA is that XST is decentralized, and the [TBC](https://wiki.sora.org/token-bonding-curve) provides a protection mechanism against boom and bust cycles or speculative attacks, with the collateral to mint XST-based assets being burnt whenever new assets are minted. The XST token backs all XST-based assets, a deflationary token no longer minted, and the only source of new circulating XST comes from liquidity pools within the [Demeter platform](https://farming.deotoken.io/).

In Conclusion
-------------

SORA Synthetics (XST) is unique in the entire Substrate ecosystem. There is no other blockchain currently operating within the ecosystem that has a synthetic asset platform with over 30 price feeds that will allow the community to mint any asset they choose, with the ability to add more via on-chain governance. Every time an XST asset is minted, the overall supply of XST tokens is reduced, reducing the amount of XST tokens needed to mint more assets. SORA Synthetics (XST) is receiving front-running protection, and since the assets are stable, XST-based assets will not fluctuate in value unless the RWA is pegged to changes.

We hope this FAQ helps you understand how XST will work, the main differences between XST and other algorithmic assets, and the benefits the platform brings to users seeking stability. SORA Synthetics (XST) aims to make assets universally accessible through a synthetic representation that is safe, stable, and, most importantly, stylish and free.

As the launch of SORA Synthetics (XST) approaches, more documentation will be provided to cover extensively the platform’s mechanisms and comprehensive guides to request assets through governance. In the meantime, if you have further questions, contact the SORA community on [Telegram](https://t.me/polkaswap) or [Twitter](https://twitter.com/polkaswap) for more support.

About Polkaswap
---------------

Polkaswap is a DeFi application on the SORA network, it is a non-custodial liquidity aggregating, cross-chain AMM DEX designed uniquely for the Polkadot ecosystem. It offers boundless liquidity through its one-of-a-kind Aggregate Liquidity Technology (ALT).

Polkaswap utilizes SORA network interoperability with the [Polkadot](https://polkadot.network/) and [Kusama](https://kusama.network/) networks, as well as the capability to [bridge](https://wiki.polkadot.network/docs/en/learn-bridges) external blockchains (like Ethereum) to the Polkadot ecosystem.

Connect With Us
---------------

[**Polkaswap**](https://polkaswap.io/) **𒊹𒂵𒆜 community:**

[Twitter](https://twitter.com/polkaswap) | [Telegram](https://t.me/polkaswap) | [Reddit](https://www.reddit.com/r/Polkaswap/) | [YouTube](https://www.youtube.com/channel/UC6piTNmXCIfql72tNu183FA) | [Announcements Channel](https://t.me/polkaswap_announcements)

[

Synthetic Asset

](/tag/synthetic-asset?source=post_page-----841a4bf35216---------------------------------------)

[

Crypto Trading

](/tag/crypto-trading?source=post_page-----841a4bf35216---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----841a4bf35216---------------------------------------)

[

Substrate

](/tag/substrate?source=post_page-----841a4bf35216---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----841a4bf35216---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F841a4bf35216&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fall-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216&user=Polkaswap&userId=246f0843d222&source=---footer_actions--841a4bf35216---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F841a4bf35216&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fall-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216&user=Polkaswap&userId=246f0843d222&source=---footer_actions--841a4bf35216---------------------clap_footer------------------)

\--

2

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F841a4bf35216&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fall-you-need-to-know-about-sora-synthetics-xst-on-polkaswap-841a4bf35216&source=---footer_actions--841a4bf35216---------------------bookmark_footer------------------)

[

![Polkaswap](./images/a2a865cdc58a8abc70d9e706fdd5cb5d57868fc11d220491eb8adec8e809cc84.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--841a4bf35216---------------------------------------)

[

![Polkaswap](./images/326954642349c766b8441b9782015786a61edcd12b2af6bfc5c3ba7cd067ad83.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--841a4bf35216---------------------------------------)

[

Published in Polkaswap
----------------------

](https://medium.com/polkaswap?source=post_page---post_publication_info--841a4bf35216---------------------------------------)

[1.5K followers](/polkaswap/followers?source=post_page---post_publication_info--841a4bf35216---------------------------------------)

·[Last published Jun 2, 2025](/polkaswap/polkaswap-ecosystem-updates-84-may-33-2025-40214bd1d82e?source=post_page---post_publication_info--841a4bf35216---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/@polkaswap?source=post_page---post_author_info--841a4bf35216---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/@polkaswap?source=post_page---post_author_info--841a4bf35216---------------------------------------)

[

Written by Polkaswap
--------------------

](/@polkaswap?source=post_page---post_author_info--841a4bf35216---------------------------------------)

[3.6K followers](/@polkaswap/followers?source=post_page---post_author_info--841a4bf35216---------------------------------------)

·[7 following](/@polkaswap/following?source=post_page---post_author_info--841a4bf35216---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

Responses (2)
-------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--841a4bf35216---------------------------------------)

See all responses

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----841a4bf35216---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----841a4bf35216---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----841a4bf35216---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----841a4bf35216---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----841a4bf35216---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----841a4bf35216---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----841a4bf35216---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----841a4bf35216---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----841a4bf35216---------------------------------------)
