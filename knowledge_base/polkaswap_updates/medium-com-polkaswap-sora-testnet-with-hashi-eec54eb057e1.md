---
title: >-
  Introducing the Ethereum<->SORA network Bridge “HASHI” on the Polkaswap
  Testnet
source: polkaswap_update
source_url: 'https://medium.com/polkaswap/sora-testnet-with-hashi-eec54eb057e1'
doc_id: e43a97a2a7b58c5b
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:06:26.504Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: 1a5a03d70dfe9eef302d895d7aac2822a120bc6311f5c87aeb4c4c7f2a28b657
content_hash: 1a5a03d70dfe9eef302d895d7aac2822a120bc6311f5c87aeb4c4c7f2a28b657
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:06:26.199Z'
---
Introducing the Ethereum<->SORA network Bridge “HASHI” on the Polkaswap Testnet | by Polkaswap | Polkaswap | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2Feec54eb057e1&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-testnet-with-hashi-eec54eb057e1&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-testnet-with-hashi-eec54eb057e1&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

Polkaswap

-------------

](https://medium.com/polkaswap?source=post_page---publication_nav-7dd150c29856-eec54eb057e1---------------------------------------)

·

[

![Polkaswap](./images/cf82f8d65570f4817d617e2117ee39a73d7a6500e311d37c8e16e183b5c2cfb0.png)

](https://medium.com/polkaswap?source=post_page---post_publication_sidebar-7dd150c29856-eec54eb057e1---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

Introducing the Ethereum<->SORA network Bridge “HASHI” on the Polkaswap Testnet
===============================================================================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/@polkaswap?source=post_page---byline--eec54eb057e1---------------------------------------)

[Polkaswap](/@polkaswap?source=post_page---byline--eec54eb057e1---------------------------------------)

4 min read

·

Feb 26, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2Feec54eb057e1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-testnet-with-hashi-eec54eb057e1&user=Polkaswap&userId=246f0843d222&source=---header_actions--eec54eb057e1---------------------clap_footer------------------)

\--

2

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Feec54eb057e1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-testnet-with-hashi-eec54eb057e1&source=---header_actions--eec54eb057e1---------------------bookmark_footer------------------)

Listen

Share

**The SORA testnet has been updated to support token transfers across our HASHI Ethereum bridge, so now test tokens can be moved from the Ethereum Rinkeby testnet to the SORA v2/Polkaswap testnet.**

**The HASHI bridge can be tested at** [testbridge.polkaswap.io](http://testbridge.polkaswap.io/).

[Source code is also opened](https://github.com/sora-xor/sora2-evm-contracts).

Testnet contract addresses on Rinkeby:

**VAL** [0x725c6b8cd3621eba4e0ccc40d532e7025b925a65](https://rinkeby.etherscan.io/address/0x725c6b8cd3621eba4e0ccc40d532e7025b925a65) 
**XOR** [0xdc1c024535118f6de6d999c23fc31e33bc2cafc9](https://rinkeby.etherscan.io/address/0xdc1c024535118f6de6d999c23fc31e33bc2cafc9) 
**PSWAP** [0x89801864f50d2ee5e71253f73470244fbf0d6206](https://rinkeby.etherscan.io/address/0x89801864f50d2ee5e71253f73470244fbf0d6206) 
**Bridge** [0x4ff646bff7884f118406aa4beebd9e10de406603](https://rinkeby.etherscan.io/address/0x4ff646bff7884f118406aa4beebd9e10de406603)

Press enter or click to view image in full size

The HASHI bridge to Ethereum is a core part of the [SORA](https://sora.org) v2/[Polkaswap](https://polkaswap.io) architecture.

SORA v2/Polkaswap Testnet Bridge Tutorial
-----------------------------------------

Prerequisites
-------------

To be able to use the SORA testnet bridge, you need to have an account on the SORA testnet with some test XOR. If you don’t have one, please create an account on the SORA testnet and get some test XOR using the SORA testnet faucet: [https://testfaucet.polkaswap.io](https://testfaucet.polkaswap.io)

On the main net, we plan to provide a workaround for the users to be able to transfer tokens from Ethereum to the SORA network without having XOR on the SORA network side, but for the testnet this is currently required.

Ethereum Rinkeby Testnet→SORA v2 Testnet, HASHI Bridge Transfer Tutorial
------------------------------------------------------------------------

The launch of bridge functionality on the testnet bridge supports only XOR and VAL token transfers between Ethereum and SORA networks. This whitelist of tokens will be extended soon after some testing is performed. In the future, users will be able to register almost any token to be able to transfer between networks.

To be able to move tokens across the bridge from the Ethereum Rinkeby testnet to the SORA v2 testnet, first you need to connect your Metamask wallet to the Ethereum Rinkeby testnet. This is simple to do, as shown below.

1. Open metamask, select your account and press the network selection area. Select **Rinkeby Test Network**.

2\. After being connected to the Rinkeby Test network you need to get some Rinkeby Test Ether to operate on the network. So, please go to the Rinkeby Authenticated faucet site — [https://app.mycrypto.com/faucet](https://app.mycrypto.com/faucet)— and perform the required action.

3\. After submitting your social network post to the required field of the faucet click, “Give me ether” button and select the amount from the dropdown list. Wait for the transaction to be processed by Rinkeby network and feel happy with the newly received test Ethereum tokens 🎉

Press enter or click to view image in full size

4\. Now you can go to the HASHI bridge UI and transfer some test Ether from the Rinkeby test network to the SORA test network. Go to the HASHI bridge URL: [testbridge.polkaswap.io](http://testbridge.polkaswap.io/)

Press enter or click to view image in full size

5\. On the HASHI **bridge** page, connect both Metamask and SORA wallets to the application by pressing two “Connect wallet buttons” and follow the flow which Metamask and Polkadot.js extensions propose to you.

Check that the SORA (sic) Mainnet input field is on top of the Ethereum (sic) Mainnet input field in the form. If not, then press arrows between input fields to exchange positions. This setup ensures that you will transfer tokens from the SORA test to Ethereum.

Press enter or click to view image in full size

6\. Then press the “Choose token button” and select the XOR token to transfer between networks and enter the token amount you want to transfer. Then press the Next button.

Press enter or click to view image in full size

7\. You will then see the transfer confirmation screen:

Press enter or click to view image in full size

8\. After you press the **Confirm** button, the UI will sequentially ask you to sign transactions with Polkadot.js and Metamask browser extensions. Please, consider that blockchain transactions do not happen immediately and it might take some time.

9\. After successfully transferring, you will see the final message and be able to check the amount of tokens transferred to your Metamask wallet connected to Rinkeby network (Rinkeby XOR contract address **0xdc1c024535118f6de6d999c23fc31e33bc2cafc9**). Please make sure you add the XOR testnet token to the token list in Metamask.

Press enter or click to view image in full size

10\. You can view XOR transactions on the Rinkeby testnet here: [https://rinkeby.etherscan.io/address/0xdc1c024535118f6de6d999c23fc31e33bc2cafc9](https://rinkeby.etherscan.io/address/0xdc1c024535118f6de6d999c23fc31e33bc2cafc9)

11\. You can also move XOR from the Rinkeby testnet to the SORA testnet by doing the opposite of the above. Please keep in mind that when finalizing the transaction on the SORA testnet, it takes about 6 minutes because 30 block confirmations are needed to prevent forks on the Rinkeby testnet from disrupting the bridge.

12\. You can try to play around with the VAL token too. Contract address is: **0x725c6b8cd3621eba4e0ccc40d532e7025b925a65 (**[https://rinkeby.etherscan.io/token/0x725c6b8cd3621eba4e0ccc40d532e7025b925a65](https://rinkeby.etherscan.io/address/0x725c6b8cd3621eba4e0ccc40d532e7025b925a65))

For PSWAP, the contract address is **0x89801864f50d2ee5e71253f73470244fbf0d6206** ([https://rinkeby.etherscan.io/address/0x89801864f50d2ee5e71253f73470244fbf0d6206](https://rinkeby.etherscan.io/address/0x89801864f50d2ee5e71253f73470244fbf0d6206))

**Whatever you do, please have fun and definitely make sure you do not send any real XOR, real VAL, or real ETH to the testnet!!!!**

Press enter or click to view image in full size

[

Blockchain

](/tag/blockchain?source=post_page-----eec54eb057e1---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----eec54eb057e1---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----eec54eb057e1---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----eec54eb057e1---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----eec54eb057e1---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2Feec54eb057e1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-testnet-with-hashi-eec54eb057e1&user=Polkaswap&userId=246f0843d222&source=---footer_actions--eec54eb057e1---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fpolkaswap%2Feec54eb057e1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-testnet-with-hashi-eec54eb057e1&user=Polkaswap&userId=246f0843d222&source=---footer_actions--eec54eb057e1---------------------clap_footer------------------)

\--

2

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Feec54eb057e1&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fpolkaswap%2Fsora-testnet-with-hashi-eec54eb057e1&source=---footer_actions--eec54eb057e1---------------------bookmark_footer------------------)

[

![Polkaswap](./images/a2a865cdc58a8abc70d9e706fdd5cb5d57868fc11d220491eb8adec8e809cc84.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--eec54eb057e1---------------------------------------)

[

![Polkaswap](./images/326954642349c766b8441b9782015786a61edcd12b2af6bfc5c3ba7cd067ad83.png)

](https://medium.com/polkaswap?source=post_page---post_publication_info--eec54eb057e1---------------------------------------)

[

Published in Polkaswap
----------------------

](https://medium.com/polkaswap?source=post_page---post_publication_info--eec54eb057e1---------------------------------------)

[1.5K followers](/polkaswap/followers?source=post_page---post_publication_info--eec54eb057e1---------------------------------------)

·[Last published Jun 2, 2025](/polkaswap/polkaswap-ecosystem-updates-84-may-33-2025-40214bd1d82e?source=post_page---post_publication_info--eec54eb057e1---------------------------------------)

A non custodial liquidity aggregator cross chain AMM DEX designed uniquely for the Polkadot ecosystem with boundless liquidity through one of a kind Aggregate Liquidity Technology (ALT) with the security and convenience of a DEX. Website: [polkaswap.io](http://polkaswap.io)

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/@polkaswap?source=post_page---post_author_info--eec54eb057e1---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/@polkaswap?source=post_page---post_author_info--eec54eb057e1---------------------------------------)

[

Written by Polkaswap
--------------------

](/@polkaswap?source=post_page---post_author_info--eec54eb057e1---------------------------------------)

[3.6K followers](/@polkaswap/followers?source=post_page---post_author_info--eec54eb057e1---------------------------------------)

·[7 following](/@polkaswap/following?source=post_page---post_author_info--eec54eb057e1---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

Responses (2)
-------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--eec54eb057e1---------------------------------------)

See all responses

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----eec54eb057e1---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----eec54eb057e1---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----eec54eb057e1---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----eec54eb057e1---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----eec54eb057e1---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----eec54eb057e1---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----eec54eb057e1---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----eec54eb057e1---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----eec54eb057e1---------------------------------------)
