---
title: Community Memo – SORA Community Memo 2024 August
slug: sora-community-memo-2024-august
source: community-memo
source_url: 'internal://soranauts/community-memos/2024/sora-community-memo-2024-august'
publishDate: '2025-11-12T02:04:19.924Z'
updateDate: '2025-11-12T02:04:19.924Z'
content_sha256: efb06f7d57d686c0c555e626bf15f0941efc663dcc179bf4ca5b3c1d8a231740
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2024 August

A MEMO TO THE 
SORA COMMUNITY
AUGUST 2024

2SORA MEMO
This document accompanies the invoice sent to SORA for 
the services provided by SORAMITSU. 
August 2024 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for the 
SORA network development pipeline, and the progress rate 
has steadily advanced. 
This memo will provide a perspective on the activities for 
each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 900108 served to the 
SORA Community.

3SORA MEMO
This month’s work focuses on the tokenomics upgrade, Kensetsu, the Multi EVM 
bridge, the TON bridge, ALT Technology, and the DeFi-R proof of concept. 
Work is ongoing to improve the Kensetsu feature, including developing business 
metrics, conducting user research to improve functionality, and creating 
educational materials to support its widespread use. Additionally, support for 
Kensetsu USD-based pairs within liquidity pools and the order book has been 
worked on. 
Work on the tokenomics upgrade included implementing new chameleon pools, 
improving on the previous iteration, and finalizing requirements for the second 
phase of the implementation. 
With major development on ALT (Aggregate Liquidity Technology) complete, 
extensive testing iterations are ongoing. Education collaterals and feature 
documentation are in the pipeline to showcase its use and features.
The Multi-EVM bridge is undergoing active testing in the development 
environment and will go through security audit, and implementation to support 
bridging to the Binance Smart Chain is ongoing; other EVM-based blockchain 
connections will be announced later.
Development on the bridge between the SORA network and The Open Network 
(TON) is ongoing. The technology research and architecture definition for this 
implementation are steadily ongoing. Support for the TON bridge in the front end, 
the security audit, and testing are ongoing simultaneously. 
Progress on the DeFi-R proof of concept to introduce permissioned finance 
for entities such as Central Banks, Exchanges, and NGOs is notable, with the 
Polkaswap collaboration for a front-end web implementation and test cases and 
activities ongoing.
The ongoing task of opening HRMP channels to other Polkadot ecosystem 
networks has also progressed. Work is ongoing to open a channel to Moonbeam, 
with the proposal currently in their network governance. Conversations and 
governance processes with other networks to open new channels are also ongoing. 
Additional work on SORA Substrate infrastructure includes updating the Polkadot 
SDK and implementing Ink! Smart contract support, and research to update the 
structure of Assets for better upgradeability in the future. 
1 SORA (Substrate) - 5,759 hrs 

4SORA MEMO
Collaboration and blockchain architecture research for SORA v3, including 
integration or interoperability with Central Bank networks, is ongoing. 
Finally, ongoing project management activities include SORA Governance and 
Technical committee support, quality assurance ops, and development support for 
external teams building on the SORA network.
On the mobile side, testing of SORA Card Phase 2 is underway, integrating the fiat 
wallet feature and optimising cross-communication of the fiat wallet application 
to the SORA wallet, integrating the final set of updates required from external 
partners, and working on improvements to the KYC flow. 
1.1 SORA Backend
• Kensetsu:
• Research and brainstorming for the subsequent iterations for augmenting and 
improving the product;
• Continuous improvement of the implementation;
• Development of business metrics for monitoring products;
• Collaborating with the marketing team on education initiatives.
• Tokenomics Upgrade:
• Implement new Chameleon pools;
• Finalise requirements for the second phase of the upgrade.
• Multi-EVM Bridge:
• Testing the bridge;
• Researching and implementing support for Binance Smart Chain (BSC).
• TON Bridge:
• Technology research and definition of architecture;
• Implementing support for the bridge to TON;
• Testing bridge;
• Auditing security.
• Aggregate Liquidity Technology (ALT):
• Testing and fixing activities;
• Writing an article and documentation.

5SORA MEMO
• DeFi-R Proof of Concept:
• Collaboration with the Polkaswap team for implementation on the Web;
• Writing test cases and testing activities.
• Others:
• Brainstorming improvements on the structure of assets: ExtendedAssets;
• Upgrading Polkadot SDK version to v1.11.0;
• Implementing support for Ink! Smart contract;
• Implementing support for KUSD-based pairs in the liquidity pools and KUSD-
quoted orders in the Order Book.
• Collaborating with the SORA Builders (Ceres, Palmatrix teams) and providing 
technical support to the community;
• Collaborating with private companies and implementing Proof of Concept 
projects on SORA;
• Codebase maintenance, cleaning, and optimisation;
• Collaboration and research on blockchain architecture for central banks powered 
by SORA (SORA v3);
• Project management activities (daily meetings, planning, retrospectives);
• Quality assurance and testing activities, as well as the development of 
automated tests.
1.2 Mobile Apps
• Testing Phase 2:
• Updating implementation based on changes from external partners;
• Integration of fiat wallet application;
• cross-app communication between SORA and Fiat wallets;
• Improvements in KYC flow.
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities;
• Communicated and synchronized with external partners for SORA Card: Phase 2.

6SORA MEMO
Polkaswap has received a substantial amount of ongoing improvements, including:
• HASHI Bridge: Curio network support (XOR, VAL, PSWAP, CGT, KSM tokens);
• HASHI Bridge: TON integration;
• Aggregate Liquidity Technology (ALT) support:
• Added ALT implementation to the substrate-js library;
• Integrated ALT support on the Swap page.
• Added widget Picture-in-Picture support;
• Point System improvements:
• New criteria have been developed;
• Improved indexer logic (new data includes governance, order book, liquidity 
provision, XOR Native staking, Kensetsu, and deposits).
• Defi-R implementation:
• Improved the Asset Owner page;
• Improved token creation flows for regular, NFT, SBT, and regulated assets;
• Added SBT and regulated asset management tools for financial institutions;
• Added regulated assets support (a new type of token) for user-owned SBT;
• Improved the search feature for Kensetsu stats;
• Added a new loader on the bridge transactions view;
• Updated methods to connect/disconnect an Ethereum wallet;
• Enhanced swap page styles;
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities.
2 Substrate (PSWAP) - 735 hrs

7SORA MEMO
3 DevOps and Security - 467 hrs
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
3.1 SORA Blockchain
• Improved CI/CD pipeline:
• PR generator
• Internal security audit for:
• TON bridge
3.2 Parachain
• Improved CI/CD pipeline:
• PR generator
3.3 Polkaswap
• Improved CI/CD pipeline
• Working on fault tolerance
3.4 Mobile Clients
• Updated CI/CD pipeline
• Super Wallet CI/CD;
• Upgraded autotests pipelines; 
• Improved library.
3.5 SORA Card
• Working on Infrastructure hardening

8SORA MEMO
Educational operations this month included: 
4.1 SORA
• Ecosystem Update; 
• Ongoing wiki Improvements;
• Social media management;
• SORATOPIA Campaign including:
• Collaboration with other Telegram games;
• Strategic Growth and SMM.
• Weekly network digest recap;
• Relationship management with parachain teams to open HRMP channels;
• Discussions with potential partners to integrate their services into the SORA wallet 
and integrate SORA DeFi services into their product;
• Alignment and coordination for business-oriented initiatives;
• Ongoing SORA wiki maintenance and feature documentation covering new 
releases for users and builders;
• Cross-team, cross-department synchronization and planning on processes;
• Product-Marketing collaboration on marketing campaigns;
• Product-education collaboration on campaigns;
• Data analysis of the network and ecosystem to drive data-driven decision-making;
• Meeting and brainstorming with builders partners for implementing projects 
on SORA;
• Brainstorming, strategising, and planning for SORA v3;
• SORA evangelisation at industry events and conferences.
4.2 Polkaswap
• Ecosystem update;
• Social media management;
• Kensetsu education series;
• Polkaswap Point system launch;
• Polkaswap dApp update coverage.
• Expenses of attending high-impact in-person events and business-to-government 
(B2G) meetings.
4 Education - 755 hr 

9SORA MEMO
5 Total Hours - 7,725 hr
Additionally, invoice 900107, attached, pertains to cloud server costs for 
August 2024.
Your ongoing support is greatly appreciated, and we look forward to continuing 
to serve you.
Sincerely, 
SORAMITSU Helvetia AG
The SORA Ecosystem Updates, published on October 1, and the Polkaswap 
updates on October 1 present supporting concept updates. 

SORA TRUST
 
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSora Trust13 September 2024ST900107
ProjectDue Date
Cloud Service Provider Cost for August 20244 October 2024
DescriptionAmount (CHF)
Cloud Service Provider Cost for August 2024
13,396.00
Subtotal13,396.00
Tax0.00
Total Amount Due
CHF 13,396.00
* Payment can be made in equivalent vXOR, at the market rate.
Wallet Address : cnWP3DYJ5afJZaZsvJ84REqBjqLDRbknejXtCqzj5DC6eQX1R
Thank you very much for your business. We are looking forward to serving you again.

SORA TRUST
 
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSora Trust13 September 2024ST900108
ProjectDue Date
Development Cost for August 20244 October 2024
Description
Quantity 
(Work-Hours)Unit Price (CHF)Amount (CHF)
SORA (Backend, Mobile Apps)5,759333.00
1,917,747.00
Polkaswap (Backend, Frontend)735333.00
244,755.00
DevOps and Security Review476333.00
158,508.00
Education755333.00
251,415.00
Subtotal7,725.00333.002,572,425.00
Subtotal2,572,425.00
Tax0.00
Amount Due
CHF 2,572,425.00
Grand Total Due (Invoice ST900107 & ST900108)CHF 2,585,821.00
* Payment can be made in equivalent vXOR, at the market rate.
Wallet Address :cnWP3DYJ5afJZaZsvJ84REqBjqLDRbknejXtCqzj5DC6eQX1R
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Co. Ltd. 
Link Square Shinjuku 16F,
5-27-5, Sendagaya, 
Shibuya-ku, Tokyo, 
Japan, 151-0051
info@soramitsu.co.jp 
soramitsu.co.jp
