---
title: SORA v2 HASHI Ethereum Bridge Activation Referendum
source: update
source_url: >-
  https://medium.com/sora-xor/sora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a
doc_id: e4b424f6fe0e4e7e
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T15:43:47.509Z'
lang: en
license: SORA Official / Medium
checksum_sha256: e094495752fe434abe8962ad9587151141fa4f108fb28f9785c3457717ca7b92
content_hash: e094495752fe434abe8962ad9587151141fa4f108fb28f9785c3457717ca7b92
image_rights: SORA Official / Medium
publishDate: '2025-11-02T15:43:47.364Z'
---
SORA v2 HASHI Ethereum Bridge Activation Referendum | by SORA | SORA | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2Fa6d19993652a&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SORA

--------

](https://medium.com/sora-xor?source=post_page---publication_nav-4476c249dd22-a6d19993652a---------------------------------------)

·

[

![SORA](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/sora-xor?source=post_page---post_publication_sidebar-4476c249dd22-a6d19993652a---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

SORA v2 HASHI Ethereum Bridge Activation Referendum
===================================================

[

![SORA](./images/be3254c2c7d7cd92d0a16e9801a0d41459927feb410386d18ed86145d944ba9f.png)

](/@sora-xor?source=post_page---byline--a6d19993652a---------------------------------------)

[SORA](/@sora-xor?source=post_page---byline--a6d19993652a---------------------------------------)

5 min read

·

Mar 5, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa6d19993652a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a&user=SORA&userId=1a19bb1bbd4a&source=---header_actions--a6d19993652a---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fa6d19993652a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a&source=---header_actions--a6d19993652a---------------------bookmark_footer------------------)

Listen

Share

TL;DR
-----

* [SORA](https://sora.org/) is a community driven project. As such, all technology upgrades have to be voted on by the community to be released.
* We release all source code in disabled form and cryptographic proof of voting is needed to enable it.
* From March 11 to March 15 2021, there will be a referendum to enable the HASHI bridge between the SORA v2 Substrate-based network and Ethereum.
* The HASHI bridge will allow tokens to be moved between the SORA v2 and Ethereum networks, which will extend the usefulness of applications built on top of the SORA network, like [Polkaswap](https://polkaswap.io/).

Press enter or click to view image in full size

I got my HASHI Pipe・橋
---------------------

The SORA network will be a host to powerful DeFi projects such as the SORA decentralized world economic system and Polkaswap, a DEX designed for the interoperable future. As part of our vision, we believe that **blockchain maximalism is dead** and we see the need for safe, fast, and efficient migration of assets between blockchains. As a first step, for the initial **beta launch** of the SORA network, slated for Q1 2021, we have prepared source code for _HASHI_: a decentralized and trustless 2-way peg bridge between the SORA v2 and Ethereum networks. [HASHI](https://en.wiktionary.org/wiki/%E6%A9%8B#Japanese) means bridge in Japanese, and it will be the plumbing that links between many different chains, like pipes connecting the world's assets.

Press enter or click to view image in full size

The SORA v2 Network with HASHI

HASHI works in a very simple manner:

* To move assets from Ethereum to the SORA v2 network, users send their ETH or supported ERC-20 tokens to a bridge contract on Ethereum; then, the user submits proof of the ETH transaction to the SORA network via an [extrinsics](https://substrate.dev/docs/en/knowledgebase/learn-substrate/extrinsics) call.

Press enter or click to view image in full size

* To move assets from the SORA v2 network to Ethereum, a user just needs to send their assets to a designated account on the SORA network, then once [_grandpa_](https://substrate.dev/docs/en/knowledgebase/advanced/consensus) finality is complete, the cryptographic proof of the transaction is submitted to the Ethereum smart contract.

Press enter or click to view image in full size

The HASHI bridge is already available on the Polkaswap testnet, so [go try it out](/polkaswap/sora-testnet-with-hashi-eec54eb057e1)!

Source code for the SORA v2 Ethereum bridge is [all open sourced under the Apache 2 license](https://github.com/sora-xor/sora2-evm-contracts).

Because any bridge is quite complex technically, teams building on the SORA network may want guarantees that there will not be financial loss resulting from technical difficulties with the bridge. While this will be explained more in a future article, the SORA Parliament will provide insurance for infrastructure that is deemed systemically important to the ecosystem. Systemically Important Infrastructure (SII) will need to concede governance to the SORA Parliament, but in exchange the Parliament will promise to socialize any losses, in order to give network participants confidence in using the SORA network. Details will be laid out in a future article.

Ratifying the HASHI Bridge Activation
-------------------------------------

Starting on **March 11 and continuing until March 15, 2021 23:59 UTC**, the community will be asked to vote on activating the HASHI bridge between the SORA v2 network running on Substrate and Ethereum, using the [SORA mobile app](https://sora.org/#rec229853503).

Press enter or click to view image in full size

An example of how voting will look for the referendum [in the app](https://sora.org/#rec229853503).

If the referendum does not pass, then that indicates a rejection of the planned link between the Ethereum network and the SORA v2 network. This means that for the foreseeable future, the SORA and Ethereum networks would be disjoint and tokens would not be allowed to freely flow between the two networks.

For the sake of clarity, here is a list of anticipated pros and cons for the referendum passing and failing.

If the referendum passes:
-------------------------

**Pros:**

* The SORA network will utilize state-of-the-art bridge technology to create a link to the Ethereum network, making it one of the most advanced blockchain networks in existence
* Supported tokens created on the Ethereum network that follow the ERC-20 format can be moved to the SORA v2 network
* Tokens created on the SORA network will be able to be moved to the Ethereum network as ERC-20 tokens

**Cons:**

* System is complex and the software should be maintained over time, with the support of the SORA Parliament

If the referendum fails:
------------------------

**Pros:**

* XOR and VAL tokens on Ethereum will not be linked to the SORA network, so will become economically unlinked, which would reduce effective XOR and VAL token supply

**Cons:**

* There will be no link directly to Ethereum, which will limit the accessibility of the SORA network
* There will be no way to move existing XOR and VAL tokens from Ethereum to the SORA network

Referendum Text
---------------

We, the SORA community, are united in thought and mind to collaborate together to establish the HASHI decentralized bridge between the SORA v2 and Ethereum networks. The following articles represent the key points in ratifying the HASHI bridge, and by voting YES on this referendum, we together as a community officially accept the realization of the contents of the following articles. However, we as a community may also reject the articles by voting NO on this referendum.

**May the will of the majority come to pass.**

Referendum Articles
-------------------

**Article 1.** The SORA HASHI bridge shall be enabled for Ethereum so that ETH and major ERC-20 tokens can be moved to the SORA network. Additionally, tokens on the SORA network shall be enabled to move across the bridge to the Ethereum network as ERC-20 tokens.

**Article 2.** All executable deliverables (software, smart contracts, etc.) shall be released in a disabled form and enabled using cryptographic proof of the result of this community vote.

**Article 3.** The community recognizes that the software for the HASHI bridge is being provided without any warranty or implied usefulness for any purpose and that SORAMITSU and every other entity and individual that may have contributed to the source code and technology will not have any responsibility for losses caused by malfunctions or hacking of the bridge, neither will the contributors have any responsibility for any actions whatsoever that users of the HASHI bridge do of their own volition.

**Article 4.** The community recognizes that the HASHI bridge is a systemically important infrastructure (SII) for the SORA ecosystem and as such the SORA Parliament will cover losses to individuals and other entities that result from faults in the technology used in HASHI, in accordance with the policies for SII Social Insurance, which will be proposed and refined later.

[

Blockchain

](/tag/blockchain?source=post_page-----a6d19993652a---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----a6d19993652a---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----a6d19993652a---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----a6d19993652a---------------------------------------)

[

Ethereum

](/tag/ethereum?source=post_page-----a6d19993652a---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa6d19993652a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--a6d19993652a---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa6d19993652a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--a6d19993652a---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fa6d19993652a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fsora-v2-hashi-ethereum-bridge-activation-referendum-a6d19993652a&source=---footer_actions--a6d19993652a---------------------bookmark_footer------------------)

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--a6d19993652a---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--a6d19993652a---------------------------------------)

[

Published in SORA
-----------------

](https://medium.com/sora-xor?source=post_page---post_publication_info--a6d19993652a---------------------------------------)

[1.4K followers](/sora-xor/followers?source=post_page---post_publication_info--a6d19993652a---------------------------------------)

·[Last published Jul 11, 2025](/sora-xor/sora-ecosystem-updates-88-june-33-2025-01ffc03a468b?source=post_page---post_publication_info--a6d19993652a---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](/@sora-xor?source=post_page---post_author_info--a6d19993652a---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](/@sora-xor?source=post_page---post_author_info--a6d19993652a---------------------------------------)

[

Written by SORA
---------------

](/@sora-xor?source=post_page---post_author_info--a6d19993652a---------------------------------------)

[2.3K followers](/@sora-xor/followers?source=post_page---post_author_info--a6d19993652a---------------------------------------)

·[26 following](/@sora-xor/following?source=post_page---post_author_info--a6d19993652a---------------------------------------)

SORA is working to become a decentralized world economic system, under the democratic supervision of the SORA Parliament. Many Worlds. One Economy. SORA.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--a6d19993652a---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----a6d19993652a---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----a6d19993652a---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----a6d19993652a---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----a6d19993652a---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----a6d19993652a---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----a6d19993652a---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----a6d19993652a---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----a6d19993652a---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----a6d19993652a---------------------------------------)
