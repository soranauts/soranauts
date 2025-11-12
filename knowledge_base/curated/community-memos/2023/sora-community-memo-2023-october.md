---
title: Community Memo – SORA Community Memo 2023 October
slug: sora-community-memo-2023-october
source: community-memo
source_url: 'internal://soranauts/community-memos/2023/sora-community-memo-2023-october'
publishDate: '2025-11-12T02:04:19.976Z'
updateDate: '2025-11-12T02:04:19.976Z'
content_sha256: a37ce7d31e7963e9eadde19b861219235660e1f9f6daf59ab9eb06b3b877810c
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2023 October

1SORA MEMO
A MEMO TO THE 
SORA COMMUNITY
OCTOBER 2023

2SORA MEMO
This document accompanies the invoice sent to SORA for the 
services provided by SORAMITSU. 
October 2023 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for the 
SORA Network development pipeline, and the progress rate 
has steadily advanced. 
This memo will provide a perspective on the activities for 
each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 205047 served by 
SORAMITSU Helvetia to the SORA Community.

3SORA MEMO
Work this month is spread across the Substrate bridge, Orderbook 
implementation, a CBDC Proof of Concept, Documentation, and Community 
Requested Features.
The third phase of the Substrate bridge, Bridge Activation, was completed. 
The SORA Kusama Council and Technical Committee have been implemented, 
and after successful testing, the bridge infrastructure release plan is smoothly 
progressing toward full release. More details on the release phases are available 
below. This bridge infrastructure is also undergoing preparation to be implemented 
for another non-parachain Substrate-based network supporting a Sovereign State.
The Order book has completed benchmarking, and Quality Assurance feedback is 
being implemented. The final features for the Orderbook MVP are in progress, as 
well as the implementation of a UI from the client application teams. 
The proof of concept for a Central Bank Digital Currency on the SORA network 
is ongoing. Dev work for the implementation will consist of support for the PoC. 
Details of this PoC are under embargo until an official announcement is released. 
Work on the architecture and implementation of Kensetsu is underway, with early 
cross-team collaboration implemented to optimise the public release period. 
Documentation to open HRMP channels with other parachains and the Substrate 
Bridge infrastructure outline is in progress; additionally, the XOR fee structure was 
modified to optimise claiming Validator rewards.
Finally, ongoing project management activities include SORA Governance and 
Technical committee support, quality assurance ops and development support 
to external teams building on the SORA network.
On the mobile side, four releases were worked on this month: 
• 3.4.0, released on the 13th of October, included improvements to the sign-on 
process and made the SORA IBAN balance available. 
• 3.5.0, released on the 19th of October, included SORA Ecosystem features such as 
tokens and liquidity pools available, their fiat price trends, wallet personalisation 
features, and synthetic asset support in liquidity pools, among others.
• 3.6.0, released on the 31st of October, included quality-of-life improvements for 
SORA Card onboarding, such as phone number formatting during signups and 
detailed information about every step of the process. 
1 SORA (Substrate) - 5,669 hrs 

4SORA MEMO
• 3.7.0, in progress, will introduce night mode, support for left-to-right reading 
languages, and performance and QoL improvements.
As well as project management activities, systems analysis, UI/UX improvements 
and quality assurance. 
1.1 SORA Backend
• Final preparations for releasing the Substrate bridge to the SORA 
Kusama parachain.
• Completed the 3-phased release of the bridge:
• Phase 1: Infrastructure setup
• Releasing the code for the Substrate bridge to production env.
• Phase 2: Governance setup
• Setting up the governance structure on the SORA Kusama parachain.
• Phase 3: Bridge activation
• Registering the KSM token.
• Launching the physical machines to run the bridge.
• Working on reusing the Substrate bridge to bridge to another non-parachain, 
Substrate-based network supporting a sovereign state.
• Working on a PoC to showcase using SORA for CBDC use cases.
• Implementing the last features for the MVP of the Order book:
• Fixing issues on the implementation after feedback from Quality Assurance.
• Supporting client application teams in implementing the UI for the order book.
• Working on the architecture and implementation details for Kensetsu:
• Collaborating with other teams (design, front-end) to enhance synchronisation 
and time-to-market.
1.2 Mobile App
• Implemented and released version 3.4.0 - SORA IBAN Balance (13/10):
• Improvements in the sign-up process;
• Display your SORA IBAN balance.
• Implemented and released version 3.5.0 - Explore SORA Ecosystem (19/10):
• Display all the tokens and liquidity pools available in the SORA ecosystem.
• Display the asset fiat price trend.
• Personalise your wallet by toggling the cards on or off (assets, pools, SORA Card).
• Enabling providing liquidity with synthetic assets.
• Support new languages, including Arabic and Hebrew.
• Include various fixes and improvements based on the community feedback.

5SORA MEMO
• Implemented and released version 3.6.0 - QoL: Improved Sign-ups (31/10):
• Seamless phone number formatting during sign-ups.
• Improved onboarding flow with updates at every stage of the process.
• Other user experience enhancements.
• Working on release 3.7.0 - Night Mode: 
• Night mode.
• Support for Arabic, Hebrew, and Persian.
• Performance improvements in loading time.
• Disable the X1 widget (native XOR on-ramp).
• Remove the reminder banner to back up the account.
• Improvements in Connect with Google.
• Various improvements in UI / UX.
• Working on the implementation of the Substrate bridge for mobile clients.
• Synchronisation with external partners.

6SORA MEMO
Polkaswap has received a substantial amount of ongoing improvements, including: 
• Orderbook phase 1: Trade page implementation.
• Order book widget.
• Place market/limit orders.
• Price charts.
• Orders management (lifetime, cancel, cancel all, etc).
• Orders history.
• HASHI Substrate Bridge improvements:
• Locked balances for all networks (meta v.13, v.14, v.15).
• Better external blockchain/parachain networks management.
• The Polkadot crowdloan link was added to the Select network dialogue.
• Styles for Firefox were improved.
• WalletConnect support:
• Whitelist Polkaswap.io for WalletConnect.
• Backbone for WalletConnect.
• Added UI for WalletConnect 
(list of predefined wallets, select wallet dialogue, etc.).
• Indexer improvements:
• A common architecture for Subquery & Subsquid services.
• XOR Native Staking rewards in Subquery & Subsquid.
• Added CERES API switcher for fiat rates.
• Explored mainnet data in Subsquid.
• Asset owner page implementation:
• Simplified creation for popular assets.
• Simplified asset management for created assets (mint/burn/edit asset info).
• Added stats for created assets.
• Other UX improvements:
• Added a new banner featuring the ongoing SORA Polkadot Crowdloan.
• Circulating supply improvements for VAL & PSWAP on the Stats page.
• Browser extensions inject logic (sometimes infinite loader) was improved, 
achieving better performance.
• Chart buttons are disabled during chart data loading.
• UX investigation for new pages: Governance, Kensetsu, NFT Marketplace.
2 Substrate (PSWAP) - 626 hrs

7SORA MEMO
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
3.1 SORA Blockchain
• More alerting rules and dashboards for the SORA network and bridges.
• Improved CI/CD pipeline.
• Updated SORA bots.
• Rust CI library improved.
• The SORA pre-dev environment for upcoming major features was prepared.
• In progress: 
• 98% SAST for Rust implementation.
• 50% New environment for Substrate <> Substrate bridge.
3.2 Parachain
• Improved CI/CD pipeline
• Security checks.
• New tests
3.3 Polkaswap
• Improved CI/CD pipeline
• New alerts.
• Working on Infrastructure hardening.
3.4 Mobile Clients
• Updated CI/CD pipeline
• Added more autotests.
• SORA card-related improvements.
3.5 SORA Card
• A new version has been released.
• Working on Infrastructure hardening.
3 DevOps and Security - 521 hrs

8SORA MEMO
4 Education - 1006 hr 
Educational operations this month included: 
4.1 SORA
• Ecosystem Updates 
• Documenting business description and technical implementation for the initiatives 
(Substrate bridge, Order book).
• Ongoing wiki Improvements.
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment).
• SORA Kusama parachain release ‘Governance setup’ communications.
• SORA Blockchain release ‘Substrate Bridge Upgrade’ communications.
• SORA Blockchain release ‘XORless transfers for the PoC’ communications. 
• SORA Wallet release coverage: 
• ‘SORA Card IBAN enhancements’ communications.
• ‘Explore ecosystem tab’ communications.
• ‘Improved KYC onboarding’ communications.
• Articles:
• Understanding TBCD and its role in the SORA ecosystem.
• Tutorial on how to bridge KSM via HASHI Substrate bridge via dotapps.io.
• How to manage passphrases, security guide
• Setting up and strengthening the Builders’ program to support current and future 
collaborations on SORA.
• SORA evangelisation at industry events and conferences. 
4.2 Polkaswap
• Ecosystem Updates.
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment).
• Polkaswap v1.22 ‘Improved KYC onboarding’ communications.
• Polkaswap v1.23 ‘SORA Card IBAN enhancements’ communications.
• Attending high-impact in-person events and business to government 
(B2G) expenses. 

9SORA MEMO
5 Total Hours - 7,822 hr
Additionally, invoice 205046, attached, pertains to cloud server costs for 
October 2023.
All SORA Ecosystem Memo payments provide collateral to the Token 
Bonding Curve.
Your ongoing support is greatly appreciated, and we look forward to continuing 
to serve you.
Sincerely, 
SORAMITSU Helvetia AG
Supporting concept updates are presented in the SORA Ecosystem Updates 
published on October 26, and Polkaswap updates on October 26, respectively.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 November 2023205046
ProjectDue Date
Cloud Service Provider Cost for October 202318 November 2023
DescriptionAmount (USD)
Cloud Service Provider Cost for October 2023
12,735.00
Subtotal$12,735.00
Tax0,00
Total Amount Due
USD $12,735.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWRVWRzg3DQ6YTWVR8q3AjC2TsivAG1DzgWqRQ61nAvYHY75
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 November 2023205046
ProjectDue Date
Cloud Service Provider Cost for October 202318 November 2023
DescriptionAmount (USD)
Cloud Service Provider Cost for October 2023
12,735.00
Subtotal$12,735.00
Tax0,00
Total Amount Due
USD $12,735.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWRVWRzg3DQ6YTWVR8q3AjC2TsivAG1DzgWqRQ61nAvYHY75
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 November 2023205047
ProjectDue Date
Development Cost for October 202318 November 2023
Description
Quantity 
(Work-Hours)
Discounted Unit Price 
(USD)
Amount (USD)
SORA (Backend, Mobile Apps)5,669295.00
1,672,355.00
Polkaswap (Backend, Frontend)626295.00
184,670.00
DevOps and Security Review521295.00
153,695.00
Education1,006295.00
296,770.00
Subtotal7,822.00295.00$2,307,490.00
Subtotal$2,307,490.00
Tax$0.00
Amount Due
USD $2,307,490.00
Grand Total Due (Invoice 205046 & 205047)USD $2,320,225.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWRVWRzg3DQ6YTWVR8q3AjC2TsivAG1DzgWqRQ61nAvYHY75
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 November 2023205047
ProjectDue Date
Development Cost for October 202318 November 2023
Description
Quantity 
(Work-Hours)
Discounted Unit Price 
(USD)
Amount (USD)
SORA (Backend, Mobile Apps)5,669295.00
1,672,355.00
Polkaswap (Backend, Frontend)626295.00
184,670.00
DevOps and Security Review521295.00
153,695.00
Education1,006295.00
296,770.00
Subtotal7,822.00295.00$2,307,490.00
Subtotal$2,307,490.00
Tax$0.00
Amount Due
USD $2,307,490.00
Grand Total Due (Invoice 205046 & 205047)USD $2,320,225.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWRVWRzg3DQ6YTWVR8q3AjC2TsivAG1DzgWqRQ61nAvYHY75
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 November 2023205046
ProjectDue Date
Cloud Service Provider Cost for October 202318 November 2023
DescriptionAmount (USD)
Cloud Service Provider Cost for October 2023
12,735.00
Subtotal$12,735.00
Tax0,00
Total Amount Due
USD $12,735.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWRVWRzg3DQ6YTWVR8q3AjC2TsivAG1DzgWqRQ61nAvYHY75
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 November 2023205047
ProjectDue Date
Development Cost for October 202318 November 2023
Description
Quantity 
(Work-Hours)
Discounted Unit Price 
(USD)
Amount (USD)
SORA (Backend, Mobile Apps)5,669295.00
1,672,355.00
Polkaswap (Backend, Frontend)626295.00
184,670.00
DevOps and Security Review521295.00
153,695.00
Education1,006295.00
296,770.00
Subtotal7,822.00295.00$2,307,490.00
Subtotal$2,307,490.00
Tax$0.00
Amount Due
USD $2,307,490.00
Grand Total Due (Invoice 205046 & 205047)USD $2,320,225.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWRVWRzg3DQ6YTWVR8q3AjC2TsivAG1DzgWqRQ61nAvYHY75
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Co. Ltd. 
Link Square Shinjuku 16F,
5-27-5, Sendagaya, 
Shibuya-ku, Tokyo, 
Japan, 151-0051
info@soramitsu.co.jp 
soramitsu.co.jp
