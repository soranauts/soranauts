---
title: SORA v2 Implementation
source: update
source_url: 'https://medium.com/sora-xor/sora-v2-implementation-1febd3260b87'
doc_id: 3a781e58218e7299
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T15:43:27.548Z'
lang: en
license: SORA Official / Medium
checksum_sha256: 7aa61c33432cb60926b479b273232981ed3fa3f5ab7d5c46cb940ddb5620f03c
content_hash: 7aa61c33432cb60926b479b273232981ed3fa3f5ab7d5c46cb940ddb5620f03c
image_rights: SORA Official / Medium
publishDate: '2025-11-02T15:43:27.326Z'
---
SORA v2 Implementation. TL;DR | by SORA | SORA | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2F1febd3260b87&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-implementation-1febd3260b87&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-implementation-1febd3260b87&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SORA

--------

](https://medium.com/sora-xor?source=post_page---publication_nav-4476c249dd22-1febd3260b87---------------------------------------)

·

[

![SORA](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/sora-xor?source=post_page---post_publication_sidebar-4476c249dd22-1febd3260b87---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

SORA v2 Implementation
======================

[

![SORA](./images/be3254c2c7d7cd92d0a16e9801a0d41459927feb410386d18ed86145d944ba9f.png)

](/@sora-xor?source=post_page---byline--1febd3260b87---------------------------------------)

[SORA](/@sora-xor?source=post_page---byline--1febd3260b87---------------------------------------)

4 min read

·

Oct 2, 2020

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2F1febd3260b87&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-implementation-1febd3260b87&user=SORA&userId=1a19bb1bbd4a&source=---header_actions--1febd3260b87---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F1febd3260b87&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-implementation-1febd3260b87&source=---header_actions--1febd3260b87---------------------bookmark_footer------------------)

Listen

Share

TL;DR
-----

* By the end of November, v1 XOR on the SORA v1 mainnet will be converted to VAL
* The conversion factor between v1 XOR and VAL is `0.0628651118561449`
* Around the launch of the SORA v2 mainnet, there will be a snapshot of ERC-20 XOR holdings and ERC-20 holders who have control over their private keys will be able to claim VAL on the SORA v2 network. **You will never be asked to provide your private key or passphrase to anyone to claim VAL.** Never give it away! Always check information in SORA channels!
* `94.57142857142857` VAL will be airdropped per XOR to ERC-20 XOR holders, with 10 VAL airdropped at SORA v2 network launch and the remainder distributed as a portion of the daily burned amount of VAL
* We expect the SORA v2 mainnet to launch between January 2021 — April 2021

Press enter or click to view image in full size

Akiko Soramoto

Background
----------

As part of outlining the vision for [SORA](https://sora.org) v2, we published [an article explaining the conversion of XOR from a free-floating token, to one backed by a multi-collateral reserve pool](/@sora.xor/sora-the-new-economic-order-3ec3f0327e5a#a4ab-dd6001957e09), as well as [an article explaining a new validator-incentive token called VAL](/@sora.xor/sora-validator-rewards-419320e22df8), that is a reward for those who secure the SORA v2 network.

In September 2020, a [referendum](/@sora.xor/sora-new-economic-order-tokenomics-referendum-31581e8b649) was held where the community voted on accepting the SORA v2 tokenomics proposals.

The Will of the People
----------------------

The SORA v2 tokenomics referendum passed by a **large and uncontroversial majority**, with 1,674,000 votes for YES and only 70,354 votes for NO. Thus clearly there is broad and popular support of the community for the v2 tokenomics.

This is unsurprising, as the tokenomics proposal was created in consultation over many months with community members and creates quite a lot of value for those who have ERC-20 XOR (as the supply was reduced from 1.6 billion to 350,000 until v2 launch) and for v1 XOR holders, as they will get a new token called VAL that has a deflationary token supply. ERC-20 XOR holders also will receive approximately 1/3 of the VAL token supply, so the initial diversity of VAL holders will be very high, with thousands of token holders. This is great for bootstrapping the SORA v2 ecosystem.

Press enter or click to view image in full size

Initial VAL Token Distribution (100 million VAL total)

Milestones in Implementing SORA V2 Tokenomics
---------------------------------------------

To implement the SORA v2 tokenomics will take significant development resources. Also, we will release our code in a disabled state and it will need to be enabled using the cryptographic proof of the voting on the referendum performed by the community. So there are many steps that should be performed over the coming months to realize the SORA v2 ecosystem.

By end of November 2020:
------------------------

* Cryptographic proof of the referendum voting result will be released publicly; this proof will be used to enable the conversion of v1 XOR to VAL on the SORA v1 mainnet and for enabling the bridge to Ethereum
* The quantity of v1 XOR will be reduced from the current amount of `1,617,749,447.94056` to `539,249,815.980187`; this will be done in such a way that regular holders will not be diluted from their proportional holdings when the v1 XOR are converted to VAL, primarily by burning v1 XOR held by some large v1 holders
* The v1 XOR will be converted to `33,900,000` VAL, by multiplying each account balance by `0.0628651118561449`
* The VAL ERC-20 bridge contract will be deployed to Ethereum, but in a disabled state. To enable it, one member of the community should provide the cryptographic proof of the referendum result to the contract. In exchange a small reward of VAL will be distributed to the first user that enables the smart contract (to cover gas fees). Once enabled, the contract cannot be disabled.

Between January 2021 and April 2021:
------------------------------------

* VAL tokens start to be vested for ERC-20 XOR holders; ERC-20 XOR holders will have to claim on the SORA v2 mainnet
* 2-way Bridge to Ethereum to move tokens between SORA v2 and the Ethereum networks

After April 2021:
-----------------

* [Polkaswap](https://polkaswap.io/) launch
* Provisional VAL DAOs that just provide liquidity to default pairs like XOR-DOT and XOR-KSM will be set up
* SORA Parliament setup (pending upcoming constitutional referendum, tbd)
* [VAL DAOs](/@sora.xor/sora-validator-rewards-419320e22df8) with voting for liquidity provision

VAL Token Claim for ERC-20 XOR Holders
--------------------------------------

As approved in the referendum, 33,100,000 VAL shall be distributed to ERC-20 XOR holders. While initially the rules for this were not clear and we discussed proposing that some complicated actions be performed by ERC-20 XOR holders, the current proposal is that there will be a snapshot taken and all VAL will simply be airdropped (claimable) over time, without any other conditions.

This means that`94.57142857142857` VAL will be given per each XOR in the following way:

* 10 VAL distributed per each XOR at the launch of the SORA v2 mainnet
* VAL vested per day to each XOR, as a remainder portion of the VAL that are burned everyday (burned amount -10% -daily validator reward %).

No other conditions shall be placed upon ERC-20 XOR holders to receive their VAL. They will just need to have control over their private key on Ethereum at the time of the snapshot, so they can sign a message on the SORA v2 mainnet to claim their VAL. **You will never be asked to provide your private key or passphrase to anyone to claim VAL.** Never give it away! Always check information in SORA announcement channels!

[

Polkadot

](/tag/polkadot?source=post_page-----1febd3260b87---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----1febd3260b87---------------------------------------)

[

Blockchain

](/tag/blockchain?source=post_page-----1febd3260b87---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----1febd3260b87---------------------------------------)

[

Dex

](/tag/dex?source=post_page-----1febd3260b87---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2F1febd3260b87&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-implementation-1febd3260b87&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--1febd3260b87---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2F1febd3260b87&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-implementation-1febd3260b87&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--1febd3260b87---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F1febd3260b87&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-implementation-1febd3260b87&source=---footer_actions--1febd3260b87---------------------bookmark_footer------------------)

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--1febd3260b87---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--1febd3260b87---------------------------------------)

[

Published in SORA
-----------------

](https://medium.com/sora-xor?source=post_page---post_publication_info--1febd3260b87---------------------------------------)

[1.4K followers](/sora-xor/followers?source=post_page---post_publication_info--1febd3260b87---------------------------------------)

·[Last published Jul 11, 2025](/sora-xor/sora-ecosystem-updates-88-june-33-2025-01ffc03a468b?source=post_page---post_publication_info--1febd3260b87---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](/@sora-xor?source=post_page---post_author_info--1febd3260b87---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](/@sora-xor?source=post_page---post_author_info--1febd3260b87---------------------------------------)

[

Written by SORA
---------------

](/@sora-xor?source=post_page---post_author_info--1febd3260b87---------------------------------------)

[2.3K followers](/@sora-xor/followers?source=post_page---post_author_info--1febd3260b87---------------------------------------)

·[26 following](/@sora-xor/following?source=post_page---post_author_info--1febd3260b87---------------------------------------)

SORA is working to become a decentralized world economic system, under the democratic supervision of the SORA Parliament. Many Worlds. One Economy. SORA.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--1febd3260b87---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----1febd3260b87---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----1febd3260b87---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----1febd3260b87---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----1febd3260b87---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----1febd3260b87---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----1febd3260b87---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----1febd3260b87---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----1febd3260b87---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----1febd3260b87---------------------------------------)
