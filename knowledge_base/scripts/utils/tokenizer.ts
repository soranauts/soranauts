import { encoding_for_model, get_encoding } from 'tiktoken';
import type { env as KBEnv } from '../env';

/**
 * Tokenize text using tiktoken (cl100k_base encoding for embedding models)
 */
function getEncoder(model: string) {
  try {
    return encoding_for_model(model as any);
  } catch (error) {
    // Fallback for models not in tiktoken table
    return get_encoding('cl100k_base');
  }
}

export function tokenize(text: string, model: string = 'text-embedding-3-large'): number[] {
  const enc = getEncoder(model);
  return enc.encode(text);
}

/**
 * Detokenize token array back to text
 */
export function detokenize(tokens: number[], model: string = 'text-embedding-3-large'): string {
  const enc = getEncoder(model);
  return enc.decode(tokens);
}

/**
 * Token-aware chunking with overlap
 * Returns chunks with token and character offsets
 */
export interface TokenChunk {
  start: number;      // token index start
  end: number;        // token index end
  text: string;       // decoded text
  charStart: number;  // character index start in original text
  charEnd: number;    // character index end in original text
}

export function chunkTokens(
  text: string,
  targetTokens: number = 450,
  overlapRatio: number = 0.15,
  minTokens: number = 200,
  maxTokens: number = 2000,
  model: string = 'text-embedding-3-large'
): TokenChunk[] {
  const enc = getEncoder(model);
  const tokens = enc.encode(text);
  
  const step = Math.max(1, Math.floor(targetTokens * (1 - overlapRatio)));
  const chunks: TokenChunk[] = [];
  
  for (let i = 0; i < tokens.length; i += step) {
    const slice = tokens.slice(i, i + targetTokens);
    
    if (slice.length < minTokens) {
      // Merge with previous chunk if too small
      if (chunks.length > 0) {
        const prev = chunks[chunks.length - 1];
        // Re-chunk from previous start
        const extended = tokens.slice(prev.start, i + slice.length);
        if (extended.length <= maxTokens) {
          chunks[chunks.length - 1] = {
            start: prev.start,
            end: i + slice.length,
            text: detokenize(extended, model),
            charStart: prev.charStart,
            charEnd: text.length, // approximate
          };
        }
      }
      break;
    }
    
    // Limit to maxTokens
    const finalSlice = slice.length > maxTokens ? slice.slice(0, maxTokens) : slice;
    
    const chunkText = detokenize(finalSlice, model);
    // Find character positions (approximate by finding substring)
    const charStart = i === 0 ? 0 : text.indexOf(chunkText.slice(0, 20), chunks.length > 0 ? chunks[chunks.length - 1].charEnd : 0);
    const charEnd = charStart >= 0 ? charStart + chunkText.length : text.length;
    
    chunks.push({
      start: i,
      end: i + finalSlice.length,
      text: chunkText,
      charStart: charStart >= 0 ? charStart : 0,
      charEnd: charEnd,
    });
  }
  
  // Filter chunks that are too small or too large
  return chunks.filter(chunk => {
    const tokenCount = chunk.end - chunk.start;
    return tokenCount >= minTokens && tokenCount <= maxTokens;
  });
}

export function chunkTextByCharacters(
  text: string,
  targetTokens: number = 450,
  overlapRatio: number = 0.15,
  minTokens: number = 200,
  maxTokens: number = 2000
): TokenChunk[] {
  const charsPerToken = 4; // rough approximation
  const targetChars = targetTokens * charsPerToken;
  const maxChars = maxTokens * charsPerToken;
  const minChars = minTokens * charsPerToken;
  const step = Math.max(1, Math.floor(targetChars * (1 - overlapRatio)));

  const chunks: TokenChunk[] = [];

  for (let i = 0; i < text.length; i += step) {
    const slice = text.slice(i, Math.min(i + targetChars, text.length));

    if (slice.length < minChars) {
      if (chunks.length === 0) {
        // Include the remainder even if short to avoid empty outputs
        chunks.push({
          start: 0,
          end: Math.ceil(slice.length / charsPerToken),
          text: slice,
          charStart: i,
          charEnd: i + slice.length,
        });
      }
      break;
    }

    const endIndex = i + slice.length;
    chunks.push({
      start: Math.floor(i / charsPerToken),
      end: Math.ceil(endIndex / charsPerToken),
      text: slice,
      charStart: i,
      charEnd: endIndex,
    });
  }

  return chunks.filter(chunk => {
    const tokenCount = chunk.end - chunk.start;
    return tokenCount >= minTokens && tokenCount <= maxTokens;
  });
}

