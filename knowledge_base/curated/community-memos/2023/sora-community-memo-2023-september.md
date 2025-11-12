---
title: Community Memo – SORA Community Memo 2023 September
slug: sora-community-memo-2023-september
source: community-memo
source_url: 'internal://soranauts/community-memos/2023/sora-community-memo-2023-september'
publishDate: '2025-11-12T02:04:19.960Z'
updateDate: '2025-11-12T02:04:19.960Z'
content_sha256: fb1d8a32164ef283c6e427c0487af24650e6a05a9170d6f817b27c23b833c699
snapshot_id: '2025-11-12'
verified_by: Community Governance Group
tags:
  - sora
  - governance
  - ecosystem
  - community
---
# Community Memo – SORA Community Memo 2023 September

1SORA MEMO
A MEMO TO THE 
SORA COMMUNITY
SEPTEMBER 2023

2SORA MEMO
This document accompanies the invoice sent to SORA for the 
services provided by SORAMITSU. 
September 2023 was an incredible month of accomplishments. 
The SORA Integrated Plan continues to be the roadmap for the 
SORA Network development pipeline, and the progress rate 
has steadily advanced. 
This memo will provide a perspective on the activities for 
each track, a description of the development activities 
specific to this month, and the total amount of hours 
presented in invoice number 205045 served by 
SORAMITSU Helvetia to the SORA Community.

3SORA MEMO
Work this month is spread across the XST asset platform, the Substrate bridge, 
Orderbook implementation, a CBDC Proof of Concept, Documentation, and 
Community Requested Features.
The XST asset platform was successfully launched, and improvements were 
implemented to enable liquidity pools with XST-based assets. Work to implement 
XST-based asset compatibility within the Order book is ongoing.
Work on the Order book is progressing smoothly. It is currently undergoing 
benchmarking, while the LiquidityProxy is being upgraded for order book 
compatibility with the Aggregate Liquidity Proxy. 
A proof of concept for a Central Bank Digital Currency is being developed on the 
SORA network. Dev work currently focuses on implementing XORless transfers, 
allowing users to make transactions without needing XOR in their accounts. 
Details of this PoC are under embargo until an official announcement is released. 
The Substrate bridge has been completed, it is now integrated on SORA, and work 
is ongoing to test the infrastructure and provide a front-end interface within the 
Hashi bridge on Polkaswap. With the bridge infrastructure complete, work is now 
focusing on the SORA Kusama parachain, with the governance structure comprised 
of the Council and Technical Committee being implemented.
The team has prepared documentation to open HRMP channels with other 
parachains, as well as outlining the infrastructure of the Substrate Bridge. 
Other activities include optimising the XOR fee structure to optimise claiming 
Validator rewards.
Finally, ongoing project management activities include SORA Governance and 
Technical committee support, quality assurance ops and development support to 
external teams building on the SORA network.
.
1 SORA (Substrate) - 5,575 hrs 

4SORA MEMO
On the mobile side, two releases were worked on this month; 
• 3.4.0, which introduced the Explore Ecosystem feature, including tokens and 
pools available, fiat price trends of given assets, night mode and optimisations for 
languages read from right to left.
• 3.5.0, which introduced the display of balances on the SORA Card IBAN, 
improvements to the KYC flow, and other SDK improvements. 
As well as project management activities, systems analysis, UI/UX improvements 
and quality assurance. 
1.1 SORA Backend
• Working on the release of the infrastructure for the Substrate bridge;
• Working on the Kusama parachain:
• Implementation of the Council and Technical Committee governance bodies.
• Working on the benchmarking of the Order book to assess the impact of the 
different parameters on the system;
• Working on an upgrade of the smart split LiquidityProxy (Aggregate Liquidity 
Technology) to include the Order book liquidity source in the ALT.
• Establishing requirements for the XORless transfers for the CBDC PoC;
• Implementing the XORless transfers functionality.
• Reworking the XOR fee structure to enable tweaking fees to claim validators' 
staking rewards;
• Adding the support for synthetic assets in XYK pools and Order book.
• Working on codebase improvements and fixes.
• Maintenance of the pricing server.
• Ongoing code review and grooming activities.
• Implementation of fee management for the EVM bridge
• Research and establishment of business and technical requirements for Kensetsu
• Research and grooming for the support of Ink! Smart contract on SORA
• Discussions with interested parties to implement a bridge with the SORA network
• Maintenance of the pricing server
• Project management operations 
(tasks management, prioritization, daily meetings, grooming)
• SORA Governance operations (communication w/ Council, Technical committee, 
fast-tracking motions, runtime upgrades)
• Support and collaboration with client applications teams

5SORA MEMO
• Quality Assurance operations (testing)
• Systems analysis operations (analyzing tasks, establishing technical requirements 
to support the developers in the implementation) 
1.2 Mobile App
• Finishing the implementation of the release 3.4.0 - Explore Ecosystem, 
which includes:
• Display tokens and pools available in the SORA network.
• Display the fiat price trend of a chosen asset.
• Toggle view for an account’s cards.
• Night mode.
• Support for right-to-left reading languages: Arabic and Hebrew.
• Performance and UI/UX improvements.
• Working on the release 3.5.0 - SORA Card Balance
• Display SORA Card IBAN balance.
• Improvements in KYC flow.
• Update of partners’ SDK.
• SORA Card middleware maintenance and alignment with resource changes 
from external partners.
• Synchronisation with external partners.
• SORA Card business development.

6SORA MEMO
Polkaswap has received a substantial amount of ongoing improvements, including: 
• HASHI Bridge Substrate backbone. 
• Buy tokens page.
• SORA CARD UX improvements & IBAN integration.
• Supply charts for all tokens.
• Improved performance;
• Network fee requests are 80 times faster.
• Liquidity-related requests are Nx faster 
(where N is the number of different pairs your account provides).
• Swap improvements.
• New additions include:
• Default sorting for pool entities in the Pools & Explore pages 
• A marketing & dev highlights banner.
• A new filter on the 'Select token' dialogue.
• Loading state in the blockchain node connection management.
• Improved transfer address checks (EVM address).
• Responsive design improvements on mobile devices.
• SORA CARD IBAN Balances.
• $XOR Native staking UI.
• Order Book & Limit Order Interface Implementation.
• Subsquid service integration to Polkaswap.
• Maintenance for Subsquid & Subquery projects: Common logic upgraded.
• Aggregate Liquidity Technology support for swaps.
• Quality Assurance and project management activities.
2 Substrate (PSWAP) - 742 hrs

7SORA MEMO
The work done this month by DevOps covers the SORA network as well as its 
underlying infrastructure. Here are more details:
• Testing and Quality Assurance operations
3.1 SORA Blockchain
• Updated alerting rules and dashboards for SORA
• Improved CI/CD pipeline
• Updated SORA bots
• Rust CI library improved
• Finished Internal audit of substrate bridge
• Prepared SORA longevity environment
• Created Subquery CD library
• In progress: 
• 95% SAST for Rust implementation
3.2 Parachain
• Improved CI/CD pipeline
• Security checks
• Coverage
• Build conditions
3.3 Polkaswap
• Improved CI/CD pipeline
• Implemented Defect Dojo
• Working on Infrastructure hardening
3.4 Mobile Clients
• Updated CI/CD pipeline
• SORA card-related improvements
3.5 SORA Card
• New version released
• Working on Infrastructure hardening
3 DevOps and Security - 508 hrs

8SORA MEMO
4 Education - 879 hr 
Educational operations this month included: 
4.1 SORA
• Ecosystem Updates (2)
• Documenting business description and technical implementation for the 
initiatives (Substrate bridge, Order book)
• Improvements on the wiki
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment)
• Support Polkadot Parachain crowdloan communications 
• Understanding TBCD article 
• SORA Blockchain release ‘Infrastructure for Substrate bridge’ comms
• SORA Wiki awareness comms 
• SORA Blockchain release ‘Pool Synthetic assets’ comms 
• SORA Card IBAN release comms (SORA Wallet)
• SORA Polkadot parachain crowdloan awareness 
4.2 Polkaswap
• Ecosystem Updates (2)
• Daily social media posts (covering key features, testnet/mainnet releases, 
highlighting USPs, and entertainment)
• Polkaswap release ‘Backbone for HASH Substrate bridge’ comms
• ‘Connect with Google’ tutorial article
• SORA Synthetics (XST) listings comms
• SORA Synthetics airdrop comms
• SORA Synthetics written AMA 
• SORA Synthetics airdrop video tutorial
• Polkaswap v1.21 released. SM awareness of new features/improvements.
• Attending high-impact in-person events and business to government 
(B2G) expenses. 

9SORA MEMO
5 Total Hours - 7,704 hr
Additionally, invoice 205044, attached, pertains to cloud server costs for 
September 2023.
All SORA Ecosystem Memo payments provide collateral to the Token 
Bonding Curve.
Your ongoing support is greatly appreciated, and we look forward to continuing 
to serve you.
Sincerely, 
SORAMITSU Helvetia AG
Supporting concept updates are presented in the SORA Ecosystem Updates 
published on September 18 & October 4, and Polkaswap updates on 
September 18 & October 4, respectively.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG6 October 2023205044
ProjectDue Date
Cloud Service Provider Cost for September 202316 October 2023
DescriptionAmount (USD)
Cloud Service Provider Cost for September 2023
6,740.00
Subtotal$6,740.00
Tax0,00
Total Amount Due
USD $6,740.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWZQjkPwtZrngbWLzBCnszfjgaPFMsWoTbq5LePbL5A3JmWv
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG6 October 2023205044
ProjectDue Date
Cloud Service Provider Cost for September 202316 October 2023
DescriptionAmount (USD)
Cloud Service Provider Cost for September 2023
6,740.00
Subtotal$6,740.00
Tax0,00
Total Amount Due
USD $6,740.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWZQjkPwtZrngbWLzBCnszfjgaPFMsWoTbq5LePbL5A3JmWv
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG6 October 2023205045
ProjectDue Date
Development Cost for September 202316 October 2023
Description
Quantity 
(Work-Hours)
Discounted Unit Price 
(USD)
Amount (USD)
SORA (Backend, Mobile Apps)5,575250.00
1,393,750.00
Polkaswap (Backend, Frontend)742250.00
185,500.00
DevOps and Security Review508250.00
127,000.00
Education879250.00
219,750.00
Subtotal7,704.00250.00$1,926,000.00
Subtotal$1,926,000.00
Tax$0.00
Amount Due
USD $1,926,000.00
Grand Total Due (Invoice 205044 & 205045)USD $1,932,740.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWZQjkPwtZrngbWLzBCnszfjgaPFMsWoTbq5LePbL5A3JmWv
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG6 October 2023205045
ProjectDue Date
Development Cost for September 202316 October 2023
Description
Quantity 
(Work-Hours)
Discounted Unit Price 
(USD)
Amount (USD)
SORA (Backend, Mobile Apps)5,575250.00
1,393,750.00
Polkaswap (Backend, Frontend)742250.00
185,500.00
DevOps and Security Review508250.00
127,000.00
Education879250.00
219,750.00
Subtotal7,704.00250.00$1,926,000.00
Subtotal$1,926,000.00
Tax$0.00
Amount Due
USD $1,926,000.00
Grand Total Due (Invoice 205044 & 205045)USD $1,932,740.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWZQjkPwtZrngbWLzBCnszfjgaPFMsWoTbq5LePbL5A3JmWv
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG6 October 2023205044
ProjectDue Date
Cloud Service Provider Cost for September 202316 October 2023
DescriptionAmount (USD)
Cloud Service Provider Cost for September 2023
6,740.00
Subtotal$6,740.00
Tax0,00
Total Amount Due
USD $6,740.00
* Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWZQjkPwtZrngbWLzBCnszfjgaPFMsWoTbq5LePbL5A3JmWv
Thank you very much for your business. We are looking forward to serving you again.
SORAMITSU Helvetia AG
 
c/o Diego Compostella 
Oberneuhofstrasse 5, 6341 Baar 
Switzerland
E-mail: billing@soramitsu.co.jp
Invoice
Invoice forPayable toIssue DateInvoice Number
SORA.orgSORAMITSU Helvetia AG6 October 2023205045
ProjectDue Date
Development Cost for September 202316 October 2023
Description
Quantity 
(Work-Hours)
Discounted Unit Price 
(USD)
Amount (USD)
SORA (Backend, Mobile Apps)5,575250.00
1,393,750.00
Polkaswap (Backend, Frontend)742250.00
185,500.00
DevOps and Security Review508250.00
127,000.00
Education879250.00
219,750.00
Subtotal7,704.00250.00$1,926,000.00
Subtotal$1,926,000.00
Tax$0.00
Amount Due
USD $1,926,000.00
Grand Total Due (Invoice 205044 & 205045)USD $1,932,740.00
 * Payment can be made in equivalent TBCD, at the market rate.
Wallet Address (TBCD): cnWZQjkPwtZrngbWLzBCnszfjgaPFMsWoTbq5LePbL5A3JmWv
Thank you very much for your business. We are looking forward to serving you again.

SORAMITSU Co. Ltd. 
Link Square Shinjuku 16F,
5-27-5, Sendagaya, 
Shibuya-ku, Tokyo, 
Japan, 151-0051
info@soramitsu.co.jp 
soramitsu.co.jp
