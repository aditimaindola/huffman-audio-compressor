
export interface HuffmanNode {
  symbol: string | null;
  frequency: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  id: string;
}

export function buildHuffmanTree(frequencyData: Array<{symbol: string, frequency: number}>): HuffmanNode | null {
  console.log('Building Huffman tree with frequency data:', frequencyData);
  
  if (frequencyData.length === 0) {
    console.log('No frequency data provided');
    return null;
  }
  
  // Handle single character case
  if (frequencyData.length === 1) {
    console.log('Single character case, creating simple tree');
    return {
      symbol: frequencyData[0].symbol,
      frequency: frequencyData[0].frequency,
      left: null,
      right: null,
      id: 'single-node'
    };
  }
  
  // Create leaf nodes
  const nodes: HuffmanNode[] = frequencyData.map((item, index) => ({
    symbol: item.symbol,
    frequency: item.frequency,
    left: null,
    right: null,
    id: `leaf-${index}`
  }));

  let nodeIdCounter = frequencyData.length;

  // Build tree using greedy algorithm
  while (nodes.length > 1) {
    // Sort by frequency (ascending)
    nodes.sort((a, b) => a.frequency - b.frequency);
    
    // Take two nodes with lowest frequency
    const left = nodes.shift();
    const right = nodes.shift();
    
    // Safety check
    if (!left || !right) {
      console.error('Error: Could not get nodes for merging');
      break;
    }
    
    // Create internal node
    const merged: HuffmanNode = {
      symbol: null,
      frequency: left.frequency + right.frequency,
      left,
      right,
      id: `internal-${nodeIdCounter++}`
    };
    
    nodes.push(merged);
  }
  
  console.log('Huffman tree built successfully');
  return nodes[0] || null;
}

export function generateHuffmanCodes(root: HuffmanNode | null): {[key: string]: string} {
  if (!root) {
    console.log('No root node provided for code generation');
    return {};
  }
  
  const codes: {[key: string]: string} = {};
  
  // Handle single node case
  if (root.symbol !== null && !root.left && !root.right) {
    codes[root.symbol] = '0';
    return codes;
  }
  
  function traverse(node: HuffmanNode, code: string) {
    if (node.symbol !== null) {
      // Leaf node
      codes[node.symbol] = code || '0';
    } else {
      // Internal node
      if (node.left) traverse(node.left, code + '0');
      if (node.right) traverse(node.right, code + '1');
    }
  }
  
  traverse(root, '');
  console.log('Generated Huffman codes:', codes);
  return codes;
}

export function encodeMessage(message: string, codes: {[key: string]: string}): string {
  return message.split('').map(char => codes[char] || '').join('');
}

export function decodeMessage(encodedMessage: string, root: HuffmanNode | null): string {
  if (!root || !encodedMessage) return '';
  
  let decoded = '';
  let currentNode = root;
  
  for (const bit of encodedMessage) {
    if (bit === '0') {
      currentNode = currentNode.left!;
    } else {
      currentNode = currentNode.right!;
    }
    
    if (currentNode.symbol !== null) {
      decoded += currentNode.symbol;
      currentNode = root;
    }
  }
  
  return decoded;
}

export function calculateCompressionRatio(originalText: string, encodedMessage: string): number {
  const originalBits = originalText.length * 8; // ASCII encoding
  const compressedBits = encodedMessage.length;
  return originalBits / compressedBits;
}

export function getTreeDepth(node: HuffmanNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}
