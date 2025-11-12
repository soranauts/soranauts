---
title: Community Memo – SORA Community Memo 2024 September
slug: sora-community-memo-2024-september
source: community-memo
source_url: 'internal://soranauts/community-memos/2024/sora-community-memo-2024-september'
publishDate: '2025-11-12T02:04:19.829Z'
updateDate: '2025-11-12T02:04:19.829Z'
content_sha256: 71510d5cabd9f98e4b6a2d242890eaebae8e3e259632a55eb7350286423eef21
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2024 September

A MEMO TO THE 
SORA COMMUNITY
SEPTEMBER 2024

2SORA MEMO
This document accompanies the invoice sent to SORA for the 
services provided by SORAMITSU. 
September 2024 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for the 
SORA network development pipeline, and the progress rate 
has steadily advanced. 
This memo will provide a perspective on the activities 
for each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 900110 served to the 
SORA Community.

3SORA MEMO
This month’s work focuses on the tokenomics upgrade, Kensetsu, the Multi EVM 
bridge, the TON bridge, ALT Technology, and the RegDeFi proof of concept. 
The Kensetsu platform is constantly improving, progress on business metrics 
development is ongoing, and educational materials are being crafted to foster 
widespread use. Additionally, support for Kensetsu USD-based pairs within 
liquidity pools and the order book is being worked on. 
Work on the tokenomics upgrade included removing chameleon pools and 
finalizing requirements for the second phase of the implementation. 
The implementation of the ALT (Aggregate Liquidity Technology) has been 
released, and extensive testing iterations are ongoing. Education collaterals and 
feature documentation to showcase its use and features are in progress, along 
with optimising liquidity sources within the network for compatibility.
The Multi-EVM bridge is still being actively tested in the development environment. 
The security audit has been completed, and the feedback raised is being worked 
on. An implementation to support bridging to the Binance Smart Chain is ongoing.
Development on the bridge between the SORA network and The Open Network 
(TON) is ongoing. The technology research and architecture definition for this 
implementation is almost complete. Support for the TON bridge in the front end, 
the security audit, and testing are ongoing simultaneously. 
Progress on the RegDeFi (formerly DeFi-R) proof of concept is steady. QA work 
is currently underway, and a collaboration with Polkaswap for a front-end web 
implementation and test cases is ongoing.
Opening HRMP channels to other Polkadot ecosystem networks has made 
steady progress. Their governance approved the proposal to open a channel to 
Moonbeam, which is now on the OpenGov platform. The outcome is currently in 
favour of opening the chain. Conversations and governance processes with other 
networks to open new channels are also ongoing. A bridge to the Polkadot Asset 
Hub is currently under development, with testing and implementation ongoing.
1 SORA (Substrate) - 4,865 hrs 

4SORA MEMO
Additional work on SORA Substrate infrastructure includes updating the Polkadot 
SDK and implementing Ink! Smart contract support and research are needed to 
update the structure of assets for better upgradeability in the future. 
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
• Continuous improvement of the implementation;
• Development of business metrics for monitoring product;
• Collaborating with the Marketing team on initiatives for education.
• Tokenomics Upgrade:
• Remove Chameleon pools;
• Work on the requirements for the second phase of the upgrade.
• Multi-EVM Bridge:
• Testing the bridge;
• Working on feedback from the security audit;
• Researching and implementing support for Binance Smart Chain (BSC).
• TON Bridge:
• Technology research and definition of architecture;
• Implementing support for the bridge to TON;
• Testing bridge;
• Going through a security audit.

5SORA MEMO
• Aggregate Liquidity Technology (ALT):
• Testing and fixing activities;
• Writing documentation and article.
• RegDeFi Proof of Concept:
• Implementation and fixing of implementation from QA feedback;
• Collaboration with Polkaswap team for implementation on Web;
• Testing activities.
• Builders:
• Establishing requirements for features for project with builders;
• Implementation and improvement of the vesting feature for a project 
with builders;
• Implementation and improvement of the multi-signature accounts feature for a 
project with builders.
• Others:
• Documentation on the structure of assets: ExtendedAssets;
• Upgrading Polkadot SDK version to v1.11.0;
• Implementing support for Ink! Smart contract;
• Implementation and testing of bridge to AssetHub;
• Implementation of SB token and Kensetsu vaults;
• Brainstorming for implementation and improvements for DEX base pairs.
• Codebase maintenance, cleaning, and optimisation;
• Collaboration and research on blockchain architecture for central banks powered 
by SORA (SORA v3);
• Project management activities (daily meetings, planning, retrospectives);
• Quality assurance and testing activities, as well as the development of 
automated tests.
1.2 Mobile Apps
• Testing and updating Phase 2:
• Updating implementation based on changes from external partners;
• Integration of fiat wallet application;
• Cross-app communication between SORA and Fiat wallets;
• Improvements in KYC flow.

6SORA MEMO
• Maintenance of middle-ware for communication with partners’ back-end;
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities;
• Communicating and synchronizing with external partners for SORA Card: Phase 2;
• Collaborating with Fearless Wallet to integrate.

7SORA MEMO
2 Substrate (PSWAP) - 802 hrs
Polkaswap has received a substantial amount of ongoing improvements, including: 
• HASHI Bridge: TON integration;
• Connect Wallets Redesign:
• Added Substrate and EVM wallets auto-detect;
• Added predefined and recommended Substrate and EVM wallets;
• Simplified the user’s flow during wallet connection;
• Prepared the mainnet release supporting Aggregate Liquidity Technology (ALT);
• Improvements to the Point System:
• Started the calculations for the mainnet version of the Subquery indexer with 
new criteria (governance, order book, liquidity provision, XOR Native staking, 
Kensetsu, deposits);
• Worked on integrating the new criteria.
• RegDeFi integration:
• Overall Polkaswap migration from assetInfo to assetInfo v.2;
• Fixed UI issues from the public testnet version;
• Prepared for the mainnet release.
• Implemented Hide balances by rotating the screen feature for the Telegram 
Mini App;
• Improved Asset Management:
• “Add multiple assets” support;
• Added favourite assets;
• New asset filters support (Native, Kensetsu, Synthetics, CERES).
• Developed New Settings side menu;
• Added a new period filter for chart-based widgets;
• Integrated New dialogues to Add & Remove liquidity;
• Improved theme changes in the Telegram Mini App;
• Enhanced Swap page styles & widgets;
• Enhanced swap page styles;
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities.

8SORA MEMO
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
3.1 SORA Blockchain
• Improved CI/CD pipeline:
• Improved library
• New alerting rules.
3.2 Parachain
• Improved CI/CD pipeline:
• Improved library
3.3 Polkaswap
• Improved CI/CD pipeline;
• Working on fault tolerance.
3.4 Mobile Clients
• Updated CI/CD pipeline:
• Super Wallet CI/CD;
• Upgraded autotests pipelines; 
• Improved library.
3.5 SORA Card
• Google account and apps management;
• Working on Infrastructure hardening.
3 DevOps and Security - 476 hrs

9SORA MEMO
4 Education - 702 hr 
Educational operations this month included: 
4.1 SORA
• Ongoing wiki Improvements;
• Social media management;
• KEN and KARMA reward communications;
• SORATOPIA Campaign including:
• Collaboration with other Telegram games;
• Strategic Growth and SMM.
• Weekly network digest recap;
• Curio DAO AMA;
• vXOR campaign including: 
• Article;
• AMA.
• SORA network upgrade communications;
• ISO 20022 informative article;
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

10SORA MEMO
4.2 Polkaswap
• Social media management;
• Polkaswap v1.40 communications;
• KBTC listing communications;
• Picture-in-picture feature communications;
• Polkaswap Telegram mini app promotion.
• Expenses of attending high-impact in-person events and business-to-government 
(B2G) meetings.

11SORA MEMO
5 Total Hours - 6,665 hr
Additionally, invoice 900109, attached, pertains to cloud server costs for 
September 2024.
Your ongoing support is greatly appreciated, and we look forward to continuing 
to serve you.
Sincerely, 
SORAMITSU Helvetia AG

SORA TRUST
 
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSora Trust15 October 2024ST900109
ProjectDue Date
Cloud Service Provider Cost for September 202422 October 2024
DescriptionAmount (CHF)
Cloud Service Provider Cost for September 2024
11,954.00
Subtotal11,954.00
Tax0.00
Total Amount Due
CHF 11,954.00
* Payment can be made in equivalent KUSD, at the market rate.
Wallet Address : cnRus2m2Rn776v88H5RUtyiaXtr3daN6ePn6yenLKepx1SqYo
Thank you very much for your business. We are looking forward to serving you again.

SORA TRUST
 
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSora Trust15 October 2024ST900110
ProjectDue Date
Development Cost for September 202422 October 2024
Description
Quantity 
(Work-Hours)Unit Price (CHF)Amount (CHF)
SORA (Backend, Mobile Apps)4,685333.00
1,560,105.00
Polkaswap (Backend, Frontend)802333.00
267,066.00
DevOps and Security Review476333.00
158,508.00
Education702333.00
233,766.00
Subtotal6665333.002,219,445.00
Subtotal2,219,445.00
Tax0.00
Amount Due
CHF 2,219,445.00
Grand Total Due (Invoice ST900109 & ST900110)CHF 2,231,399.00
* Payment can be made in equivalent KUSD, at the market rate.
Wallet Address :cnRus2m2Rn776v88H5RUtyiaXtr3daN6ePn6yenLKepx1SqYo
Thank you very much for your business. We are looking forward to serving you again.
