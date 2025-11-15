import React, { useState } from 'react';

// Static data - first 20 terms from the glossary
const staticTerms = [
  {
    term: 'XOR',
    slug: 'xor',
    definition: 'The network utility token used for transaction fees (gas) where 50% of fees are burned and 50% go to validators. XOR has elastic supply managed by a token bonding curve and can be used for staking, liquidity provision, and future SORA Parliament membership.',
    category: 'token',
    aliases: ['XOR', 'VAL', 'PSWAP', 'Polkaswap'],
  },
  {
    term: 'VAL',
    slug: 'val',
    definition: 'A validator reward token for the SORA network used to reward validators and stake nominators. VAL has deflationary tokenomics with tokens burned on every transaction, and elastic rewards distributed as a percentage of daily burned tokens.',
    category: 'token',
    aliases: ['VAL', 'XOR', 'PSWAP', 'Validator'],
  },
  {
    term: 'PSWAP',
    slug: 'pswap',
    definition: 'A deflationary token used to reward liquidity providers on Polkaswap. PSWAP has a 10 billion max supply that decreases over time, with 0.3% trading fees used for buyback-and-burn, and rewards starting at 90% of burned tokens reminted for LPs, decreasing to 35% after 5 years.',
    category: 'token',
    aliases: ['PSWAP', 'XOR', 'VAL', 'Polkaswap'],
  },
  {
    term: 'Polkaswap',
    slug: 'polkaswap',
    definition: 'A decentralized exchange (DEX) built on the SORA network that enables cross-chain token swaps between Ethereum, Bitcoin, and Polkadot ecosystems. It features automated market makers (AMMs) and provides liquidity mining rewards.',
    category: 'defi',
    aliases: ['Polkaswap', 'DEX', 'XOR', 'PSWAP'],
  },
  {
    term: 'SORA',
    slug: 'sora',
    definition: 'A decentralized autonomous economy (DAE) built on Substrate that aims to create a new economic system. SORA includes the SORA Parliament for governance, Polkaswap for trading, and various DeFi tools.',
    category: 'network',
    aliases: ['SORA', 'DAE', 'Substrate', 'Parliament'],
  },
  {
    term: 'SORA Parliament',
    slug: 'sora-parliament',
    definition: 'The governance system of the SORA network where XOR holders can participate in decision-making through proposals and voting. It manages network upgrades, parameter changes, and ecosystem development.',
    category: 'governance',
    aliases: ['Parliament', 'Governance', 'XOR', 'Voting'],
  },
  {
    term: 'Substrate',
    slug: 'substrate',
    definition: 'A modular blockchain framework developed by Parity Technologies that allows developers to build custom blockchains quickly. SORA is built on Substrate, which provides consensus mechanisms, networking, and runtime capabilities.',
    category: 'technology',
    aliases: ['Substrate', 'Parity', 'Framework', 'Blockchain'],
  },
  {
    term: 'Hyperledger Iroha',
    slug: 'hyperledger-iroha',
    definition: 'A blockchain framework designed for infrastructure projects, developed by SORAMITSU. It focuses on digital identity, asset management, and supply chain applications, with plans for integration with SORA.',
    category: 'technology',
    aliases: ['Iroha', 'Hyperledger', 'SORAMITSU', 'Framework'],
  },
  {
    term: 'DeFi',
    slug: 'defi',
    definition: 'Decentralized Finance - financial applications built on blockchain networks that operate without traditional intermediaries. SORA ecosystem includes various DeFi tools like Polkaswap, staking, and liquidity provision.',
    category: 'defi',
    aliases: ['DeFi', 'Finance', 'Decentralized', 'DEX'],
  },
  {
    term: 'DEX',
    slug: 'dex',
    definition: 'Decentralized Exchange - a platform that allows users to trade cryptocurrencies directly without intermediaries. Polkaswap is the main DEX in the SORA ecosystem.',
    category: 'defi',
    aliases: ['DEX', 'Exchange', 'Trading', 'Polkaswap'],
  },
  {
    term: 'Token Bonding Curve',
    slug: 'token-bonding-curve',
    definition: 'A mathematical model that determines token price based on supply and demand. SORA uses token bonding curves for XOR price discovery and elastic supply management.',
    category: 'economics',
    aliases: ['Bonding Curve', 'Price Discovery', 'Elastic Supply', 'XOR'],
  },
  {
    term: 'Elastic Supply',
    slug: 'elastic-supply',
    definition: 'A monetary policy where token supply adjusts automatically based on demand and price targets. XOR uses elastic supply mechanisms to maintain price stability.',
    category: 'economics',
    aliases: ['Elastic Supply', 'Monetary Policy', 'Supply Management', 'XOR'],
  },
  {
    term: 'Validator',
    slug: 'validator',
    definition: 'Network participants who secure the blockchain by validating transactions and creating new blocks. SORA validators earn rewards in VAL tokens and require XOR stake.',
    category: 'network',
    aliases: ['Validator', 'Node', 'Staking', 'VAL'],
  },
  {
    term: 'Staking',
    slug: 'staking',
    definition: 'The process of locking up tokens to support network security and earn rewards. In SORA, users can stake XOR to earn VAL rewards and participate in governance.',
    category: 'defi',
    aliases: ['Staking', 'Rewards', 'XOR', 'VAL'],
  },
  {
    term: 'Liquidity Pool',
    slug: 'liquidity-pool',
    definition: 'A collection of tokens locked in smart contracts to facilitate trading on DEXs. Polkaswap uses liquidity pools for automated market making and provides PSWAP rewards to liquidity providers.',
    category: 'defi',
    aliases: ['Liquidity Pool', 'AMM', 'Trading', 'PSWAP'],
  },
  {
    term: 'Cross-chain',
    slug: 'cross-chain',
    definition: 'Technology that enables communication and value transfer between different blockchain networks. SORA and Polkaswap support cross-chain swaps between Ethereum, Bitcoin, and Polkadot ecosystems.',
    category: 'technology',
    aliases: ['Cross-chain', 'Interoperability', 'Bridge', 'Multi-chain'],
  },
  {
    term: 'CBDC',
    slug: 'cbdc',
    definition: 'Central Bank Digital Currency - digital forms of fiat currency issued by central banks. SORA has partnered with central banks to develop CBDC solutions using blockchain technology.',
    category: 'economics',
    aliases: ['CBDC', 'Digital Currency', 'Central Bank', 'Fiat'],
  },
  {
    term: 'SORAMITSU',
    slug: 'soramitsu',
    definition: 'A Japanese blockchain development company that created the SORA network, Polkaswap, and Hyperledger Iroha. They focus on building infrastructure for the future of finance.',
    category: 'network',
    aliases: ['SORAMITSU', 'Company', 'Developer', 'Japan'],
  },
  {
    term: 'Parachain',
    slug: 'parachain',
    definition: 'Individual blockchains that run in parallel within the Polkadot ecosystem. SORA operates as a parachain, benefiting from shared security and interoperability with other parachains.',
    category: 'network',
    aliases: ['Parachain', 'Polkadot', 'Parallel', 'Interoperability'],
  },
  {
    term: 'Blockchain',
    slug: 'blockchain',
    definition: 'A distributed ledger technology that maintains a continuously growing list of records (blocks) linked and secured using cryptography. SORA is built on blockchain technology using the Substrate framework.',
    category: 'technology',
    aliases: ['Blockchain', 'Ledger', 'Distributed', 'Cryptography'],
  },
];

interface GlossaryStaticProps {
  initialTerm?: string;
}

export default function GlossaryStatic({ initialTerm }: GlossaryStaticProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Filter terms based on search and category
  const filteredTerms = staticTerms.filter(term => {
    const matchesSearch = !searchQuery || 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  const categories = [
    { name: 'token', count: 3 },
    { name: 'defi', count: 4 },
    { name: 'technology', count: 4 },
    { name: 'governance', count: 1 },
    { name: 'network', count: 3 },
    { name: 'economics', count: 3 },
  ];

  return (
    <div className="max-w-4xl mx-auto glossary-app">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="glossary-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Glossary
          </label>
          <div className="relative">
            <input
              id="glossary-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, definitions, or tags..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || selectedCategory) && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTerms.length} of {staticTerms.length} terms (showing first 20 of 58 total)
          </p>
          {filteredTerms.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No terms found. Try adjusting your search or filters.
            </p>
          )}
        </div>

        {/* Terms List */}
        {filteredTerms.length > 0 && (
          <div className="space-y-3">
            {filteredTerms.map((term) => (
              <div
                key={term.slug}
                id={`glossary-${term.slug}`}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {term.term}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {term.definition}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryChange(term.category);
                        }}
                        className="px-2 py-1 rounded-full font-medium transition-colors cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        {term.category}
                      </button>
                      {term.aliases.length > 1 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          Also: {term.aliases.slice(1, 4).map((alias, index) => (
                            <span key={alias} className="hover:text-link dark:hover:text-link-hover">
                              {alias}{index < term.aliases.slice(1, 4).length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info about full glossary */}
      <div className="mt-8 p-4 bg-status-info/10 dark:bg-status-info/20 border border-status-info/30 dark:border-status-info/40 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-status-info" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-status-info dark:text-status-info">
              Full Glossary Available
            </h3>
            <div className="mt-2 text-sm text-status-info/90 dark:text-status-info/80">
              <p>
                This shows the first 20 terms of our complete SORA glossary. 
                The full glossary contains <strong>58 terms</strong> covering tokens, technology, governance, DeFi, network infrastructure, and economics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}