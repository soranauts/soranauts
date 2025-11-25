import { taxonomy, type TaxonomyNode } from '../data/taxonomy';
import {
  TAG_HUB_DOMAINS,
  TAG_HUB_TRAITS,
  type TagHubDomain,
  type TagHubMetadataEntry,
  type TagHubQuickPath,
  type TagHubTrait,
  tagHubMetadata,
  tagHubQuickPaths,
  isCanonicalTag,
} from '../data/tag-hub.config';
import { normalizeTaxonomyValue, resolveAlias, toTagSlug } from './taxonomy';
import { FEATURE_GLOSSARY_V2025 } from '~/config/feature-flags';
import { getCanonicalSlug as getCanonicalGlossarySlug } from '~/lib/glossary/glossary-loader';

const FALLBACK_DOMAIN_MAP: Record<string, TagHubDomain> = {
  token: 'economics',
  technology: 'technology',
  governance: 'governance',
  defi: 'defi',
  network: 'network',
  economics: 'economics',
};

const DEFAULT_DOMAIN: TagHubDomain = 'ecosystem';

const CANONICAL_LABELS: Record<string, string> = {
  sora: 'SORA',
  'sora-v3': 'SORA v3',
  'sora-parliament': 'SORA Parliament',
  'sora-economy': 'SORA Economy',
  'sora-network': 'SORA Network',
  'sora economy': 'SORA Economy',
  'sora network': 'SORA Network',
  cbdc: 'CBDC',
  'qr-payments': 'QR Payments',
  wasm: 'WASM',
  webassembly: 'WebAssembly',
  ipfs: 'IPFS',
  ton: 'TON',
  amm: 'AMM',
  clmm: 'CLMM',
  'bft-consensus': 'BFT Consensus',
  'erc-20': 'ERC-20',
  'erc20': 'ERC-20',
  'erc 20': 'ERC-20',
  isi: 'ISI',
  makerdao: 'MakerDAO',
  npos: 'NPoS',
  xor: 'XOR',
  pswap: 'PSWAP',
  val: 'VAL',
  kusd: 'KUSD',
  tbcd: 'TBCD',
  opengov: 'OpenGov',
  iroha: 'Iroha',
  iroha3: 'Iroha 3',
  polkaswap: 'Polkaswap',
  soramitsu: 'SORAMITSU',
  tonswap: 'TONSWAP',
  xcm: 'XCM',
  dex: 'DEX',
  'sora-card': 'SORA Card',
  defi: 'DeFi',
  'cross-chain': 'Cross-chain',
};

export const formatTagLabel = (slug: string, fallback: string): string => {
  const key = slug?.toLowerCase?.().replace(/^tag-/, '') ?? '';
  return CANONICAL_LABELS[key] ?? fallback;
};

const sortTraits = (traits: Set<TagHubTrait>): TagHubTrait[] =>
  TAG_HUB_TRAITS.filter((trait) => traits.has(trait));

const sortQuickPathIds = (ids: Set<string>): string[] =>
  tagHubQuickPaths
    .map((path) => path.id)
    .filter((id) => ids.has(id));

const sortByWeightAndTitle = (a: TagHubViewModel, b: TagHubViewModel) => {
  const weightA = a.metadata?.weight ?? 0;
  const weightB = b.metadata?.weight ?? 0;
  if (weightA !== weightB) return weightB - weightA;
  return a.title.localeCompare(b.title, 'en');
};

export interface TagHubViewModel {
  slug: string;
  title: string;
  summary?: string;
  domain: TagHubDomain;
  traits: TagHubTrait[];
  quickPathIds: string[];
  usageCount: number;
  firstSeen?: string;
  lastSeen?: string;
  glossaryRef?: string;
  glossaryCanonicalPath?: string;
  canonicalGlossarySlug?: string | null;
  category?: TaxonomyNode['category'];
  relatedTags: string[];
  aliases: string[];
  metadata?: TagHubMetadataEntry;
}

export interface TagHubQuickPathView {
  id: string;
  title: string;
  description: string;
  slugs: string[];
  tags: TagHubViewModel[];
}

const buildTraits = (node: TaxonomyNode, metadata?: TagHubMetadataEntry): TagHubTrait[] => {
  const collected = new Set<TagHubTrait>(metadata?.traits ?? []);
  if (node.glossaryRef) {
    collected.add('glossary-linked');
  }
  return sortTraits(collected);
};

const buildQuickPathIds = (metadata?: TagHubMetadataEntry): string[] => {
  if (!metadata?.quickPathIds?.length) return [];
  return sortQuickPathIds(new Set(metadata.quickPathIds));
};

const determineDomain = (node: TaxonomyNode, metadata?: TagHubMetadataEntry): TagHubDomain => {
  if (metadata?.domain) return metadata.domain;
  if (node.category && FALLBACK_DOMAIN_MAP[node.category]) {
    return FALLBACK_DOMAIN_MAP[node.category];
  }
  return DEFAULT_DOMAIN;
};

const toRelatedTagSlugs = (node: TaxonomyNode): string[] =>
  Array.isArray(node.relatedTags)
    ? node.relatedTags
        .map((tag) => toTagSlug(tag))
        .filter((value, index, arr) => arr.indexOf(value) === index)
    : [];

const normalizeGlossaryRef = (value?: string | null): { rawPath?: string; canonicalSlug?: string | null; canonicalPath?: string } => {
  if (!value) return {};
  const slug = value.replace(/^\/glossary\//, '').replace(/\/$/, '');
  const canonicalSlug =
    FEATURE_GLOSSARY_V2025 && slug ? getCanonicalGlossarySlug(slug) || slug : slug;
  return {
    rawPath: `/glossary/${slug}`,
    canonicalSlug,
    canonicalPath: canonicalSlug ? `/glossary/${canonicalSlug}` : undefined,
  };
};

const toViewModel = (node: TaxonomyNode): TagHubViewModel => {
  const metadata = node.hub;
  const glossaryRefInfo = normalizeGlossaryRef(node.glossaryRef);
  return {
    slug: node.slug,
    title: node.title,
    summary: metadata?.summary ?? node.summary,
    domain: determineDomain(node, metadata),
    traits: buildTraits(node, metadata),
    quickPathIds: buildQuickPathIds(metadata),
    usageCount: node.usageCount ?? 0,
    firstSeen: node.firstSeen,
    lastSeen: node.lastSeen,
    glossaryRef: glossaryRefInfo.rawPath,
    glossaryCanonicalPath: glossaryRefInfo.canonicalPath ?? glossaryRefInfo.rawPath,
    canonicalGlossarySlug: glossaryRefInfo.canonicalSlug ?? null,
    category: node.category,
    relatedTags: toRelatedTagSlugs(node),
    aliases: node.aliases ?? [],
    metadata,
  };
};

export const getTagHubViewModel = (slug: string): TagHubViewModel | undefined => {
  const node = taxonomy[slug];
  if (!node || node.type !== 'tag') return undefined;
  return toViewModel(node);
};

export const getAllTagHubViewModels = (): TagHubViewModel[] =>
  Object.values(taxonomy)
    .filter((node) => node.type === 'tag' && isCanonicalTag(node.slug))
    .map((node) => toViewModel(node))
    .sort(sortByWeightAndTitle);

export const getTagHubDomains = (): TagHubDomain[] => [...TAG_HUB_DOMAINS];

export const getTagHubQuickPaths = (): TagHubQuickPathView[] =>
  tagHubQuickPaths.map((path) => {
    const tags = path.tags
      .map((slug) => getTagHubViewModel(slug))
      .filter((tag): tag is TagHubViewModel => Boolean(tag));

    return {
      id: path.id,
      title: path.title,
      description: path.description,
      slugs: path.tags,
      tags,
    };
  });

export const getTagHubQuickPathById = (id: string): TagHubQuickPathView | undefined =>
  getTagHubQuickPaths().find((path) => path.id === id);

export const resolveTagHubAlias = (query: string): TagHubViewModel | undefined => {
  const normalized = normalizeTaxonomyValue(query);
  const aliasResult = resolveAlias(normalized);
  if (!aliasResult) return undefined;

  const { node } = aliasResult;
  if (node.type !== 'tag') return undefined;

  return getTagHubViewModel(node.slug);
};

export const hasTagHubMetadata = (slug: string): boolean => Boolean(tagHubMetadata[slug]);

export const getTagHubMetadata = (slug: string): TagHubMetadataEntry | undefined =>
  tagHubMetadata[slug];

export const getTagHubQuickPathConfig = (): TagHubQuickPath[] => [...tagHubQuickPaths];



