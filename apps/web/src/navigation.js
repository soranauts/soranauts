import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'About',
      href: '/about',
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Glossary',
      href: '/glossary',
    },
    {
      text: 'Features',
      href: '/features',
    },
    {
      text: 'Changelog',
      href: '/changelog',
    },
    {
      text: 'Donate',
      href: '/donate',
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
        { text: 'SORA Wallet', href: 'https://sora.org/wallet' },
        { text: 'SORA Card', href: 'https://soracard.com/' },
        { text: 'Soranomics', href: 'https://soranomics.com/' },
        { text: 'Block Explorers', href: 'https://wiki.sora.org/explore-blocks.html#block-explorers' },
        { text: 'SORA Wiki', href: 'https://wiki.sora.org/' },
      ],
    },
    {
      title: 'Builders',
      links: [
        { text: 'TONSWAP', href: 'https://tonswap.org/' },
        { text: 'ADAR Business', href: 'https://adar.com/' },
        { text: 'Demeter Farming', href: 'https://farming.deotoken.io/' },
        { text: 'Builders Programme', href: 'https://wiki.sora.org/sora-builders.html' },
        { text: 'Bokolo Cash CBDC', href: 'https://medium.com/sora-xor/the-sora-network-hosts-the-first-substrate-polkadot-based-cbdc-in-collaboration-with-the-central-6cc78e9b82b8' },
        { text: 'GitHub', href: 'https://github.com/soranauts' },
      ],
    },
    {
      title: 'Community',
      links: [
        { text: 'Announcements', href: 'https://t.me/sora_announcements' },
        { text: 'SORA Telegram', href: 'https://t.me/sora_xor' },
        { text: 'Polkaswap Telegram', href: 'https://t.me/polkaswap' },
        { text: 'Soranauts Telegram', href: 'https://t.me/Soranauts' },
        { text: 'SORA Daily', href: 'https://t.me/SORAdaily' },
        { text: 'Twitter/X', href: 'https://x.com/sora_xor' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
    { text: 'Donate', href: '/donate' },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-twitter', href: 'https://twitter.com/soranauts' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/soranauts/' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/soranauts' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/soranauts' },
  ],
  footNote: `
    This website is maintained by the <a class="text-link hover:text-link-hover hover:underline transition-colors" href="https://t.me/sora_xor">SORA Community</a> &copy;
  `,
};
