---
title: Community Memo – SORA Community Memo 2024 February
slug: sora-community-memo-2024-february
source: community-memo
source_url: 'internal://soranauts/community-memos/2024/sora-community-memo-2024-february'
publishDate: '2025-11-12T02:04:19.912Z'
updateDate: '2025-11-12T02:04:19.912Z'
content_sha256: 61a193b1f25d976f2606882e71fff2204e88f48166fe64f126d6339186e43e43
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2024 February

1SORA MEMO
A MEMO TO THE 
SORA COMMUNITY
FEBRUARY 2024

2SORA MEMO
This document accompanies the invoice sent to SORA 
for the services provided by SORAMITSU. 
February 2024 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for the 
SORA network development pipeline, and the progress rate 
has steadily advanced. 
This memo will provide a perspective on the activities 
for each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 205055 served by 
Soramitsu Helvetia to the SORA Community.

3SORA MEMO
This month’s work involves Kensetsu, ALT Technology, the bridge to a sovereign 
state, the Multi EVM bridge, HRMP channels, and the SORA Wiki.
On the Kensetsu front, work is ongoing in collaboration with the front-end team to 
ensure user-oriented implementation. KEN tokenomics are being translated into 
business and technical requirements within the system, and research on risks and 
mitigation strategies, focusing on avoiding cascading liquidation, is ongoing.
Work on upgrading Aggregate Liquidity Technology is ongoing. Progress is being 
made in addressing technical debt, while a mechanism to address the limitations 
of different liquidity sources is being developed. The liquidity.proxy.quote fee 
structure is being updated to accommodate fees in different tokens (XOR, XST, 
XSTUSD), depending on the liquidity source. We will announce the details on the 
change in time to give enough notice to app developers depending on this RPC call 
to ensure smooth operations on the production environment.
There is great progress on the bridge to a sovereign state managed by blockchain 
technology. The Substrate bridge is being adjusted to connect to and support a 
standalone (non-parachain), Substrate-based network. Extensive communication 
is ongoing with the State’s technical team to release the implementation for 
public testing. 
The Multi-EVM bridge is back on the scope, with work ongoing to implement 
the fee structure. 
Opening HRMP channels to other Substrate networks is an ongoing focus. 
An update allowing token transfers between the SORA Polkadot and SORA 
Kusama parachains is in progress. Testing token transfers between SORA and 
Moonbeam on the Moonbeam Alphanet is in progress, while an HRMP channel 
to Acala (Polkadot) has been opened. Karura (Kusama) will be opened next, and 
Shiden and Astar HRMP channels are in progress. 
Additional work on SORA Substrate infrastructure includes updating the Polkadot 
SDK to version 1.1.0, codebase housekeeping, including maintenance, cleaning, and 
optimization, and collaboration and research on blockchain architecture to provide 
SORA support for central banks.
1 SORA (Substrate) - 4,319hrs 

4SORA MEMO
Finally, ongoing project management activities include SORA Governance and 
Technical committee support, quality assurance ops, and development support 
for external teams building on the SORA network.
On the mobile side, one release was worked on this month: 
• 3.8.2 Released. Users can now view their IBAN details on the SORA Card hub, 
support for an updated partner SDK that improves the SMS process during 
SORA card onboarding, as well as an improvement of the KYC flow. Additionally, 
transaction history for ADAR and bridge operations and other fixes and 
improvements are available.
As well as project management activities, systems analysis, UI/UX improvements 
and quality assurance. 
1.1 SORA Backend
• Kensetsu:
• Synchronizing with the Product Design and front-end teams to ensure the 
implementation is user-oriented;
• Research and development of business and technical requirements for the 
KEN tokenomics;
• Research risks and mitigation strategies for the platform 
(cascading liquidation mechanism);
• Implementation of test cases for the platform.
• Aggregate Liquidity Technology (ALT):
• Working on the technical debt;
• Working on the mechanism for limitations for different liquidity sources;
• Updating fee response structure of liquidityProxy.quote to accommodate 
different fees depending on the liquidity source (XOR, XST, XSTUSD).
• Bridge to Sovereign State:
• Adapting the implementation of the Substrate bridge to the Kusama parachain 
to connect to a non-parachain Substrate-based network;
• Synchronization with the sovereign state’s team to release the implementation 
for public testing.
• Multi-EVM Bridge
• Working on the implementation of the fee structure.

5SORA MEMO
• HRMP Channels:
• Working on the update of the parachains to allow transfers of tokens between 
the SORA and Polkadot / Kusama parachains;
• Testing transfers between SORA and Moonbeam;
• Opened HRMP channel with Acala;
• Synchronization with other parachain teams interested in setting up HRMP 
channels with SORA.
• Update of the PolkadotSDK to version 1.1.0;
• Codebase maintenance, cleaning, and optimisation;
• Collaboration and research on blockchain architecture for central banks 
powered by SORA.
• Project management activities (daily meetings, planning, retrospectives);
• Quality assurance and testing activities, as well as the development of 
automated tests.
1.2 Mobile App
• Implemented and Released Version 3.8.2:
• Users can now view their IBAN details on the SORA Card hub;
• No more missing SMS issues during the SORA Card application process - 
update of partners’ SDK (SORA Card);
• Improvement of KYC flow (SORA Card);
• Adding transaction history for transactions from ADAR;
• Adding transaction history for bridge transactions;
• Fixes and improvements.
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities;
• Communicated and synchronized with external partners for SORA Card: Phase 2;
• Preparation of scope, business and technical requirements for SORA Card: Phase 3.

6SORA MEMO
Polkaswap has received a substantial amount of ongoing improvements, including: 
• The Polkaswap.io/#/trade page has been prepared for mainnet release:
• Market Orders: Instant trade execution at the best current price;
• Limit Orders: Set and execute trades at your desired prices;
• Real-time Updates: Keep up with market conditions and trading opportunities, 
accounting for a 6-second delay per block due to on-chain processing;
• Order History Widget: Conveniently track your past trades and current 
order statuses;
• Market Trades Widget: Get a real-time feed of recent trades for immediate 
market insights;
• The Explore page has been improved:
• Orderbook support: added the polkaswap.io/#/explore/books page;
• Added ‘pool tokens’ column for polkaswap.io/#/explore/pools page;
• New responsive explore page menu.
• Charts have been enhanced:
• New filters for charts (5m, 15m, 30m, 1h, 4h, 1D, 1Y, ALL);
• Included Volume metrics for single-token charts;
• Optimized chart performance, reducing re-rendering and requests while 
enhancing zoom and scroll functionality.
• XOR native staking has been improved:
• Enhanced user experience with notifications and loading states during 
transactions in the stake dialogue for XOR native staking;
• Locked XOR balance improvements on the polkaswap.io/#/wallet Wallet page;
• Improved withdrawal process for XOR validator staking rewards.
• Kensetsu development:
• Added the KEN distribution page polkaswap.io/#/kensetsu;
• TypeScript API finalization;
• Mockups preparation;
• Polkaswap Vault page development.
2 Substrate (PSWAP) - 963 hrs

7SORA MEMO
• Ensured a seamless experience with a handy “Reload page” button for wallet 
browser extensions that may not respond;
• Streamlined history updates, minimizing local storage usage for 
smoother navigation;
• Project management activities (daily meetings, planning, retrospectives);
• Product Design activities;
• QA and testing activities.

8SORA MEMO
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
3.1 SORA Blockchain
• New notification bots for for CI/CD
• Update Bridge security bot
• Improved CI/CD pipeline
• Improved CI/CD for the new version of the Sovereign State environment
• Deployed Alphanet parachain dev environment
• Integrated Trivy reports to DefectDojo
3.2 Parachain
• Improved CI/CD pipeline
• Security checks added
• A new version has been released and deployed
3.3 Polkaswap
• Improved CI/CD pipeline
• Working on fault tolerance
3.4 Mobile Clients
• Updated CI/CD pipeline
• New autotests
• Library improved
• New security tools integrated into DefectDojo
3.5 SORA Card
• Improved CI/CD
• DNS and website management
• Working on Infrastructure hardening
3 DevOps and Security - 433 hrs

9SORA MEMO
4 Education - 886 hr 
Educational operations this month included: 
4.1 SORA
• Ecosystem Update; 
• Ongoing wiki Improvements;
• Orderbook builders guide released
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment);
• Weekly network digest recap;
• SORA Kusama Bridge Giveaway reward distribution;
• AMA with Curio Invest;
• Relationship management with parachain teams to open HRMP channels;
• Continuous maintenance and documentation of the implementation and vision 
of SORA in the wiki; 
• Discussions with potential partners to integrate their services into the SORA 
wallet and integrate SORA DeFi services into their product;
• SORA evangelisation at industry events and conferences.
4.2 Polkaswap
• Ecosystem Update;
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment);
• Orderbook launch; 
• Orderbook survey;
• Polkaswap tutorials on SORA Wiki:
• Orderbook;
• SORA native staking.
• New release campaigns:
• DOT on Polkaswap;
• XOR burn&KEN reserve monitor. 
• Bridge to a sovereign government education campaign preparation.
• Attending high-impact in-person events and business to government 
(B2G) expenses.

10SORA MEMO
5 Total Hours - 6,601 hr
Additionally, invoice 205054, attached, pertains to cloud server costs for 
February 2024.
All SORA Ecosystem Memo payments provide collateral to the Token 
Bonding Curve.
Your ongoing support is greatly appreciated, and we look forward to continuing 
to serve you.
Sincerely, 
SORAMITSU Helvetia AG
The SORA Ecosystem Updates published on February 29 and the Polkaswap 
update published on February 29 present supporting concept updates.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG5 March 2024205054
ProjectDue Date
Cloud Service Provider Cost for February 202412 March 2024
DescriptionAmount (USD)
Cloud Service Provider Cost for February 2024
13,761.00
Subtotal$13,761.00
Tax0,00
Total Amount Due
USD $13,761.00
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
SORA.orgSORAMITSU Helvetia AG5 March 2024205055
ProjectDue Date
Development Cost for February 202412 March 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)4,319369.00
1,593,711.00
Polkaswap (Backend, Frontend)963369.00
355,347.00
DevOps and Security Review433369.00
159,777.00
Education886369.00
326,934.00
Subtotal6,601.00$369.00$2,435,769.00
Subtotal$2,435,769.00
Tax$0.00
Amount Due
USD $2,435,769.00
Grand Total Due (Invoice 205054 & 205055)USD $2,449,530.00
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
SORA.orgSORAMITSU Helvetia AG5 March 2024205055
ProjectDue Date
Development Cost for February 202412 March 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)4,319369.00
1,593,711.00
Polkaswap (Backend, Frontend)963369.00
355,347.00
DevOps and Security Review433369.00
159,777.00
Education886369.00
326,934.00
Subtotal6,601.00$369.00$2,435,769.00
Subtotal$2,435,769.00
Tax$0.00
Amount Due
USD $2,435,769.00
Grand Total Due (Invoice 205054 & 205055)USD $2,449,530.00
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
SORA.orgSORAMITSU Helvetia AG5 March 2024205055
ProjectDue Date
Development Cost for February 202412 March 2024
Description
Quantity 
(Work-Hours)
Unit Price (USD)Amount (USD)
SORA (Backend, Mobile Apps)4,319369.00
1,593,711.00
Polkaswap (Backend, Frontend)963369.00
355,347.00
DevOps and Security Review433369.00
159,777.00
Education886369.00
326,934.00
Subtotal6,601.00$369.00$2,435,769.00
Subtotal$2,435,769.00
Tax$0.00
Amount Due
USD $2,435,769.00
Grand Total Due (Invoice 205054 & 205055)USD $2,449,530.00
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
