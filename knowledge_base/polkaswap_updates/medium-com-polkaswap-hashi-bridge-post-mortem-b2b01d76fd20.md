---
title: Hashi Bridge Post-Mortem
source: polkaswap_update
source_url: 'https://medium.com/polkaswap/hashi-bridge-post-mortem-b2b01d76fd20'
doc_id: ea4b635df00512b4
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T16:07:14.952Z'
lang: en
license: Polkaswap Official / Medium
checksum_sha256: 7c2a4dca5b33dfc6f11ee970ffc0e76cc6de672f843c1ce54c7bbb25ff56c531
content_hash: 7c2a4dca5b33dfc6f11ee970ffc0e76cc6de672f843c1ce54c7bbb25ff56c531
image_rights: Polkaswap Official / Medium
publishDate: '2025-11-02T16:07:14.830Z'
---
Hashi Bridge Post-Mortem. This postmortem will outline what went… | by Polkaswap | Medium

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2Fb2b01d76fd20&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderUser&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](https://medium.com/m/signin?operation=login&redirect=https%3A%2F%2Fpolkaswap.medium.com%2Fhashi-bridge-post-mortem-b2b01d76fd20&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](https://medium.com/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](https://medium.com/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](https://medium.com/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](https://medium.com/m/signin?operation=login&redirect=https%3A%2F%2Fpolkaswap.medium.com%2Fhashi-bridge-post-mortem-b2b01d76fd20&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

Hashi Bridge Post-Mortem
========================

[

![Polkaswap](./images/a401f1d97c2baf8f7ee33b855deccdf4642d9b3cef2604c97bf4d1a13f2d32c9.png)

](/?source=post_page---byline--b2b01d76fd20---------------------------------------)

[Polkaswap](/?source=post_page---byline--b2b01d76fd20---------------------------------------)

5 min read

·

Apr 28, 2022

[

](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2Fb2b01d76fd20&operation=register&redirect=https%3A%2F%2Fpolkaswap.medium.com%2Fhashi-bridge-post-mortem-b2b01d76fd20&user=Polkaswap&userId=246f0843d222&source=---header_actions--b2b01d76fd20---------------------clap_footer------------------)

\--

[](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fb2b01d76fd20&operation=register&redirect=https%3A%2F%2Fpolkaswap.medium.com%2Fhashi-bridge-post-mortem-b2b01d76fd20&source=---header_actions--b2b01d76fd20---------------------bookmark_footer------------------)

Listen

Share

On March 14th, 2022 at 11:40:35 PM UTC+1 the Polkaswap team discovered a hack that was taking place on the Hashi Bridge. In total the attacker was able to obtain 150ETH, of which 130ETH was returned, and the remaining 20 ETH will be covered by minting XOR via the SORA network’s Social Insurance for Systemic Infrastructure.

This postmortem will outline what went wrong, how it was fixed, and the additional protection protocols implemented to fix the vulnerability and prevent further attacks. An analysis of the accounts involved, as well as a list of associated accounts, is also included. Finally, the SII course of action will be outlined.

Press enter or click to view image in full size

What went wrong?
----------------

At 21:42:05 on March 14th, 2022, the Polkaswap team discovered an unusual series of transactions taking place on the Hashi bridge. It was discovered shortly after that the hacker took advantage of the `**sendERC20ToSidechain**` public function of the bridge smart contract;

function sendERC20ToSidechain( 
bytes32 to, 
uint amount, 
address tokenAddress) 
external 
shouldBeInitialized shouldNotBePreparedForMigration { 
IERC20 token = IERC20(tokenAddress); require(token.allowance(msg.sender, address(this)) >= amount, “NOT ENOUGH DELEGATED TOKENS ON SENDER BALANCE”); bytes32 sidechainAssetId = \_sidechainTokensByAddress\[tokenAddress\]; 
 if (sidechainAssetId != “” || \_addressVAL == tokenAddress || \_addressXOR == tokenAddress) { ERC20Burnable mtoken = ERC20Burnable(tokenAddress); mtoken.burnFrom(msg.sender, amount); 
} else { 
require(acceptedEthTokens\[tokenAddress\], “The Token is not accepted for transfer to sidechain”); 
token.transferFrom(msg.sender, address(this), amount); 
 } 
emit Deposit(to, amount, tokenAddress, sidechainAssetId); 
}

* The function produces the `**Deposit**` event at the end, which determines the amount of tokens to be deposited to the SORA network account from the SORA bridge account.

Attack Angle
------------

* The Hacker `0x743143F37D1E901494aBa15D1E8463806663e822` created a new [smart contract](https://etherscan.io/address/0x743143f37d1e901494aba15d1e8463806663e822) that emitted a `Deposit` event (with the same name and parameters).
* [This transaction](https://etherscan.io/tx/0xc89905ed05988bf0aaf7b85b2dc6c670646353a643a810aa7136629b70f138c5) happened on Mar-14–2022 09:04:35 UTC+1 and produced a fictitious [Deposit event](https://etherscan.io/tx/0xc89905ed05988bf0aaf7b85b2dc6c670646353a643a810aa7136629b70f138c5#eventlog), that was consumed by the SORA bridge, depositing more tokens in the SORA network than were actually deposited on the Ethereum side.
* On the SORA side, `request_from_sidechain` [was called by the hacker](https://sora.subscan.io/extrinsic/4452121-1) which took the event from the hacker’s smart contract.
* The account `0xd04a1ac0a2e9e81407555881600ceb1fe0d9a5bf` received 0.1 ETH from Tornadocash to perform the attack and withdrew 150ETH, which was almost immediately sent back to Tornadocash and broken down into smaller amounts. The attacker’s SORA account `cnUt4e1wvUWKghRxgeKZrxoyonjW5iFh5nhRJuqF6EyBgtuec`was identified as well.

Attacker Information
--------------------

* Following the breadcrumbs, it was revealed that the account `0xd04a1ac0a2e9e81407555881600ceb1fe0d9a5bf` performed the attack after receiving 0.1 ETH from Tornadocash, and then, after receiving 150 ETH from the bridge (9:04 am), the amount was broken down (9:11 am) into 100 ETH, then 4 x 10ETH and 9x 1ETH and 5x 0.1 ETH on Tornadocash respectively. The 100 ETH was refunded, but the remaining amount broken down into 18 separate pieces amounting to 50 ETH was not recovered, as it was distributed amongst the flagged addresses.

Press enter or click to view image in full size

* For the next two days, the flagged account `0x743143F37D1E901494aBa15D1E8463806663e822` received ETH from Tornadocash and proceeded to send 9.7 ETH to the ENS address `arnavgupta.eth`

Press enter or click to view image in full size

* The ENS address `arnavgupta.eth` has received transfers from `0x743143F37D1E901494aBa15D1E8463806663e822` as well as the Hashi Bridge.

Press enter or click to view image in full size

* The attacker tried the exploit angle again from the account `0x39e36272efe6677bfab32b5bd5da15498a38afc9` and sent funds to `0x743143F37D1E901494aBa15D1E8463806663e822` (The transactions 0.01 Contract & ETH, as well as 0.06 contract and ETH by this address, correspond to interactions with the Hashi Bridge)

Press enter or click to view image in full size

Additional addresses associated with the attacker are:

* `cnVvKzpuhamBeRmmWFyxRctkigqvVrfmCiRf4FpT3bydiS8c5`
* `cnUybhZSiHRD2gJseyPLPY8sv8LBN3iYcbApQh1CbkZWjzGPq`
* `cnVet8ujYypSrLD7upsknWyrUNBHMon1sbZ5tQJFECeCkWXsw`
* `cnWAHWjjLkcTLSSKV2grAnS1NK16gmYp4sS2bsd2HRTYswFui`
* `cnTBKrrZrB3zpNLH3tKvsQmx29LojKjqPqQ6tAbHRdg1hY7Lo`
* `0x1f289da34192316918b2cbb4df0c39eca3847fb5`
* `0xf58ba06e5b1e8e11535e35c936e3c97c2eba6594`
* `0xbe89aaf61b3ee2d26521aa740b6a06bbe88a11dc`
* `0xc8b9d903f1670ffc0900bf2aa56853dd161123fe`
* `0x640f4e28f6485c118e1b350b6357d7300c03b637`

How Was it Fixed
----------------

1. Fast action: Bridge was stopped in order to prevent further hacks.
2. The smart contract address on the SORA side was checked during the Deposit event processing
3. A mainnet runtime upgrade with a bridge fix was immediately implemented.
4. The hacker was pinpointed and called out, which led to a refund of 130 ETH of the total 150 ETH compromised.

How Will Further Attacks be Prevented
-------------------------------------

Along with stopping the attack, there has been a code upgrade to improve the security of the bridge both in the ETH mainnet and SORA network. The bridge infrastructure was upgraded to prevent similar attack angles and a mainnet runtime upgrade (March 15th, 2022) was fast-tracked to implement security improvements that protect the users and network.

Additionally, XOR will be minted and a bounty will be provided to four members of the community who provided more insight on the attack and monitored the bridge. You know who you are, thank you.

A bug bounty for critical bugs will soon be implemented in collaboration with Immunefi to find and address other possible issues that could compromise bridge security. More information and the rules for this bounty will be announced soon.

For other projects using bridges, there is a bot available to monitor bridge infrastructure for suspicious transactions. Please reach out to contact@whitehats.lol for more information.

Finally, **if you are reading this, you are still in time to return the ETH you stole** to this address `0x4ADb46C5382a32fEB15eeB977c6c7F55eFBd7863`. For your cooperation, there will be a bounty of 20 ETH.

**_Update: The hacker returned 30 ETH on the 4th of May 2022 at 15:20 UTC +1. The Social Insurance for Systemic Infrastructure will cover the remaining 20 ETH._**

Social Insurance for Systemic Infrastructure Claim
--------------------------------------------------

Although the hacker was able to obtain 150 ETH through this exploit, and subsequently refund the network 130 ETH, there is still 20 ETH that was provided as a bounty for finding the exploit. The [Social Insurance for Systemic Infrastructure](https://medium.com/sora-xor/social-insurance-for-systematically-important-infrastructure-18a63ef711ca) will mint XOR to cover the difference, buying back and burning ETH slowly over 100 days.

[

Polkaswap

](https://medium.com/tag/polkaswap?source=post_page-----b2b01d76fd20---------------------------------------)

[

Sora

](https://medium.com/tag/sora?source=post_page-----b2b01d76fd20---------------------------------------)

[

Blockchain

](https://medium.com/tag/blockchain?source=post_page-----b2b01d76fd20---------------------------------------)

[

Defi

](https://medium.com/tag/defi?source=post_page-----b2b01d76fd20---------------------------------------)

[

Polkadot

](https://medium.com/tag/polkadot?source=post_page-----b2b01d76fd20---------------------------------------)

[

](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2Fb2b01d76fd20&operation=register&redirect=https%3A%2F%2Fpolkaswap.medium.com%2Fhashi-bridge-post-mortem-b2b01d76fd20&user=Polkaswap&userId=246f0843d222&source=---footer_actions--b2b01d76fd20---------------------clap_footer------------------)

\--

[

](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2Fb2b01d76fd20&operation=register&redirect=https%3A%2F%2Fpolkaswap.medium.com%2Fhashi-bridge-post-mortem-b2b01d76fd20&user=Polkaswap&userId=246f0843d222&source=---footer_actions--b2b01d76fd20---------------------clap_footer------------------)

\--

[](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fb2b01d76fd20&operation=register&redirect=https%3A%2F%2Fpolkaswap.medium.com%2Fhashi-bridge-post-mortem-b2b01d76fd20&source=---footer_actions--b2b01d76fd20---------------------bookmark_footer------------------)

[

![Polkaswap](./images/c3a23c4104227dc121f9d30ed49d592a6ed5fdcb1cb11724c7b19f35e47c4c25.png)

](/?source=post_page---post_author_info--b2b01d76fd20---------------------------------------)

[

![Polkaswap](./images/8b2f0c81afb4577254ec073d67ac26ddd20e8d72d3a1ff7c477b7cb85ff3884e.png)

](/?source=post_page---post_author_info--b2b01d76fd20---------------------------------------)

[

Written by Polkaswap
--------------------

](/?source=post_page---post_author_info--b2b01d76fd20---------------------------------------)

[3.6K followers](/followers?source=post_page---post_author_info--b2b01d76fd20---------------------------------------)

·[7 following](/following?source=post_page---post_author_info--b2b01d76fd20---------------------------------------)

[https://polkaswap.io](https://polkaswap.io) is a non-custodial cross chain AMM DEX designed uniquely for the Polkadot and Kusama ecosystems and hosted on the SORA 2.0 network.

No responses yet
----------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--b2b01d76fd20---------------------------------------)

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----b2b01d76fd20---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----b2b01d76fd20---------------------------------------)

[

About

](https://medium.com/about?autoplay=1&source=post_page-----b2b01d76fd20---------------------------------------)

[

Careers

](https://medium.com/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----b2b01d76fd20---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----b2b01d76fd20---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----b2b01d76fd20---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----b2b01d76fd20---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----b2b01d76fd20---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----b2b01d76fd20---------------------------------------)
