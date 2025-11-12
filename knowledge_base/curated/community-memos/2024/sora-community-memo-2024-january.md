---
title: Community Memo – SORA Community Memo 2024 January
slug: sora-community-memo-2024-january
source: community-memo
source_url: 'internal://soranauts/community-memos/2024/sora-community-memo-2024-january'
publishDate: '2025-11-12T02:04:19.896Z'
updateDate: '2025-11-12T02:04:19.896Z'
content_sha256: e9faa482aeb96cc62f90ad55eb680537b78791989c725d9dbc101b19ee6081f9
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2024 January

1SORA MEMO
A MEMO TO THE 
SORA COMMUNITY
JANUARY 2024

2SORA MEMO
This document accompanies the invoice sent to SORA for 
the services provided by SORAMITSU. 
January 2024 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for the 
SORA network development pipeline, and the progress rate 
has steadily advanced. 
This memo will provide a perspective on the activities for 
each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 205053 served by 
Soramitsu Helvetia to the SORA Community.

3SORA MEMO
This month's work is spread across the Substrate bridge, Orderbook 
implementation, ALT Technology, documentation, and Kensetsu.
On the Substrate bridge front, there are two areas of focus; on one hand, the bridge 
connecting the SORA Polkadot parachain was implemented, and additional work 
was carried out to adjust the bridge for compatibility with Polkadot tokenomics. 
On the other side, work on the bridge to a non-parachain Substrate network was 
carried out, in collaboration with the network’s team to prepare for public testing.
The Order book is almost ready, and Market Makers are being onboarded ahead of 
the mainnet launch. Support was provided for developing a front-end UI on the 
client application. 
The first iteration of the Kensetsu platform is nearing completion, with work this 
month mainly focusing on an intuitive user experience. Research on risks and 
mitigation strategies, focusing on avoiding cascading liquidation, is ongoing. 
Work on implementing Aggregate Liquidity Technology is ongoing. Technical 
debt is being addressed to enable easy integration of new liquidity sources into 
the smart swap algorithm - first in line the upcoming Orderbook liquidity 
source, and XYK and XST liquidity sources initialisation mechanism is under 
active development.
Opening HRMP channels to other Substrate networks has been a focus this 
month. Moonbeam Alphanet testing is in progress, while channel opening to Acala 
(Polkadot), Karura (Kusama), and Astar has progressed community governance and 
is undergoing testing at different stages. 
A network-wide issue regarding Kusama token transfer caused by the recent 
runtime upgrade is being addressed, and the impact on the SORA Kusama 
parachain is being investigated.
Finally, ongoing project management activities include SORA Governance and 
Technical committee support, quality assurance ops and development support to 
external teams building on the SORA network.
1 SORA (Substrate) - 4,770hrs 

4SORA MEMO
On the mobile side, two releases were worked on this month: 
• 3.8.1 Released. Introduces Demeter Farm management, with staking/unstaking 
liquidity and claiming liquidity mining rewards now possible. 
• 3.8.2 In Progress. This version provides fixes and improvements for the features 
released in 3.8.1 and introduces the history of ADAR and bridge transactions 
and KYC improvements for SORA Card.
As well as project management activities, systems analysis, UI/UX improvements 
and quality assurance. 
1.1 SORA Backend
• Order book:
• Synchronizing with the market makers for the launch on production;
• Supporting front-end team for implementation of UI.
• Kensetsu:
• Synchronizing with the Product Design and front-end teams to ensure the 
implementation is user-oriented;
• Research risks and mitigation strategies for the platform 
(cascading liquidation mechanism).
• Aggregate Liquidity Technology (ALT):
• Working on the technical debt;
• Working on the initialisation of liquidity sources (XYK, XST).
• Substrate bridge to sovereign state:
• Adapting the implementation of the Substrate bridge to the Kusama parachain to 
connect to a non-parachain Substrate-based network;
• Synchronization with the sovereign state’s team to release the implementation for 
public testing.
• HRMP channels:
• Testing transfers between SORA and Moonbeam;
• Setting up transfers with Acala, Astar, AssetHub;
• Synchronization with other parachain teams interested in setting up HRMP 
channels with SORA.
• Update of the PolkadotSDK to version 1.1.0;
• Investigation of the Kusama issue and impact on Substrate bridge to SORA 
Kusama parachain;

5SORA MEMO
• Verification and testing of tokenomics implementation (TBCD, VAL);
• Codebase maintenance, cleaning, and optimisation;
• Collaboration and research on blockchain architecture for central banks 
powered by SORA;
• Project management activities (daily meetings, planning, retrospectives);
• Quality Assurance and testing activities, development of automated tests.
1.2 Mobile App
• Implemented and released version 3.8.1 - Demeter Farming: Phase 2
• Stake / Unstake your liquidity on Demeter farms
• Claim your rewards accumulated from staking liquidity on farms
• Implemented version 3.8.2
• Fixes and improvements for version 3.8.1
• Adding transaction history for transactions from ADAR
• Adding transaction history for bridge transactions
• Update of partners’ SDK (SORA Card)
• Improvement of KYC flow (SORA Card)
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities;
• Communicated and synchronized with external partners for SORA Card: Phase 2;
• Preparation of scope, business and technical requirements for SORA Card: Phase 3.

6SORA MEMO
Polkaswap has received a substantial amount of ongoing improvements, including: 
• Orderbook user interface (new features, bug fixes);
• Explore page: Orderbook section implementation (UI, Subquery and Subsquid data 
availability in progress);
• Trade page: new views, full customization;
• Added trading volume for single tokens (charts on Swap & Trade pages, Subquery 
and Subsquid data availability in progress);
• XOR native staking enhancements (redeem flow, UX optimisation);
• A SORA Card maintenance page has been added for future work-in-progress tasks;
• Kensetsu TypeScript API preparation;
• Hashi Bridge improvements:
• Improved HASHI Substrate bridge to Kusama 
(addressing Kusama’s fee-related and network connection issues);
• SORA to Polkadot network support for DOT tokens;
• SORA to SORA Polkadot parachain network support for XOR tokens;
• New network support;
• Quality of life improvements such as:
• Added a 6M (6 months) filter for the Polkaswap stats page
• Improved routing for the SORA staking page;
• Corrected staking balance formatting;
• Improved zh_CN translation strings;
• Product Design activities;
• Project management activities (daily meetings, planning, retrospectives);
• Quality Assurance and testing activities.
2 Substrate (PSWAP) - 955 hrs

7SORA MEMO
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
3.1 SORA Blockchain
• New alerting rules for:
• Bridges
• Network suspicious activity
• Enhanced Bridge security bot
• Improved CI/CD pipeline
• Improve CI/CD for the Liberland environment
• Improved Subsquid and Subquery alerting system
• Deployed Polkadot parachain environment
• In progress: 
• 95% Alphanet parachain dev environment
• 80% Trivy reports integration to DefectDojo
3.2 Parachain
• Improved CI/CD pipeline
• SAST config improved
• A new version has been released and deployed
3.3 Polkaswap
• Improved CI/CD pipeline
• New alert rules
• New automation scripts
• Working on fault tolerance
3 DevOps and Security - 473 hrs

8SORA MEMO
3.4 Mobile Clients
• Updated CI/CD pipeline
• New autotests
• Library improved
• New SAST implemented for Kotlin
• New SAST reports integrated to DefectDojo
3.5 SORA Card
• Improved CI/CD
• Working on Infrastructure hardening

9SORA MEMO
4 Education - 785 hr 
Educational operations this month included: 
4.1 SORA
• Ecosystem Update; 
• Documenting business description and technical implementation for 
the initiatives (Order book);
• Ongoing wiki Improvements;
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment);
• SORA Demeter Farming Mobile release communications;
• Product-Marketing collaboration on the marketing campaign for the Order book;
• Relationship management with parachain teams to open HRMP channels;
• Continuous maintenance and documentation of the implementation and vision of 
SORA in the wiki;
• Discussions with potential partners to integrate their services into the SORA wallet 
and integrate SORA DeFi services into their product;
• Continuous maintenance and documentation of the implementation and vision of 
SORA in the wiki;
• SORA evangelisation at industry events and conferences.
4.2 Polkaswap
• Ecosystem Update;
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment);
• Orderbook launch preparation;
• SORA Polkadot Substrate bridge communications; 
• Bridge to a sovereign government education campaign preparation.
• Attending high-impact in-person events and business to government 
(B2G) expenses.

10SORA MEMO
5 Total Hours - 6,983 hr
Additionally, invoice 205052, attached, pertains to cloud server costs for 
January 2024.
All SORA Ecosystem Memo payments provide collateral to the Token 
Bonding Curve.
Your ongoing support is greatly appreciated, and we look forward to continuing 
to serve you.
Sincerely, 
SORAMITSU Helvetia AG
Supporting concept updates are presented in the SORA Ecosystem Updates 
published on January 29 and Polkaswap updates published on January 29 
present supporting concept updates.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG9 February 2024205052
ProjectDue Date
Cloud Service Provider Cost for January 202416 February 2024
DescriptionAmount (USD)
Cloud Service Provider Cost for January 2024
11,990.00
Subtotal$11,990.00
Tax0,00
Total Amount Due
USD $11,990.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW5AsJM5rjbiow8TsJYChMcT7RCCqZRGy8Pa8WKrKPokkwg3
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG9 February 2024205053
ProjectDue Date
Development Cost for January 202416 February 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)4,770369.00
1,760,130.00
Polkaswap (Backend, Frontend)955369.00
352,395.00
DevOps and Security Review473369.00
174,537.00
Education785369.00
289,665.00
Subtotal6,983.00$369.00$2,576,727.00
Subtotal$2,576,727.00
Tax$0.00
Amount Due
USD $2,576,727.00
Grand Total Due (Invoice 205052 & 205053)USD $2,588,717.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW5AsJM5rjbiow8TsJYChMcT7RCCqZRGy8Pa8WKrKPokkwg3
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG9 February 2024205053
ProjectDue Date
Development Cost for January 202416 February 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)4,770369.00
1,760,130.00
Polkaswap (Backend, Frontend)955369.00
352,395.00
DevOps and Security Review473369.00
174,537.00
Education785369.00
289,665.00
Subtotal6,983.00$369.00$2,576,727.00
Subtotal$2,576,727.00
Tax$0.00
Amount Due
USD $2,576,727.00
Grand Total Due (Invoice 205052 & 205053)USD $2,588,717.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW5AsJM5rjbiow8TsJYChMcT7RCCqZRGy8Pa8WKrKPokkwg3
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG9 February 2024205053
ProjectDue Date
Development Cost for January 202416 February 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)4,770369.00
1,760,130.00
Polkaswap (Backend, Frontend)955369.00
352,395.00
DevOps and Security Review473369.00
174,537.00
Education785369.00
289,665.00
Subtotal6,983.00$369.00$2,576,727.00
Subtotal$2,576,727.00
Tax$0.00
Amount Due
USD $2,576,727.00
Grand Total Due (Invoice 205052 & 205053)USD $2,588,717.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnW5AsJM5rjbiow8TsJYChMcT7RCCqZRGy8Pa8WKrKPokkwg3
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Co. Ltd. 
Link Square Shinjuku 16F,
5-27-5, Sendagaya, 
Shibuya-ku, Tokyo, 
Japan, 151-0051
info@soramitsu.co.jp 
soramitsu.co.jp
