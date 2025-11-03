---
title: Introducing XSTUSD — A Stablecoin on SORA for the Polkadot Ecosystem
source: update
source_url: >-
  https://medium.com/sora-xor/introducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e
doc_id: 500b206dfe80bf29
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T15:17:15.243Z'
lang: en
license: SORA Official / Medium
checksum_sha256: cb87a4b052d267db17261f61a9050d0afc7c08797d8ff594f658529b496c6bde
content_hash: cb87a4b052d267db17261f61a9050d0afc7c08797d8ff594f658529b496c6bde
image_rights: SORA Official / Medium
publishDate: '2025-11-02T15:17:15.139Z'
---
Introducing XSTUSD — A Stablecoin on SORA for the Polkadot Ecosystem | by SORA | SORA | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2Fa3861c13643e&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fintroducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fintroducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SORA

--------

](https://medium.com/sora-xor?source=post_page---publication_nav-4476c249dd22-a3861c13643e---------------------------------------)

·

[

![SORA](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/sora-xor?source=post_page---post_publication_sidebar-4476c249dd22-a3861c13643e---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

Introducing XSTUSD — A Stablecoin on SORA for the Polkadot Ecosystem
====================================================================

XST Synthetic assets on the SORA network recently received their own [XST token platform](/sora-xor/xst-a-platform-for-synthetic-assets-on-sora-b45ca526d8d5)
-------------------------------------------------------------------------------------------------------------------------------------------------------------

[

![SORA](./images/be3254c2c7d7cd92d0a16e9801a0d41459927feb410386d18ed86145d944ba9f.png)

](/@sora-xor?source=post_page---byline--a3861c13643e---------------------------------------)

[SORA](/@sora-xor?source=post_page---byline--a3861c13643e---------------------------------------)

7 min read

·

Oct 18, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa3861c13643e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fintroducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e&user=SORA&userId=1a19bb1bbd4a&source=---header_actions--a3861c13643e---------------------clap_footer------------------)

\--

1

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fa3861c13643e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fintroducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e&source=---header_actions--a3861c13643e---------------------bookmark_footer------------------)

Listen

Share

### TL;DR

* SORA Synthetics are tokens pegged to value indices, backed by the [XST platform token](/sora-xor/xst-a-platform-for-synthetic-assets-on-sora-b45ca526d8d5)
* The first SORA Synthetic Asset is the DAI-pegged XSTUSD
* SORA Synthetic XST assets for other major stores of value will be available in the future, once oracles are integrated into the SORA network
* XSTUSD was [proposed as an RFP](https://github.com/sora-xor/rfps/blob/master/closed_rfps/XSTUSD.md) and is currently live

Press enter or click to view image in full size

XSTUSD — A Stablecoin on SORA for the Polkadot Ecosystem

What is XST?
------------

Fisher’s Compensated Dollar
---------------------------

**XOR SynThetics**, hereafter, **XST**, are synthetic assets pegged to an index of value and backed by the [XST platform token](/sora-xor/xst-a-platform-for-synthetic-assets-on-sora-b45ca526d8d5), but, _what is a synthetic asset or stablecoin to begin with?_

Long before cryptocurrencies (or even digital computers) existed, [back in 1912](https://dspace.gipe.ac.in/xmlui/bitstream/handle/10973/26798/GIPE-093010.pdf?sequence=3&isAllowed=y), the American economist [Irving Fisher](https://en.wikipedia.org/wiki/Irving_Fisher) questioned the instability in the purchasing power of the gold-backed US dollar, explaining:

> _“_We now have a dollar of fixed weight (25.8 grains), but varying purchasing power. Under the plan proposed, we should have a dollar of fixed purchasing power, but varying weight_.” This would come to be the groundwork for the “compensated” dollar._

In other words, because gold was highly volatile in purchasing power, instead of keeping the dollar fixed to a certain amount of gold, [Fisher proposed](https://www.richmondfed.org/~/media/richmondfedorg/publications/research/economic_quarterly/1993/summer/pdf/patinkin.pdf) that the dollar be backed by varying amounts of gold, but pegged to a basket of goods (an index). However, at the time, Fisher’s ideas were not adopted due to operational and harmonization issues of the economy of that period.

With the advent of cryptoeconomic systems on blockchains, the “compensated” dollar principles, Fisher’s groundwork, could finally be translated into the realm of cryptoeconomics and given new life as part of a cryptoeconomic system: “a blockchain-based token can be created as a derivative of another one, targeted at holding a stable unit of value”. SORA synthetics implements this concept and _in a way, you could say that Irving Fisher is the father of SORA Synthetics_.

Stablecoins and Synthetic Assets Today
--------------------------------------

Currently, there are 5 different types of stablecoins/pegged assets:

* **Fiat-Backed Stablecoins (or Tokenized Fiat):** These stablecoins are backed by and pegged to dollars (or other fiat currency), and their value remains tied to the price of the pegged currency. For example, [USDC](https://www.circle.com/en/usdc).
* **Crypto-Backed Stablecoins (or On-Chain Collateralized Stablecoins):** These are backed by other crypto assets. For example [DAI](https://makerdao.com/en/).
* **Precious Metal-Backed Stablecoins (or Off-Chain Collateralized Stablecoins):** Like gold-standard fiat, these stablecoins use gold and other metals to back their value. For example [Tether Gold](https://gold.tether.to/).
* **Algorithmic Stablecoins:** These stablecoins use algorithms to back their value, there are some variants that can be pegged to fiat values, depending on the algorithm used. For example [AMPL](https://www.ampleforth.org/).
* **Synthetic assets** are tokens with value pegged to an oraclized asset. Purely synthetic assets can be used to represent many types of value, such as, to track the shares of financial instruments and securities. For example, [SYNTHETIX](https://synthetix.io/).

XST is an algorithmic stablecoin for the SORA ecosystem, initially proposed in 2018, based on the ideas of Irving Fisher’s compensated dollar. However, instead of being backed by gold, XST synthetic assets are backed by the XST token.

Press enter or click to view image in full size

XST: A Platform for Synthetic Assets on SORA

What Makes SORA XST Different?
------------------------------

Now that stablecoins and synthetic assets have been defined and classified, you might be wondering what makes XST stand out from the rest?

XST helps to solve the problem of XOR liquidity by creating synthetic assets backed by a variable amount of the XST token and pegged to a target index (e.g., a currency). The XST token is minted/deminted to always guarantee the value of the pegged index. The first index implemented is linked to the value of DAI and will be called XSTUSD.

Non-Collateralized Stability
----------------------------

In the case of XST assets, as they are backed by the XST token platform, XST can be algorithmically minted or deminted (burned) to provide the full value for the XST assets upon demand. The XST Primary Market Maker that mints/demints XST assets and the XST platform token are built-in as a liquidity source into Polkaswap’s liquidity aggregator, so buyers/sellers will always get the full value in XST platform tokens for their XST assets, and the price will never deviate (lower or higher) from the asset price. Therefore, XST assets are not subject to price slippage or a lack of liquidity. This works, for example, in the case of XSTUSD, because a single XSTUSD is a claim for $1 USD _worth of XST_, and **not a claim for the actual $USD itself**.

With normal stablecoins (_specifically fiat-backed_), the adjustment of collateral value and the value of the issued stablecoins is not automatic. This is due to price changes in the collaterals, and it is, therefore, necessary to overcollateralize. With stable tokens like DAI, for example, you have to lock up 130% of the value in ETH to mint new DAI, and your vault gets liquidated if you go under the required collateral level.

XST does not require over-collateralization and users of XST assets do not risk liquidation. This is because new XST can always be minted to provide the full value of an XST asset upon exchange back into the XST platform token.

Normally, algorithmic stablecoins derive their value from smart contracts linked to oracles that determine current prices, however, XSTUSD’s value is currently derived from the price of XST-DAI, although (_Spoiler aler_t) there will be an implementation where the community can mint XST-based assets backed by other currencies, _more about that in a future article_.

How Will This Be Implemented?
-----------------------------

XST implementation is quite an exciting topic, however, it isn’t complete yet. The RFP proposing the implementation of XSTUSD was published and now it is live on the SORA network. The implementation scenario includes whitelisting XSTUSD on Polkaswap and subsequently setting up a liquidity source, as mentioned before, where the price users pay would never deviate from the price of XST-DAI.

Press enter or click to view image in full size

Some more interesting details available from the [XSTUSD RFP](https://github.com/sora-xor/rfps/blob/master/closed_rfps/XSTUSD.md) mention: “If the XSTUSD-XST price goes lower than DAI-XST, then when the user is buying, new XST will be minted and used to fill the order (similar to the token bonding curve). When buying XSTUSD with XST, then new XSTUSD can be minted/deminted when filling the orders, in order to maintain the peg.” Before you ask wen, there is no concrete answer _…for now._

XST implementation is just the beginning and, as was hinted earlier, _SORAcles_ are also in the development pipeline which will ensure that a variety of XST assets can be implemented for many different indices of value. Another interesting implementation tied to this is the [SORA Social Insurance](https://sora-xor.medium.com/social-insurance-for-systematically-important-infrastructure-18a63ef711ca).

In the meantime, you can find XSTUSD & XST on [Polkaswap.io](https://polkaswap.io). The XSTUSD asset ID is `0x0200080000000000000000000000000000000000000000000000000000000000` and the XST asset ID is `0x0200090000000000000000000000000000000000000000000000000000000000`

You can swap XST to XSTUSD and vice-versa. After getting some XST, you can swap it for XSTUSD in the swap section by selecting it as the TO value.

Press enter or click to view image in full size

After you click on SWAP, you will receive a confirmation message with the transaction details. Click CONFIRM and sign the transaction with the Polkadot.js browser extension in the popup window.

Press enter or click to view image in full size

Finally, if you’re interested in how the SORA RFP system works, take a look at this complete guide on [Proposing New Functionalities to Polkaswap and the SORA Network](/sora-xor/how-to-rfp-proposing-new-functionalities-to-polkaswap-and-the-sora-network-4af099b15f75)

**Sources**:

Kołodziejczyk, H., & Jarno, K. (2020). Stablecoin — the stable cryptocurrency. Studia BAS, 3(63), 155–170. [https://doi.org/10.31268/StudiaBAS.2020.26](https://doi.org/10.31268/StudiaBAS.2020.26)

J. M. Keynes, Irving Fisher, Harry G. Brown. The Purchasing Power of Money: Its Determination and Relation to Credit, Interest, and Crisis, The Economic Journal, Volume 21, Issue 83, 1 September 1911, Pages 393–398, [https://doi.org/10.2307/2222328](https://doi.org/10.2307/2222328)

Patinkin, D. (n.d.). Irving Fisher and His Compensated Dollar Plan. 34.

Takemiya, M. (2019). Sora: A Decentralized Autonomous Economy. 2019 IEEE International Conference on Blockchain and Cryptocurrency (ICBC). doi:10.1109/BLOC.2019.8751489

About SORA, Polkaswap, and Fearless Wallet
------------------------------------------

[**SORA**](/@sora.xor/sora-the-new-economic-order-3ec3f0327e5a) is a new economic system aimed at creating a supranational multiverse economic system with built-in tools for decentralized finance (DeFi). The [SORA](https://sora.org/) network implements a new way of parachain architecture on [Polkadot](https://polkadot.network/) and [Kusama](https://kusama.network/) network, with the capability to [bridge](https://wiki.polkadot.network/docs/en/learn-bridges) external blockchains (like Ethereum) to the Polkadot ecosystem.

One of the DeFi applications that will run on the SORA network is [**Polkaswap**](https://polkaswap.io/), a noncustodial liquidity aggregating, cross-chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through its one-of-a-kind Aggregate Liquidity Technology (ALT).

[**Fearless Wallet**](https://fearlesswallet.io/) is a bespoke mobile wallet designed for the decentralized future on the Polkadot and Kusama ecosystem, with native support for [iOS](https://apps.apple.com/us/app/fearless-wallet/id1537251089) and [Android](https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless) platforms. A premium user experience, fast performance, and secure storage for your accounts. Fearless Wallet will integrate [Polkaswap](https://polkaswap.io/) for easy, decentralized swaps of assets.

### Connect With Us

### [SORA](https://sora.org/) 𒀭 community:

[Twitter](https://twitter.com/sora_xor) | [Telegram](https://t.me/sora_xor) | [Reddit](https://www.reddit.com/r/SORA/) | [YouTube](https://www.youtube.com/channel/UCb2i3VaGrggBhfo2ytg8xCA) | [Announcements Channel](https://t.me/sora_announcements)

### [Polkaswap](https://polkaswap.io/) 𒊹𒂵𒆜 community:

[Twitter](https://twitter.com/polkaswap) | [Telegram](https://t.me/polkaswap) | [Reddit](https://www.reddit.com/r/Polkaswap/) | [YouTube](https://www.youtube.com/channel/UC6piTNmXCIfql72tNu183FA) | [Announcements Channel](https://t.me/polkaswap_announcements)

### [Fearless Wallet](https://fearlesswallet.io/) 𒉡𒉎𒋼 community:

[Twitter](https://twitter.com/FearlessWallet) | [Telegram](https://t.me/fearlesswallet) | [Element](https://matrix.to/#/#fearlesswallet:matrix.org) | [YouTube](https://www.youtube.com/channel/UCE9Jjr6kFQgt8IJmv0rCIFQ) | [Android App](https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless) | [iOS App](https://apps.apple.com/us/app/fearless-wallet/id1537251089)

[

Defi

](/tag/defi?source=post_page-----a3861c13643e---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----a3861c13643e---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----a3861c13643e---------------------------------------)

[

Blockchain

](/tag/blockchain?source=post_page-----a3861c13643e---------------------------------------)

[

Stable Coin

](/tag/stable-coin?source=post_page-----a3861c13643e---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa3861c13643e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fintroducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--a3861c13643e---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa3861c13643e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fintroducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--a3861c13643e---------------------clap_footer------------------)

\--

1

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fa3861c13643e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fintroducing-xstusd-a-stablecoin-on-sora-for-polkadot-ecosystem-public-testing-a3861c13643e&source=---footer_actions--a3861c13643e---------------------bookmark_footer------------------)

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--a3861c13643e---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--a3861c13643e---------------------------------------)

[

Published in SORA
-----------------

](https://medium.com/sora-xor?source=post_page---post_publication_info--a3861c13643e---------------------------------------)

[1.4K followers](/sora-xor/followers?source=post_page---post_publication_info--a3861c13643e---------------------------------------)

·[Last published Jul 11, 2025](/sora-xor/sora-ecosystem-updates-88-june-33-2025-01ffc03a468b?source=post_page---post_publication_info--a3861c13643e---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](/@sora-xor?source=post_page---post_author_info--a3861c13643e---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](/@sora-xor?source=post_page---post_author_info--a3861c13643e---------------------------------------)

[

Written by SORA
---------------

](/@sora-xor?source=post_page---post_author_info--a3861c13643e---------------------------------------)

[2.3K followers](/@sora-xor/followers?source=post_page---post_author_info--a3861c13643e---------------------------------------)

·[26 following](/@sora-xor/following?source=post_page---post_author_info--a3861c13643e---------------------------------------)

SORA is working to become a decentralized world economic system, under the democratic supervision of the SORA Parliament. Many Worlds. One Economy. SORA.

Responses (1)
-------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--a3861c13643e---------------------------------------)

See all responses

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----a3861c13643e---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----a3861c13643e---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----a3861c13643e---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----a3861c13643e---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----a3861c13643e---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----a3861c13643e---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----a3861c13643e---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----a3861c13643e---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----a3861c13643e---------------------------------------)
