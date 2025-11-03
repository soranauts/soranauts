---
title: >-
  Transfers between SORA and Kusama on the HASHI Substrate bridge | Dotapps.io
  Tutorial
source: update
source_url: >-
  https://medium.com/sora-xor/transfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950
doc_id: 3a6df9477e881fdb
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T15:40:20.368Z'
lang: en
license: SORA Official / Medium
checksum_sha256: 9e236b1f7fa7183251e298dc0a7360d96fa914b3de27ebec459c90d2475c45db
content_hash: 9e236b1f7fa7183251e298dc0a7360d96fa914b3de27ebec459c90d2475c45db
image_rights: SORA Official / Medium
publishDate: '2025-11-02T15:40:20.248Z'
---
Transfers between SORA and Kusama on the HASHI Substrate bridge | Dotapps.io Tutorial | by SORA | SORA | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2Ff036c5deb950&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftransfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftransfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SORA

--------

](https://medium.com/sora-xor?source=post_page---publication_nav-4476c249dd22-f036c5deb950---------------------------------------)

·

[

![SORA](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/sora-xor?source=post_page---post_publication_sidebar-4476c249dd22-f036c5deb950---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

Transfers between SORA and Kusama on the HASHI Substrate bridge | Dotapps.io Tutorial
=====================================================================================

[

![SORA](./images/be3254c2c7d7cd92d0a16e9801a0d41459927feb410386d18ed86145d944ba9f.png)

](/@sora-xor?source=post_page---byline--f036c5deb950---------------------------------------)

[SORA](/@sora-xor?source=post_page---byline--f036c5deb950---------------------------------------)

4 min read

·

Oct 30, 2023

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Ff036c5deb950&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftransfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950&user=SORA&userId=1a19bb1bbd4a&source=---header_actions--f036c5deb950---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Ff036c5deb950&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftransfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950&source=---header_actions--f036c5deb950---------------------bookmark_footer------------------)

Listen

Share

A step-by-step guide to seamlessly transfer KSM between the SORA and Kusama networks on Dotapps.io.

Press enter or click to view image in full size

With the HASHI bridge’s Substrate functionality activated, assets can be freely transferred between the Kusama Relay Chain and SORA mainnet. The third phase of the release brings bridge functionality first, and as this is a critical piece of infrastructure, extensive testing is necessary to ensure that everything is watertight and safe before releasing a stylish bridge UI on Polkaswap.io for the community.

With Phase 3, transfers through the Dotapps.io interface are now available between the Kusama and SORA network, so advanced SORA users can help testing asset transfers back-and-forth through this unfriendly interface (by giving their feedback and comments on the performance).

**_Please note that if you aren’t an advanced user or have doubts about what you’re doing, it is encouraged that you wait for the HASHI Substrate interface on Polkaswap. You are solely responsible for any funds lost attempting to bridge assets; these are transfers using live tokens._**

### Advanced Bridging Tutorial

Here’s a brief tutorial on how to transfer tokens on Dotapps.io:

* You will need a Substrate account on Dotapps.io that allows use on any chain. You can use your SORA account if you have set it to allow use on any chain.

Begin by adding the KSM asset to your favorite SORA network compatible wallet. This way, you can conveniently (or Fearlessly) monitor its balance. The KSM asset address on SORA is \[0x00117b0fa73c4672e03a7d9d774e3b3f91beb893e93d9a8d0430295f44225db8\].

Kusama to SORA Transfers
------------------------

To transfer assets from Kusama to the SORA network, you will need XOR for the SORA transaction and KSM tokens to cover the Kusama network transaction fees.

* In the Dotapps interface, navigate to Developer, then Extrinsics, and input the following information:
* To fill the call data with information from the figure, follow this [link](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama-rpc.polkadot.io#/extrinsics/decode/0x6302030001006d1f0300010100796f757257616c6c657441646472657373546f4265456e7465726564486572650304000000000700743ba40b00000000). **Make sure you modify the recipient** as well as the amount to be sent if needed.

Press enter or click to view image in full size

* The extrinsic to submit is **xcmPallet** then **reserveTransferAssets(dest,beneficiary,assets,feeAssetitem)**
* The **dest:** is **V3**
* The **interior:XCMV3Junctions** is **X1**
* The **Parachain** is **2011**
* Then in the next section, **Beneficiary:XCMVersionedMultiLocation** is **V3**
* Under **V3:XCMMultilocation** the **interior:XCMV3Junctions** is **X1**
* The **X1:XCMV3Junction** is **Accountid32** and in the **id:\[u8:32\]** section, input your SORA network account address (as the recipient of the to transfer)
* So far, you now have the sender and the receiver for the transfer, now let’s input the asset.
* In **assets: XcmVersionedMultiAssets** select **V3**, then click **Add Item**
* In the field **Fungible:Compact<128>** add the number of tokens to be transferred. **You have to add twelve zeroes after the amount**. In this case, we are sending **10**, so the input is **10**000000000000

Finally, submit the transaction and sign on the pop-up using your password. After the transaction is successful, you will notice your $KSM balance is reduced in Kusama and has increased proportionally in your SORA account. Now let’s test a transaction in the opposite direction;

### SORA to Kusama Transfers

To transfer assets from SORA to Kusama you will need XOR and KSM tokens to pay for the transaction fees, similar to before.

* In the Dotapps interface, navigate to Developer, then extrinsics, and input the following information;
* To fill the call data with information from the figure, follow this [link](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmof3.sora.org#/extrinsics/decode/0x6700010100117b0fa73c4672e03a7d9d774e3b3f91beb893e93d9a8d0430295f44225db8020301010100796f757257616c6c657441646472657373546f4265456e74657265644865726500008a5d784563010000000000000000). **Make sure you modify the recipient** as well as the amount to be sent, if needed.

Press enter or click to view image in full size

* The extrinsic to submit is **bridgeProxy** then **burn**:
* The **networkId** is **Sub** since we are doing a transfer to another Substrate-based chain
* As a **Sub type** choose **Kusama**
* As an assetId, enter the KSM token address \[0x00117b0fa73c4672e03a7d9d774e3b3f91beb893e93d9a8d0430295f44225db8\]
* Moving on to the recipient configuration;
* Choose **Parachain**
* Select version is **V3**
* Parent is **1** to target **Kusama**
* Enter your **Kusama network address** as **accountId**
* Finally, enter the desired amount to be sent. **You have to add eighteen zeroes after the amount**. In this case, we are sending **10**, so the input is **10**000000000000000000

Then, submit the transaction and sign on the pop-up using your password. After the transaction is successful, you will notice your $KSM balance is reduced in the SORA network and increased in Kusama.

Unlike the lightning-fast transactions on the SORA main network, **these transactions will take between 3–4 minutes to complete.** Don’t worry if your transaction has not arrived immediately, please be patient.

### In Conclusion

Please provide any comments or feedback that you may have from this process in the SORA Telegram communities, such as [SORA Happiness](https://t.me/SORAhappiness), [SORA Devs](https://t.me/soradevs), or the [SORA main chat](https://t.me/sora_xor). Remember that these are live transfers, so make sure to try out with small amounts before moving all your balance across networks. Very soon, the Hashi Substrate bridge interface will be available on Polkaswap, so don’t worry if these steps are too complicated for now. You can wait a bit longer for a stylish and free alternative.

Wiki tutorials have been updated with the latest information and guides for the HASHI Substrate bridge:

[About SORA interoperability and the HASHI bridge](https://wiki.sora.org/interoperability.html)

[About Substrate bridge infrastructure](https://wiki.sora.org/substrate-bridge.html)

### About SORA

[**SORA**](https://sora.org/) is a new economic order for the world, aimed at high growth and empowering human progress. The SORA network includes interoperability with the [Polkadot](https://polkadot.network/) and [Kusama](https://kusama.network/) networks, as well as the capability to [bridge](https://wiki.polkadot.network/docs/en/learn-bridges) external blockchains (like Ethereum) to the Polkadot ecosystem.

### Connect With Us

### [SORA](https://sora.org/) 𒀭 community:

[Twitter](https://twitter.com/sora_xor) | [Telegram](https://t.me/sora_xor) | [Reddit](https://www.reddit.com/r/SORA/) | [YouTube](https://www.youtube.com/channel/UCb2i3VaGrggBhfo2ytg8xCA) | [Announcements Channel](https://t.me/sora_announcements)

[

Sora

](/tag/sora?source=post_page-----f036c5deb950---------------------------------------)

[

Substrate

](/tag/substrate?source=post_page-----f036c5deb950---------------------------------------)

[

Kusama

](/tag/kusama?source=post_page-----f036c5deb950---------------------------------------)

[

Parachain

](/tag/parachain?source=post_page-----f036c5deb950---------------------------------------)

[

Bridge

](/tag/bridge?source=post_page-----f036c5deb950---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Ff036c5deb950&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftransfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--f036c5deb950---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Ff036c5deb950&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftransfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--f036c5deb950---------------------clap_footer------------------)

\--

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Ff036c5deb950&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Ftransfers-between-sora-and-kusama-on-the-hashi-substrate-bridge-dotapps-io-tutorial-f036c5deb950&source=---footer_actions--f036c5deb950---------------------bookmark_footer------------------)

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--f036c5deb950---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--f036c5deb950---------------------------------------)

[

Published in SORA
-----------------

](https://medium.com/sora-xor?source=post_page---post_publication_info--f036c5deb950---------------------------------------)

[1.4K followers](/sora-xor/followers?source=post_page---post_publication_info--f036c5deb950---------------------------------------)

·[Last published Jul 11, 2025](/sora-xor/sora-ecosystem-updates-88-june-33-2025-01ffc03a468b?source=post_page---post_publication_info--f036c5deb950---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](/@sora-xor?source=post_page---post_author_info--f036c5deb950---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](/@sora-xor?source=post_page---post_author_info--f036c5deb950---------------------------------------)

[

Written by SORA
---------------

](/@sora-xor?source=post_page---post_author_info--f036c5deb950---------------------------------------)

[2.3K followers](/@sora-xor/followers?source=post_page---post_author_info--f036c5deb950---------------------------------------)

·[26 following](/@sora-xor/following?source=post_page---post_author_info--f036c5deb950---------------------------------------)

SORA is working to become a decentralized world economic system, under the democratic supervision of the SORA Parliament. Many Worlds. One Economy. SORA.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--f036c5deb950---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----f036c5deb950---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----f036c5deb950---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----f036c5deb950---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----f036c5deb950---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----f036c5deb950---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----f036c5deb950---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----f036c5deb950---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----f036c5deb950---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----f036c5deb950---------------------------------------)
