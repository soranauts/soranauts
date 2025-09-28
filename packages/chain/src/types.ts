export interface QuoteRequest {
  a: string;
  b: string;
  amount: string;
}

export interface QuoteResponse {
  out: string;
  fee: string;
  route: string[];
}

export interface Balance {
  symbol: string;
  balance: bigint;
  decimals: number;
}

export interface SwapHistory {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

export interface ChainConfig {
  rpcUrl: string;
  wsUrl: string;
  dexApiUrl: string;
  indexerUrl: string;
}


