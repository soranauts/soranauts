import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import { TAG_HUB_V1_ENABLED } from './utils/featureFlags';

type NavigationLink = {
  text: string;
  href: string;
  target?: string;
};

type NavigationSection = {
  title: string;
  links: NavigationLink[];
};

const headerLinks: NavigationLink[] = [
  { text: 'Docs', href: '/docs' },
  { text: 'Blog', href: getBlogPermalink() },
  { text: 'Glossary', href: '/glossary' },
  { text: 'About', href: '/about' },
  { text: 'Donate', href: '/donate' },
];

if (TAG_HUB_V1_ENABLED) {
  // Learn = guided paths (primary), Explore = tag discovery
  headerLinks.unshift(
    { text: 'Learn', href: '/learn' },
    { text: 'Explore', href: '/explore' }
  );
}

export const headerData = {
  links: headerLinks,
  actions: [{ text: 'SORA Wiki', href: 'https://wiki.sora.org/', target: '_blank' }],
};

const learnLinks: NavigationLink[] = [
  { text: 'SORA Codex', href: '/docs' },
  { text: 'SORA Glossary', href: '/glossary' },
  { text: 'Platform Features', href: '/features' },
  { text: 'Tokenomics', href: 'https://wiki.sora.org/tokenomics.html' },
  { text: 'Governance', href: 'https://wiki.sora.org/sora-governance.html' },
  { text: 'Staking', href: 'https://wiki.sora.org/nominating-validators.html' },
  { text: 'Polkaswap', href: 'https://wiki.sora.org/polkaswap.html' },
  { text: 'Integrated Plan', href: 'https://wiki.sora.org/integrated-plan.html' },
];

if (TAG_HUB_V1_ENABLED) {
  // Learning Paths first (primary learning entry point)
  learnLinks.unshift(
    { text: 'Learning Paths', href: '/learn' },
    { text: 'Topic Explorer', href: '/explore' }
  );
}

export const footerData = {
  links: [
    {
      title: 'Learn',
      links: learnLinks,
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
        {
          text: 'Bokolo Cash CBDC',
          href: 'https://medium.com/sora-xor/the-sora-network-hosts-the-first-substrate-polkadot-based-cbdc-in-collaboration-with-the-central-6cc78e9b82b8',
        },
        { text: 'GitHub', href: 'https://github.com/soranauts' },
        { text: 'Contributors', href: '/contributors' },
      ],
    },
    {
      title: 'Community',
      links: [
        { text: 'Announcements', href: 'https://t.me/sora_announcements' },
        { text: 'SORA Telegram', href: 'https://t.me/sora_xor' },
        { text: 'Polkaswap Telegram', href: 'https://t.me/polkaswap' },
        { text: 'Soranauts Telegram', href: 'https://t.me/Soranauts' },
        { text: 'Soranauts News', href: 'https://t.me/SoranautsNews' },
        { text: 'SORA Daily', href: 'https://t.me/SORAdaily' },
        { text: 'Twitter/X', href: 'https://x.com/sora_xor' },
      ],
    },
  ] as NavigationSection[],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
    { text: 'Donate', href: '/donate' },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-twitter', href: 'https://twitter.com/soranauts' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/soranauts/' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/soranauts' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/@Soranauts' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/soranauts' },
  ],
  footNote: `
    This website is maintained by the <a class="text-link hover:text-link-hover hover:underline transition-colors" href="https://t.me/sora_xor">SORA Community</a> &copy;
  `,
};



