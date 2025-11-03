---
title: SORA Network Parachain for Polkaswap Intro
source: polkaswap_update
source_url: >-
  https://medium.com/polkaswap/sora-network-parachain-for-polkaswap-intro-859558753f48
doc_id: 27fe369481064ce2
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:06:04.174Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: 474af49c6c02483f678b4bfa18b7bfe0c21b24aa17dd9cb0be9d70fae2c5d5ca
content_hash: 474af49c6c02483f678b4bfa18b7bfe0c21b24aa17dd9cb0be9d70fae2c5d5ca
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:06:03.820Z'
---
SORA Network Parachain for Polkaswap Intro | by Polkaswap | Polkaswap | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F859558753f48&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-network-parachain-for-polkaswap-intro-859558753f48&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-network-parachain-for-polkaswap-intro-859558753f48&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

Polkaswap

-------------

](https://medium.com/polkaswap?source=post_page---publication_nav-7dd150c29856-859558753f48---------------------------------------)

·

[

![Polkaswap](./images/cf82f8d65570f4817d617e2117ee39a73d7a6500e311d37c8e16e183b5c2cfb0.png)

](https://medium.com/polkaswap?source=post_page---post_publication_sidebar-7dd150c29856-859558753f48---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

SORA Network Parachain for Polkaswap Intro
==========================================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/@polkaswap?source=post_page---byline--859558753f48---------------------------------------)

[Polkaswap](/@polkaswap?source=post_page---byline--859558753f48---------------------------------------)

3 min read

·

Sep 28, 2020

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F859558753f48&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-network-parachain-for-polkaswap-intro-859558753f48&user=Polkaswap&userId=246f0843d222&source=---header_actions--859558753f48---------------------clap_footer------------------)

\--

1

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F859558753f48&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-network-parachain-for-polkaswap-intro-859558753f48&source=---header_actions--859558753f48---------------------bookmark_footer------------------)

Listen

Share

TL;DR
-----

* The [SORA](https://sora.org) Network, which is the network that Polkaswap is being built on, plans to obtain parachain slots for Kusama and Polkadot
* The SORA Network will join the parachain auctions using the reserves of the SORA Token Bonding Curve
* More details about the process and the rewards have been published [here](/polkaswap/pswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8)

Background
----------

[Polkaswap](https://polkaswap.io) is a DEX designed around the interoperable DeFi future, so it has always been a part of the plan to bring together as many assets from as many chains as possible. Polkadot will greatly simplify this by providing a Host relay chain, a cross-chain message passing protocol ([XCMP](https://wiki.polkadot.network/docs/en/learn-crosschain)), and shared protected runtime execution enclaves ([SPREE](https://wiki.polkadot.network/docs/en/learn-spree)). However, to fully take advantage of these technologies, it will be needed to connect to the relay chain as a [_parachain_](https://wiki.polkadot.network/docs/en/learn-parachains).

Parachains can be thought of as prime pieces of real estate where independent economies can operate, complete with their own native tokens if desired. These specialized chains run parallel to, and are fully interoperable with, the rest of the Polkadot network via the secure passing of messages with the relay chain. Thus, it is important to secure a parachain slot for any player who wants to execute custom computations, store their own data, and/or operate their own economy within the Polkadot ecosystem, without resorting to paying hefty fees.

Kusama is a faster-evolving network than Polkadot, and as such it will have parachain slot auctions first. After that, Polkadot will have auctions, perhaps at a much later time. Despite their similarities, Kusama and Polkadot are distinct networks and having a parachain slot on one network does not grant you the same access on the other.

Press enter or click to view image in full size

The SORA Network parachain and Polkaswap.

Obtaining a Parachain Slot
--------------------------

To obtain our parachain slot, the SORA Network must participate in the [parachain slots auction](https://wiki.polkadot.network/docs/en/learn-auction). The important thing to note about these auctions is that they require us to make our bids by bonding KSM (for the Kusama parachain) and DOT (for the Polkadot parachain), with each winning bid securing the parachain slot for up to two years. After the two-year lease is up, **projects who bonded their KSM or DOT will get them back**.

The dates for these auctions have not been announced, but we anticipate them to be extremely competitive given the limited number of parachains scheduled to be made available. **This means that most network operators who wish to secure a parachain slot will need to engage and incentivize their communities for support to have a chance at outbidding the competition.**

While the exact number of KSM or DOT that are needed to win a parachain slot is not yet known with any confidence, without your support, obtaining a parachain slot for Kusama and for Polkadot will be incredibly difficult. As such, we’ve made sure that the importance of the role you play in obtaining parachain slots is reflected in the generous incentives we’re making available.

**To understand more about the SORA Token Bonding Curve, how you can help the SORA Network securing a parachain slot and the allocated rewards, please see** [**here**](/polkaswap/pswap-rewards-part-2-the-sora-token-bonding-curve-70fab4c3f1b8)**.**

Press enter or click to view image in full size

SORA waifu Tsukiko Soramoto

[

Blockchain

](/tag/blockchain?source=post_page-----859558753f48---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----859558753f48---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----859558753f48---------------------------------------)

[

Kusama

](/tag/kusama?source=post_page-----859558753f48---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F859558753f48&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-network-parachain-for-polkaswap-intro-859558753f48&user=Polkaswap&userId=246f0843d222&source=---footer_actions--859558753f48---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2F859558753f48&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-network-parachain-for-polkaswap-intro-859558753f48&user=Polkaswap&userId=246f0843d222&source=---footer_actions--859558753f48---------------------clap_footer------------------)

\--

1

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F859558753f48&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-network-parachain-for-polkaswap-intro-859558753f48&source=---footer_actions--859558753f48---------------------bookmark_footer------------------)

[

![Polkaswap](./images/a2a865cdc58a8abc70d9e706fdd5cb5d57868fc11d220491eb8adec8e809cc84.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--859558753f48---------------------------------------)

[

![Polkaswap](./images/326954642349c766b8441b9782015786a61edcd12b2af6bfc5c3ba7cd067ad83.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--859558753f48---------------------------------------)

[

Published in Polkaswap
----------------------

](https://medium.com/polkaswap?source=post_page---post_publication_info--859558753f48---------------------------------------)

[1.5K followers](/polkaswap/followers?source=post_page---post_publication_info--859558753f48---------------------------------------)

·[Last published Jun 2, 2025](/polkaswap/polkaswap-ecosystem-updates-84-may-33-2025-40214bd1d82e?source=post_page---post_publication_info--859558753f48---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/@polkaswap?source=post_page---post_author_info--859558753f48---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/@polkaswap?source=post_page---post_author_info--859558753f48---------------------------------------)

[

Written by Polkaswap
--------------------

](/@polkaswap?source=post_page---post_author_info--859558753f48---------------------------------------)

[3.6K followers](/@polkaswap/followers?source=post_page---post_author_info--859558753f48---------------------------------------)

·[7 following](/@polkaswap/following?source=post_page---post_author_info--859558753f48---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

Responses (1)
-------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--859558753f48---------------------------------------)

See all responses

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----859558753f48---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----859558753f48---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----859558753f48---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----859558753f48---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----859558753f48---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----859558753f48---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----859558753f48---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----859558753f48---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----859558753f48---------------------------------------)
