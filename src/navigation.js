import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'About',
      href: '/about',
    },
    {
      text: 'Glossary',
      href: '/glossary',
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
  ],
  actions: [{ text: 'SORA Wiki', href: 'https://wiki.sora.org/', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Learn',
      links: [
        { text: 'SORA Glossary', href: '/glossary' },
        { text: 'Tokenomics', href: 'https://wiki.sora.org/tokenomics.html' },
        { text: 'Governance', href: 'https://wiki.sora.org/sora-governance.html' },
        { text: 'Staking', href: 'https://wiki.sora.org/nominating-validators.html' },
        { text: 'Polkaswap', href: 'https://wiki.sora.org/polkaswap.html' },
        { text: 'Integrated Plan', href: 'https://wiki.sora.org/integrated-plan.html' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { text: 'Fearless Wallet', href: 'https://fearlesswallet.io/' },
        { text: 'SORA Wallet', href: 'https://apps.apple.com/us/app/sora-dae/id1457566711' },
        { text: 'SORA Card', href: 'https://soracard.com/' },
        { text: 'Soranomics', href: 'https://soranomics.com/' },
        { text: 'Block Explorers', href: 'https://wiki.sora.org/explore-blocks.html#block-explorers' },
      ],
    },
    {
      title: 'Builders',
      links: [
        { text: 'TONSWAP', href: 'https://soranauts.com/introducing-tonswap-the-dex-for-mass-adoption-on-ton' },
        { text: 'ADAR Business', href: 'https://adar.com/' },
        { text: 'Demeter Farming', href: 'https://farming.deotoken.io/' },
        { text: 'Builders Programme', href: 'https://wiki.sora.org/sora-builders.html' },
        { text: 'Bokolo Cash CBDC', href: 'https://medium.com/sora-xor/the-sora-network-hosts-the-first-substrate-polkadot-based-cbdc-in-collaboration-with-the-central-6cc78e9b82b8' },
      ],
    },
    {
      title: 'Community',
      links: [
        { text: 'Announcements', href: 'https://t.me/sora_announcements' },
        { text: 'SORA Telegram', href: 'https://t.me/sora_xor' },
        { text: 'Polkaswap Telegram', href: 'https://t.me/polkaswap' },
        { text: 'SORA Daily', href: 'https://t.me/SORAdaily' },
        { text: 'Ceres Telegram', href: 'https://t.me/cerestoken' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://twitter.com/soranauts' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/soranauts/' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/soranauts' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/soranauts' },
  ],
  footNote: `
    This website is maintained by the <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://t.me/sora_xor"> SORA Community</a> &copy;
  `,
};
