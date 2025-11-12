---
title: Community Memo – SORA Community Memo 2024 October
slug: sora-community-memo-2024-october
source: community-memo
source_url: 'internal://soranauts/community-memos/2024/sora-community-memo-2024-october'
publishDate: '2025-11-12T02:04:19.845Z'
updateDate: '2025-11-12T02:04:19.845Z'
content_sha256: cbc4f51badb7466182faed9c935c9dedb5dfc31b052f848bcc8105c1308c1317
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2024 October

A MEMO TO THE 
SORA COMMUNITY
OCTOBER 2024

2SORA MEMO
This document accompanies the invoice sent to SORA for the 
services provided by SORAMITSU. 
October 2024 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for the 
SORA network development pipeline, and the progress rate 
has steadily advanced. 
This memo will provide a perspective on the activities 
for each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 900112 served to the 
SORA Community.

3SORA MEMO
This month’s work focuses on the tokenomics upgrade, Kensetsu, the Multi EVM 
bridge, the TON bridge, ALT Technology, and the RegDeFi proof of concept. 
The Kensetsu platform development is currently focused on monitoring business 
metrics, and educational materials are being crafted to foster widespread use.
Work on the tokenomics upgrade included the vXOR DEX base pair 
implementations, buy-back and burn strategies for supply mitigation, and the 
redenomination mechanisms for vXOR. 
ALT (Aggregate Liquidity Technology, released last month is ongoing testing and 
maintenance for smooth and optimum functionality. Documentation is being 
crafted for the SORA wiki and education collaterals.
Work on the Multi-EVM bridge focuses on addressing the security audit. Binance 
Smart Chain support is progressing, and implementation research and testing 
transfers between SORA and BSC are actively ongoing.
The bridge to TON (The Open Network) is actively being worked on. 
The architecture and technology have been defined, and work is ongoing to 
implement bridge support and test bridge functionality. The security audit 
was completed, and the feedback is being implemented. In tandem, work is 
ongoing with SORATOPIA for client development. 
RegDeFi (formerly DeFi-R) development is in the final stages, QA feedback is 
being addressed, and work is ongoing with the Polkaswap team for a front-end 
implementation. There are more test cases in the pipeline, and shortly thereafter, 
the feature will be released on production, with potential use cases lined up.
The HRMP proposal to Moonbeam was sniped, and with the connection rejected, 
this process can be considered complete. The focus is now on optimising the 
Asset Hub connection to facilitate asset transfers but working on the parachain 
fees (introduced as Polkadot Asset Hub Bridge), additionally, the crowdloan reward 
distribution needs to be prepared.
Additional work on SORA Substrate infrastructure includes documentation on the 
asset structure, known internally as ExtendedAssets, updating the Polkadot SDK to 
v1.11.0 and testing the implementation, as well as infrastructure maintenance for the 
pricing server and price tools. This final point may cause some visual bugs on price 
aggregating platforms, but these are not cause for concern. 
1 SORA (Substrate) - 5,502 hrs 

4SORA MEMO
Collaboration and blockchain architecture research for SORA v3, including 
integration or interoperability with Central Bank networks, is ongoing. Additionally, 
a feature to add vesting token transfers (to gradually release funds), XOR-less 
transactions (allowing any token use), and multi-signature accounts to Polkaswap 
are under steady development.
Finally, ongoing project management activities include SORA Governance and 
Technical committee support, quality assurance ops, and development support 
for external teams building on the SORA network.
On the mobile side, updates for SORA Card Phase 2 are underway, implementing 
changes from external partners, integrating the fiat wallet feature and optimising 
cross-communication of the fiat wallet application to the SORA wallet, and working 
on improvements to the KYC flow.
1.1 SORA Backend
• Kensetsu:
• Development of business metrics for monitoring products;
• Collaborating with the marketing team on education initiatives.
• Tokenomics Upgrade:
• Brainstorming implementation and improvements for DEX base pairs (vXOR);
• Implementation of strategy updates for buyback-and-burn mechanism;
• Implementation of vXOR redenomination.
• Multi-EVM Bridge:
• Working on feedback from the security audit;
• Researching and implementing support for Binance Smart Chain (BSC);
• Testing bridge activities (SORA<>BSC).
• TON Bridge:
• Technology research and definition of architecture;
• Implementing support for the bridge to TON;
• Testing bridge activities;
• Implementing fixes from the security audit;
• Synchronization with the SORATOPIA team for client implementation.

5SORA MEMO
• Aggregate Liquidity Technology (ALT):
• Testing and fixing activities;
• Writing documentation.
• RegDeFi Proof of Concept:
• Implementation and fixing of implementation from QA feedback;
• Collaboration with the Polkaswap team for implementation on the Web;
• Testing activities;
• Release functionality on production.
• Parachain:
• Implementation and testing of HRMP channel to AssetHub;
• Work on the parachain fees;
• Brainstorm solution for distribution of crowdloan rewards.
• Builders:
• Implementation and improvement of the vesting feature for projects 
with builders;
• Implementation and improvement of the multi-signature accounts feature for 
a project with builders;
• Implementation of a set of XORless transactions for a project with builders;
• Brainstorming solutions and presentation to institutional builders for SORA.
• Others:
• Documentation on the structure of assets: ExtendedAssets and brainstorming 
synergies for features for builders;
• Upgrading Polkadot SDK version to v1.11.0 with testing activities;
• Maintenance of infrastructure (pricing server, price tools, nodes).
• Codebase maintenance, cleaning, and optimisation;
• Collaboration and research on blockchain architecture for central banks powered 
by SORA (SORA v3);
• Project management activities (daily meetings, planning, retrospectives);
• Quality assurance and testing activities, as well as the development of 
automated tests.

6SORA MEMO
1.2 Mobile Apps
• Testing and updating Phase 2:
• Updating implementation based on changes from external partners;
• Integration of fiat wallet application;
• Cross-app communication between SORA and Fiat wallets;
• Improvements in KYC flow.
• Maintenance of middle-ware for communication with partners’ back-end;
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities;
• Communicating and synchronizing with external partners for SORA Card: Phase 2;
• Collaborating with Fearless Wallet for integration.

7SORA MEMO
2 Substrate (PSWAP) - 932 hrs
Polkaswap has received a substantial amount of ongoing improvements, including: 
• Added Vested Transfer support;
• Enabled Aggregate Liquidity Technology (ALT);
• Supported VXOR as based asset for liquidity and orderbook pairs;
• Developed theme auto detection and system mode;
• Multi-signature Accounts and Transactions support;
• Connect Wallets Redesign:
• Added auto detect of Substrate and EVM wallets;
• Added predefined and recommended wallets of Substrate and EVM wallets;
• Simplified the user’s flow during the connection of wallets;
• Implemented new settings with “hide balances” by rotating the screen in Telegram 
Mini App;
• Improved Assets Management:
• “Add multiple assets” support;
• Added favourite assets;
• New assets filters support.
• Added new filter for periods of chart-based widgets;
• Developed new dialogs for Add & Remove liquidity;
• Improved theme changes in Telegram Mini App;
• Enhanced Swap page styles & widgets;
• Refined supported languages;
• Prepared backbone for Point System Upgrade;
• Enhanced Polkaswap loading:
• Removed duplicated styles;
• Optimized lazy loading for core components;
• Improved app loading life cycle.
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities.

8SORA MEMO
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
3.1 SORA Blockchain
• Improved CI/CD pipeline:
• Improved library
• New alerting rules;
• In progress: 
• TON bridge testing and deployment.
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
• Apple App Store management;
• New version deployed;
• Working on Infrastructure hardening.
3 DevOps and Security - 514 hrs

9SORA MEMO
4 Education - 815 hr 
Educational operations this month included: 
4.1 SORA
• Ongoing wiki Improvements;
• Social media management;
• SORATOPIA Campaign including;
• Collaboration with other Telegram games;
• Strategic Growth and SMM.
• Weekly network digest recap;
• Aggregate Liquidity Technology campaign including: 
• Article
• AMA
• SORA network upgrade communications;
• Discussions with potential partners to integrate their services into the 
SORA Wallet and integrate SORA DeFi services into their product;
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
• Social media management;
• Polkaswap version upgrade communications;
• Asset Owner feature communications;
• Polkaswap Telegram mini app promotion.
• Expenses of attending high-impact in-person events and business-to-government 
(B2G) meetings.

10SORA MEMO
5 Total Hours - 7,763 hr
Additionally, invoice 900111, attached, pertains to cloud server costs for 
October 2024.
Your ongoing support is greatly appreciated, and we look forward to continuing 
to serve you.
Sincerely, 
SORAMITSU Helvetia AG

SORA TRUST
 
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSora Trust15 November 2024ST900111
ProjectDue Date
Cloud Service Provider Cost for October 202422 November 2024
DescriptionAmount (CHF)
Cloud Service Provider Cost for October 2024
14,866.00
Subtotal14,866.00
Tax0.00
Total Amount Due
CHF 14,866.00
* Payment can be made in equivalent KUSD, at the market rate.
Wallet Address :cnRus2m2Rn776v88H5RUtyiaXtr3daN6ePn6yenLKepx1SqYo
Thank you very much for your business. We are looking forward to serving you again.

SORA TRUST
 
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSora Trust15 November 2024ST900112
ProjectDue Date
Development Cost for October 202422 November 2024
Description
Quantity 
(Work-Hours)Unit Price (CHF)Amount (CHF)
SORA (Backend, Mobile Apps)5,502333.00
1,832,166.00
Polkaswap (Backend, Frontend)932333.00
310,356.00
DevOps and Security Review514333.00
171,162.00
Education815333.00
271,395.00
Subtotal7763333.002,585,079.00
Subtotal2,585,079.00
Tax0.00
Amount Due
CHF 2,585,079.00
Grand Total Due (Invoice ST900111 & ST900112)CHF 2,599,945.00
* Payment can be made in equivalent KUSD, at the market rate.
Wallet Address :cnRus2m2Rn776v88H5RUtyiaXtr3daN6ePn6yenLKepx1SqYo
Thank you very much for your business. We are looking forward to serving you again.
