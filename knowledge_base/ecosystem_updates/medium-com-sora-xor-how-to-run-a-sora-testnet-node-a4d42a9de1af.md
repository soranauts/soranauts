---
title: How to Run a SORA Mainnet Node
source: update
source_url: 'https://medium.com/sora-xor/how-to-run-a-sora-testnet-node-a4d42a9de1af'
doc_id: de724acc688e4b37
snapshot_id: '2025-11-02'
fetched_at: '2025-11-02T15:43:50.964Z'
lang: en
license: SORA Official / Medium
checksum_sha256: 7313d45be2d2d466c1ec33167bef1c75de00b067239e994f883f240058c61d98
content_hash: 7313d45be2d2d466c1ec33167bef1c75de00b067239e994f883f240058c61d98
image_rights: SORA Official / Medium
publishDate: '2025-11-02T15:43:50.809Z'
---
How to Run a SORA Mainnet Node | SORA

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://rsci.app.link/?%24canonical_url=https%3A%2F%2Fmedium.com%2Fp%2Fa4d42a9de1af&%7Efeature=LoOpenInAppButton&%7Echannel=ShowPostUnderCollection&%7Estage=mobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fhow-to-run-a-sora-testnet-node-a4d42a9de1af&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](/?source=post_page---top_nav_layout_nav-----------------------------------------)

[

Write

](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[

Search

](/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fhow-to-run-a-sora-testnet-node-a4d42a9de1af&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](./images/bbefe9f1458fdfc667823f3eb2499c80e84ec0fd7a41bf652d9ccee03c8cacb5.png)

[

SORA

--------

](https://medium.com/sora-xor?source=post_page---publication_nav-4476c249dd22-a4d42a9de1af---------------------------------------)

·

[

![SORA](./images/5fe025da6b097914ecf0ca9331a78e086d42a8c27cbfcf11187efde93883b07d.png)

](https://medium.com/sora-xor?source=post_page---post_publication_sidebar-4476c249dd22-a4d42a9de1af---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

How to Run a SORA Mainnet Node
==============================

[

![SORA](./images/be3254c2c7d7cd92d0a16e9801a0d41459927feb410386d18ed86145d944ba9f.png)

](/@sora-xor?source=post_page---byline--a4d42a9de1af---------------------------------------)

[SORA](/@sora-xor?source=post_page---byline--a4d42a9de1af---------------------------------------)

10 min read

·

Mar 27, 2021

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa4d42a9de1af&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fhow-to-run-a-sora-testnet-node-a4d42a9de1af&user=SORA&userId=1a19bb1bbd4a&source=---header_actions--a4d42a9de1af---------------------clap_footer------------------)

\--

4

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fa4d42a9de1af&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fhow-to-run-a-sora-testnet-node-a4d42a9de1af&source=---header_actions--a4d42a9de1af---------------------bookmark_footer------------------)

Listen

Share

Press enter or click to view image in full size

TL;DR
-----

* Anyone can run a node on the SORA mainnet
* There are two types of nodes:

1. Syncing nodes (that receive and relay data)

2\. Validating nodes (that make the blocks)

**Follow these instructions to set up your own node!**
------------------------------------------------------

### Prerequisites

You will need:

* A machine with Linux, Windows or macOS
* [Docker](https://docs.docker.com/get-docker/). Follow the installation guide for your operating system.
* At least 8GB RAM (preferably 16GB RAM, although 64GB RAM will be needed for production)
* 300GB free space (preferably SSD, with the ability to expand)
* Intel(R) Core(TM) i7–7700K CPU @ 4.20GHz (alternatively, a 4-Core processor with a frequency of 2.2 GHz)

Check that docker is installed using the `docker --version` command in the terminal.

C:\\\\Users\\\\Pg> docker --version 
Docker version 20.10.2, build 2291f61 
C:\\\\Users\\\\Pg>

It’s recommended that you use the latest docker version.

Check the container with the `docker run hello-world` command in the terminal. If everything works fine, Docker will pull the hello-world image and run it. You should see the following output:

C:\\\\Users\\\\Pg> docker run hello-world 
Unable to find image 'hello-world:latest' locally 
latest: Pulling from library/hello-world 
0e03bdcc26d7: Pull complete 
Digest: sha256:95ddb6c31407e84e91a986b004aee40975cb0bda14b5949f6faac5d2deadb4b9 
Status: Downloaded newer image for hello-world:latestHello from Docker! 
This message shows that your installation appears to be working correctly.To generate this message, Docker took the following steps: 
 1. The Docker client contacted the Docker daemon. 
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub. 
 (amd64) 
 3. The Docker daemon created a new container from that image which runs the 
 executable that produces the output you are currently reading. 
 4. The Docker daemon streamed that output to the Docker client, which sent it 
 to your terminal.To try something more ambitious, you can run an Ubuntu container with: 
 $ docker run -it ubuntu bashShare images, automate workflows, and more with a free Docker ID: 
 <https://hub.docker.com/>For more examples and ideas, visit: 
 <https://docs.docker.com/get-started/>

If something went wrong, please visit the [Docker documentation](https://docs.docker.com/) site, and depending on your operating system, you can also download Docker here:

* [macOS](https://docs.docker.com/get-docker/#docker-for-mac)
* [Windows](https://docs.docker.com/get-docker/#docker-for-windows/install/)
* [Linux](https://docs.docker.com/get-docker/#docker-for-linux)

Get the latest SORA Node version number
---------------------------------------

Users should use version **3.2.2** for the time being. We will update this article with the latest version after every update.

You should use the latest SORA Node version to run a node. You can see the [latest build number here](https://hub.docker.com/r/sora2/substrate/tags?page=1&ordering=last_updated), and find the last version with the`x.y.z` format.

Press enter or click to view image in full size

Use this version number for further `docker` commands in this guide. The number of the version will be marked as `**<version>**` in the commands (_note: enter the version number without the brackets_)

Running a Syncing Node
----------------------

On Linux/Mac
------------

Pull the docker image from the docker repository

`docker pull sora2/substrate:**3.2.2**`

Create a folder for the node configuration

`mkdir sora2`

`cd sora2`

And grant access to the folder

`` chown 10000:10000 `pwd` ``

**NOTE**: on macOS you might need to use `sudo chown **<username>:1000** .` instead

Run the docker image (_don’t forget to insert your version below!_)

``docker run --rm -p 127.0.0.1:9933:9933 -p 127.0.0.1:9944:9944 -v `pwd`:/chain sora2/substrate:**3.2.2** --name sora2-node --chain main --base-path /chain --unsafe-ws-external --unsafe-rpc-external --wasm-execution compiled``

Then your node should sync.

On Windows
----------

Pull the docker image from the docker repository

`docker pull sora2/substrate:**3.2.2**`

Create a folder for the node configuration

`C:\\Users\\**<username>**\\sora2-node`

Check access to the folder:

All checkboxes should be activated for the user:

Run the docker command

`docker run --rm -p 127.0.0.1:9933:9933 -p 127.0.0.1:9944:9944 -v sora2-node:/chain -u 0 sora2/substrate:3.2.2 --name sora2-node --chain main --base-path /chain --unsafe-ws-external --unsafe-rpc-external --wasm-execution compiled`

Now you can connect to your node with [polkadot.js apps](https://polkadot.js.org/apps/#/explorer). Select _Local node_ and click _Switch._

Then your node should sync!

Running a Validator Node
------------------------

On Linux/Mac
------------

`docker pull sora2/substrate:**3.2.2**`

Create a folder for the node configuration

`mkdir sora2`

`cd sora2`

And grant access to the folder

`` chown 10000:10000 `pwd` ``

**NOTE**: on macOS you might need to `chown **<username>** .` instead

And run the Docker command

``docker run --rm -p 127.0.0.1:9933:9933 -p 127.0.0.1:9944:9944 -v `pwd`:/chain sora2/substrate:**3.2.2** --name sora2-node --chain main --base-path /chain --validator --rpc-methods Unsafe --rpc-cors all --execution Wasm --wasm-execution compiled``

You can add the following flag to enable [Telemetry](https://telemetry.polkadot.io/#list/SORA) for your node

`--telemetry-url "wss://telemetry.polkadot.io/submit/ 0"`

On Windows
----------

Pull the docker image from the docker repository

`docker pull sora2/substrate:**3.2.2**`

Create a folder for the node configuration

`C:\\Users\\**<username>**\\sora2-node`

Check the access to the folder:

All checkboxes should be activated for the user:

Run the Docker command

``docker run --rm -p 127.0.0.1:9933:9933 -p 127.0.0.1:9944:9944 -v `pwd`:/chain sora2/substrate:**3.2.2** --name sora2-node --chain main --base-path /chain --validator --rpc-methods Unsafe --rpc-cors all --execution Wasm --wasm-execution compiled``

Get session keys (with Polkadot.js apps)
----------------------------------------

Open [polkadot.js apps](https://polkadot.js.org/apps/#/explorer) and switch to your local node.

Press enter or click to view image in full size

In the Development section, select Local Node _(ws://127.0.0.1:9944)_ and click _Switch_.

Press enter or click to view image in full size

Now, you’re able to see the screen with your node information. _(Once your node has fully synced)_

Press enter or click to view image in full size

Navigate to _Developer_ → _RPC calls_

Press enter or click to view image in full size

Select _author_ → _rotateKeys()_

Press enter or click to view image in full size

Click the Submit RPC call button.

Press enter or click to view image in full size

You’ll get your session key in the output. Copy the key as you will need them for a further step.

It may be possible that the node does not load on Polkadot.JS apps. In that case, the command line option below is the best alternative to obtaining the session key.

Get session keys (with command line)
------------------------------------

Open the terminal (or other command line client) and run the command

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "author\_rotateKeys", "params":\[\]}' [http://127.0.0.1:9933](http://127.0.0.1:9933)

The output will contain the session key

{“jsonrpc”:”2.0",”result”:”0x5e977ddcc0c69a6aed067052d5bd8f6bd365fae03562fd447d434e9814ac415d7c9ffe722364922bda314e44654f5c0cdc00d152470d5433f12cb73d078061863ac769d5f17b5460f042d221edf0099d2ce4c23edbe96ac943452cc4d3ad6d72”,”id”:1}

Copy the _result;_ in the current example, it is

0x5e977ddcc0c69a6aed067052d5bd8f6bd365fae03562fd447d434e9814ac415d7c9ffe722364922bda314e44654f5c0cdc00d152470d5433f12cb73d078061863ac769d5f17b5460f042d221edf0099d2ce4c23edbe96ac943452cc4d3ad6d72

Adding a Validator
------------------

First, you should go to _Accounts_ and already have an account connected.

Navigate to Network → Staking → Account actions

and click _Validator_:

Press enter or click to view image in full size

Select stash and controller account. It’s recommended to use different accounts for stash and controller. _(In the example we are using PAVEL (EXTENSION))_

Set the bonded value.

Press enter or click to view image in full size

Set the session key (_the result of rotateKeys call_) and reward commission.

Press enter or click to view image in full size

And sign the transaction.

Press enter or click to view image in full size

Make sure that you have been added to the stashes.

Press enter or click to view image in full size

And wait for the next Era.

Press enter or click to view image in full size

When the next Era starts, your validator will be added.

Get Payouts
-----------

Open _Staking → Payouts._ If your validator participates in the consensus, then you’ll be able to get payouts after the Era.

Polkadot.js apps always display XOR, because they don’t support multi assets. There should be said VAL on the screenshot below.

Press enter or click to view image in full size

Click the _Payout all_ button and sign the transaction

Press enter or click to view image in full size

Press enter or click to view image in full size

After that, you can check your VAL balance. You should get your reward.

Make sure to pay attention as the reward will be shared among Validator and Nominators according to the Stake.

Add node to Telemetry
---------------------

If you want to add your node to [telemetry](https://telemetry.polkadot.io/#list/SORA) just add this tag when you run the docker image

`--telemetry-url "wss://telemetry.polkadot.io/submit/ 0"`

You can change the name of your node by editing the parameter value of:

`--name sora2-node`

How to Become a Nominator
-------------------------

The only thing you need to become a nominator is XOR tokens.

Open Polkadot.js apps and navigate to the Staking tab

Press enter or click to view image in full size

Select _Account actions → Nominator_

Press enter or click to view image in full size

Select your account and enter the amount that you’d like to nominate then click next.

Press enter or click to view image in full size

Select a validator (or validators) that you’d like to nominate

Press enter or click to view image in full size

Click _Bond & Nominate_

Press enter or click to view image in full size

Submit, and then sign the transaction.

If everything is correct, then you’ll see your bonded XORs in the Nominators list

Press enter or click to view image in full size

Running an Archive node
-----------------------

On Linux/Mac
------------

`docker pull sora2/substrate:**3.2.2**`

Create a folder for the node configuration

`mkdir sora2`

`cd sora2`

And grant access to the folder

`` chown 10000:10000 `pwd` ``

**NOTE**: on macOS you might need to use `chown <username> .` instead

And run the Docker command

``docker run --rm -p 127.0.0.1:9933:9933 -p 127.0.0.1:9944:9944 -v `pwd`:/chain sora2/substrate:**3.2.2** --name sora2-my-node --chain main --base-path /chain --unsafe-ws-external --pruning archive --unsafe-rpc-external --wasm-execution compiled``

On Windows
----------

Pull the docker image from the docker repository

`docker pull sora2/substrate:**3.2.2**`

Create a folder for the node configuration

`C:\\Users\\<username>\\sora2-node`

Check the access to the folder

All checkboxes should be activated for the user

Run the Docker command

`docker run --rm -p 127.0.0.1:9933:9933 -p 127.0.0.1:9944:9944 -v sora2-node:/chain -u 0 sora2/substrate:**3.2.2** --name sora2-my-node --chain main --base-path /chain --unsafe-ws-external --pruning archive --unsafe-rpc-external --wasm-execution compiled`

The node will take some time to sync. The output in logs should look like this:

2021-04-30 11:33:33 💤 Idle (0 peers), best: #0 (0x7e4e…8ad5), finalized #0 (0x7e4e…8ad5), ⬇ 37.1kiB/s ⬆ 16.3kiB/s 
2021-04-30 11:33:38 ⚙️ Syncing 31.0 bps, target=#38470 (1 peers), best: #155 (0xa9e2…5b22), finalized #0 (0x7e4e…8ad5), ⬇ 127.6kiB/s ⬆ 0.9kiB/s 
2021-04-30 11:33:43 ⚙️ Syncing 35.6 bps, target=#38470 (2 peers), best: #333 (0x4c68…2957), finalized #0 (0x7e4e…8ad5), ⬇ 7.9kiB/s ⬆ 0.2kiB/s 
2021-04-30 11:33:48 ⚙️ Syncing 32.4 bps, target=#38471 (2 peers), best: #495 (0x9082…f220), finalized #0 (0x7e4e…8ad5), ⬇ 41.3kiB/s ⬆ 1.1kiB/s 
2021-04-30 11:33:53 ⚙️ Syncing 34.6 bps, target=#38471 (2 peers), best: #668 (0xb34a…121a), finalized #512 (0x1f6e…cc65), ⬇ 0.1kiB/s ⬆ 0

You can connect to your own node with Polkadot.js apps. [Open Polkadot.js apps](https://polkadot.js.org/apps/) and navigate to the Development section in the network selector.

Press enter or click to view image in full size

If you’re running a node on your local machine then select _Local Node_ and click _Switch_. Otherwise, enter your custom endpoint and save.

FAQ
---

Q: **I’m getting an error starting the node**.

A: _Double-check if you have entered the command and flags correctly and that there are no typos. If that does not work,_ l_ocate your Sora2 folder, erase its contents, pull the docker image and try rerunning the node._

Q: **I don’t have XOR for initial staking**.

A: _You can exchange tokens for XOR on_ [_Polkaswap_](https://polkaswap.io/#/swap), or transfer tokens from ETH to the SORA Mainnet using the [bridge function in Polkaswap](https://polkaswap.io/#/bridge) and then exchange for XOR.

Q: **Where can I see my node in telemetry?**

A: _You can see it_ [_here_](https://telemetry.polkadot.io/#map/SORA)

Q: **My node is having trouble syncing, what can I do?**

A: You can add the setting `--in-peers 80` and that should solve the issue, otherwise _see the next question_.

Q: **My node is really slow or getting stuck, what can I do?**

A: You can add the setting

\- max-runtime-instances 24 - db-cache 30072 - state-cache-size 40000000000

Q: **I have checked all the documentation and my question still has no answer, who else can I ask?**

A: You can always join the [SORA Devs Telegram community](https://t.me/soradevs) and ask any other questions you may have there, other community members and the admins will be happy to help!

[

Blockchain

](/tag/blockchain?source=post_page-----a4d42a9de1af---------------------------------------)

[

Defi

](/tag/defi?source=post_page-----a4d42a9de1af---------------------------------------)

[

Polkadot

](/tag/polkadot?source=post_page-----a4d42a9de1af---------------------------------------)

[

Sora

](/tag/sora?source=post_page-----a4d42a9de1af---------------------------------------)

[

Polkaswap

](/tag/polkaswap?source=post_page-----a4d42a9de1af---------------------------------------)

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa4d42a9de1af&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fhow-to-run-a-sora-testnet-node-a4d42a9de1af&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--a4d42a9de1af---------------------clap_footer------------------)

\--

[

](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fsora-xor%2Fa4d42a9de1af&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fhow-to-run-a-sora-testnet-node-a4d42a9de1af&user=SORA&userId=1a19bb1bbd4a&source=---footer_actions--a4d42a9de1af---------------------clap_footer------------------)

\--

4

[](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fa4d42a9de1af&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fsora-xor%2Fhow-to-run-a-sora-testnet-node-a4d42a9de1af&source=---footer_actions--a4d42a9de1af---------------------bookmark_footer------------------)

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--a4d42a9de1af---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](https://medium.com/sora-xor?source=post_page---post_publication_info--a4d42a9de1af---------------------------------------)

[

Published in SORA
-----------------

](https://medium.com/sora-xor?source=post_page---post_publication_info--a4d42a9de1af---------------------------------------)

[1.4K followers](/sora-xor/followers?source=post_page---post_publication_info--a4d42a9de1af---------------------------------------)

·[Last published Jul 11, 2025](/sora-xor/sora-ecosystem-updates-88-june-33-2025-01ffc03a468b?source=post_page---post_publication_info--a4d42a9de1af---------------------------------------)

SORA is working to become a decentralized multiverse economic system, financing the creation of new and exciting applications, under the democratic supervision of the SORA Parliament.

[

![SORA](./images/79a400633ddc0daa3511d2d89e7597531f7c09e980461816f6db4115e97b2a1e.png)

](/@sora-xor?source=post_page---post_author_info--a4d42a9de1af---------------------------------------)

[

![SORA](./images/291f1c5ddaf1c3cd6e49003f654f864ac617eee0c5574355cc501a7bd295e8be.png)

](/@sora-xor?source=post_page---post_author_info--a4d42a9de1af---------------------------------------)

[

Written by SORA
---------------

](/@sora-xor?source=post_page---post_author_info--a4d42a9de1af---------------------------------------)

[2.3K followers](/@sora-xor/followers?source=post_page---post_author_info--a4d42a9de1af---------------------------------------)

·[26 following](/@sora-xor/following?source=post_page---post_author_info--a4d42a9de1af---------------------------------------)

SORA is working to become a decentralized world economic system, under the democratic supervision of the SORA Parliament. Many Worlds. One Economy. SORA.

Responses (4)
-------------

[](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page---post_responses--a4d42a9de1af---------------------------------------)

See all responses

[

Help

](https://help.medium.com/hc/en-us?source=post_page-----a4d42a9de1af---------------------------------------)

[

Status

](https://status.medium.com/?source=post_page-----a4d42a9de1af---------------------------------------)

[

About

](/about?autoplay=1&source=post_page-----a4d42a9de1af---------------------------------------)

[

Careers

](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----a4d42a9de1af---------------------------------------)

[

Press

](mailto:pressinquiries@medium.com)

[

Blog

](https://blog.medium.com/?source=post_page-----a4d42a9de1af---------------------------------------)

[

Privacy

](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----a4d42a9de1af---------------------------------------)

[

Rules

](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----a4d42a9de1af---------------------------------------)

[

Terms

](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----a4d42a9de1af---------------------------------------)

[

Text to speech

](https://speechify.com/medium?source=post_page-----a4d42a9de1af---------------------------------------)
