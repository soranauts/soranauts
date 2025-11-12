---
title: Community Memo – SORA Community Memo 2024 March
slug: sora-community-memo-2024-march
source: community-memo
source_url: 'internal://soranauts/community-memos/2024/sora-community-memo-2024-march'
publishDate: '2025-11-12T02:04:19.881Z'
updateDate: '2025-11-12T02:04:19.881Z'
content_sha256: 25769b61d7839883322eb13271a7902fa327a2f7ee1ff5660e609174e1927de9
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2024 March

1SORA MEMO
A MEMO TO THE 
SORA COMMUNITY
MARCH 2024

2SORA MEMO
This document accompanies the invoice sent to SORA for 
the services provided by SORAMITSU. 
March 2024 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for 
the SORA network development pipeline, and the progress 
rate has steadily advanced. 
This memo will provide a perspective on the activities 
for each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 205057 served by Soramitsu 
Helvetia to the SORA Community.

3SORA MEMO
This month’s work involves Kensetsu, ALT Technology, the bridge to a sovereign 
state, the Multi EVM bridge, HRMP channels, and the SORA Wiki.
Load testing is ongoing on Kensetsu, and more platform test cases are constantly 
being implemented. Work with the front-end team is ongoing to ensure an intuitive 
user experience.
Fee response structures to support Aggregate Liquidity Technology on the 
liquidityProxy.quote to accommodate fees in different tokens (XOR, XST, XSTUSD) 
is ongoing. Work on the upgrade weights is being done to ensure the smooth 
operation of the mechanism. Unit tests and test cases are also being prepared. 
The bridge to Liberland, which is managed by blockchain technology, is almost 
available for public testing. Work to prepare this milestone included extensive 
internal testing in collaboration with the Sovereign State. 
The Multi-EVM bridge is under code review, and the fee structure implementation 
is ongoing. 
Opening HRMP channels to other Substrate networks is an ongoing focus. 
Token transfers between SORA and Moonbeam on the Moonbeam Alphanet are 
being tested, and an HRMP channel to Astar is being developed simultaneously. 
Technical support was provided to the Ceres team ahead of the Apollo platform’s 
release. Additional work on SORA Substrate infrastructure includes codebase 
housekeeping, maintenance, cleaning, optimization, collaboration, and research 
on blockchain architecture and tokenisation for central banks. 
Finally, ongoing project management activities include SORA Governance and 
Technical committee support, quality assurance ops, and development support 
for external teams building on the SORA network.
On the mobile side, work on SORA Card Phase 2 was carried out. This 
implementation brings crypto-to-fiat conversion, integration, and cross-
communication of the fiat wallet application to the SORA wallet, as well as 
improvements to the KYC flow. 
As well as project management activities, systems analysis, UI/UX improvements 
and quality assurance.
1 SORA (Substrate) - 3,904hrs 

4SORA MEMO
1.1 SORA Backend
• Kensetsu:
• Implementation of test cases for the platform;
• Performing load testing of the platform;
• Supporting the front-end team for the implementation of the UI / UX.
• Aggregate Liquidity Technology (ALT):
• Updating fee response structure of liquidityProxy.quote to accommodate 
different fees depending on the liquidity source (XOR, XST, XSTUSD);
• Investigating weights for the upgrade to ensure smooth operations of 
the mechanism;
• Writing unit tests to ensure consistency between requirements 
and implementation;
• Writing test cases.
• Bridge to Sovereign State:
• Synchronisation with the sovereign state’s team to release the 
implementation for public testing;
• Release of the bridge to public testnet;
• Testing of the bridge.
• Multi-EVM Bridge
• Working on the implementation of the fee structure;
• Reviewing code.
• HRMP channels
• Testing transfers between SORA and Moonbeam;
• Synchronization with other parachain teams interested in setting 
up HRMP channels with SORA.
• Codebase maintenance, cleaning, and optimisation;
• Collaboration and research on blockchain architecture for central banks 
powered by SORA;
• Project management activities (daily meetings, planning, retrospectives);
• Quality assurance and testing activities, as well as the development of 
automated tests.

5SORA MEMO
1.2 Mobile App
• Implementation of SORA Card Phase 2:
• Crypto <> Fiat conversion;
• Integration of fiat wallet application;
• Implementation of cross-app communication between SORA and Fiat wallets;
• Improvements in KYC flow.
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities;
• Communicated and synchronised with external partners for SORA Card: Phase 2;
• Preparation of scope, business and technical requirements for SORA Card: Phase 3.

6SORA MEMO
Polkaswap has received a substantial amount of ongoing improvements, including: 
• Swap page enhancements:
• Last Transactions Widget: Stay updated with your selected token’s latest 
transactions in real time;
• Route Widget: Track the route and amounts of your swaps for the selected tokens 
in real time;
• Real-time Volume Updates: Monitor your selected token’s volume in real time;
• Customization Options: Personalize the page by showing/hiding widgets 
as you prefer.
• HASHI Substrate Bridge improvements:
• The bridge backbone to the Liberland network;
• Polkadot network upgrade support;
• Streamlined network management, allowing users to effortlessly switch between 
nodes across different networks, with automatic switching supported for 
predefined nodes;
• Block explorer links added to the Bridge TX Done dialogue for improved 
transaction visibility and tracking.
• Simplified the process of XOR staking;
• Improved network management and blockchain node selection;
• Added XOR native staking history support in the polkaswap.io/#/wallet 
Activity section;
• Fixed filter button styles in the XOR Native staking Validators dialogue;
• Improved interaction with browser extensions as wallets;
• Kensetsu UI implementation:
• Vaults page
• Vault details page
• Closed/liquidated vaults (notifications, history) mockup preparation
• Asset owner page development;
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities.
2 Substrate (PSWAP) - 1,056 hrs

7SORA MEMO
3 DevOps and Security - 423 hrs
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
3.1 SORA Blockchain
• New alerting rules for CI/CD
• Updated the SORA Governance bot
• Improved CI/CD pipeline
• Deployed the Liberland bridge on the public testnet environment
• Improved Alphanet parachain dev environment
• Kensetsu security consulting
• In progress:
• 5% - Wazuh integration
• 5% - Automated delivery till public testnet
• 95% - Liberland bridge audit
3.2 Parachain
• Improved CI/CD pipeline
• Security checks updated
3.3 Polkaswap
• Improved CI/CD pipeline
• Potential collaboration web extension audited
• In progress:
• 5% - Fault tolerance, DePIN alternatives
3.4 Mobile Clients
• Updated CI/CD pipeline
• New autotests
• Library improved
3.5 SORA Card
• Improved CI/CD
• Working on Infrastructure hardening

8SORA MEMO
Educational operations this month included: 
4.1 SORA
• Ecosystem Update; 
• Ongoing wiki Improvements:
• Onramp and Governance tutorials added.
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment);
• Weekly network digest recap;
• Relationship management with parachain teams to open HRMP channels;
• Discussions with potential partners to integrate their services into the SORA wallet 
and integrate SORA DeFi services into their product;
• Alignment and coordination on setting up cross-functional team collaboration for 
business-oriented initiatives;
• Cross-team, cross-department synchronization and planning on processes;
• Product-education collaboration on campaigns;
• Data analysis of the network and ecosystem to drive data-driven decision-making;
• Work on the SORA Ecosystem Growth initiative to strategize and plan from the 
ecosystem driving Product, Business, and Education;
• SORA evangelisation at industry events and conferences.
4.2 Polkaswap
• Ecosystem Update;
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment);
• Orderbook video tutorial series;
• Bridge to a sovereign state education campaign preparation.
• Attending high-impact in-person events and business to government 
(B2G) expenses.
4 Education - 906 hr 

9SORA MEMO
5 Total Hours - 6,289 hr
Additionally, invoice 205056, attached, pertains to cloud server costs for 
March 2024.
All SORA Ecosystem Memo payments provide collateral to the Token 
Bonding Curve.
Your ongoing support is greatly appreciated, and we look forward to 
continuing to serve you.
Sincerely, 
SORAMITSU Helvetia AG
The SORA Ecosystem Updates, published on March 20 and the Polkaswap 
update, published on March 15, present supporting concept updates.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 April 2024205056
ProjectDue Date
Cloud Service Provider Cost for March 202415 April 2024
DescriptionAmount (USD)
Cloud Service Provider Cost for March 2024
14,913.00
Subtotal$14,913.00
Tax0,00
Total Amount Due
USD $14,913.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW1uFPnjTzD4dXFCKfAVxkJ4opuZGDs27d4UJFgMCkKG3YMW
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 April 2024205057
ProjectDue Date
Development Cost for March 202415 April 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)3,904369.00
1,440,576.00
Polkaswap (Backend, Frontend)1,056369.00
389,664.00
DevOps and Security Review423369.00
156,087.00
Education906369.00
334,314.00
Subtotal6,289.00$369.00$2,320,641.00
Subtotal$2,320,641.00
Tax$0.00
Amount Due
USD $2,320,641.00
Grand Total Due (Invoice 205056 & 205057)USD $2,335,554.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW1uFPnjTzD4dXFCKfAVxkJ4opuZGDs27d4UJFgMCkKG3YMW
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 April 2024205057
ProjectDue Date
Development Cost for March 202415 April 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)3,904369.00
1,440,576.00
Polkaswap (Backend, Frontend)1,056369.00
389,664.00
DevOps and Security Review423369.00
156,087.00
Education906369.00
334,314.00
Subtotal6,289.00$369.00$2,320,641.00
Subtotal$2,320,641.00
Tax$0.00
Amount Due
USD $2,320,641.00
Grand Total Due (Invoice 205056 & 205057)USD $2,335,554.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW1uFPnjTzD4dXFCKfAVxkJ4opuZGDs27d4UJFgMCkKG3YMW
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG8 April 2024205056
ProjectDue Date
Cloud Service Provider Cost for March 202415 April 2024
DescriptionAmount (USD)
Cloud Service Provider Cost for March 2024
14,913.00
Subtotal$14,913.00
Tax0,00
Total Amount Due
USD $14,913.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW1uFPnjTzD4dXFCKfAVxkJ4opuZGDs27d4UJFgMCkKG3YMW
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Co. Ltd. 
Link Square Shinjuku 16F,
5-27-5, Sendagaya, 
Shibuya-ku, Tokyo, 
Japan, 151-0051
info@soramitsu.co.jp 
soramitsu.co.jp
