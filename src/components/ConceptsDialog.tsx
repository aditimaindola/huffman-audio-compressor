
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Binary, TreePine, Zap, Calculator, Award } from 'lucide-react';

const ConceptsDialog = () => {
  const concepts = [
    {
      id: "fundamentals",
      title: "Fundamental Concepts",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        {
          term: "Data Compression",
          definition: "The process of reducing the size of data by eliminating redundancy while preserving essential information."
        },
        {
          term: "Lossless Compression",
          definition: "Compression technique where the original data can be perfectly reconstructed from the compressed data."
        },
        {
          term: "Information Theory",
          definition: "Mathematical study of information transmission, storage, and processing, founded by Claude Shannon."
        },
        {
          term: "Entropy",
          definition: "Measure of the average information content in a message, indicating the minimum bits needed per symbol."
        }
      ]
    },
    {
      id: "coding-theory",
      title: "Coding Theory",
      icon: <Binary className="w-5 h-5" />,
      items: [
        {
          term: "Prefix-Free Codes",
          definition: "Variable-length codes where no codeword is a prefix of another, ensuring unique decodability."
        },
        {
          term: "Variable-Length Encoding",
          definition: "Encoding scheme where different symbols are assigned codes of different lengths."
        },
        {
          term: "Optimal Codes",
          definition: "Codes that achieve the minimum expected length for a given probability distribution."
        },
        {
          term: "Code Efficiency",
          definition: "Measure of how close a code's average length is to the theoretical minimum (entropy)."
        }
      ]
    },
    {
      id: "tree-structures",
      title: "Tree Structures",
      icon: <TreePine className="w-5 h-5" />,
      items: [
        {
          term: "Binary Tree",
          definition: "Tree data structure where each node has at most two children (left and right)."
        },
        {
          term: "Leaf Nodes",
          definition: "Terminal nodes in the tree that represent individual symbols in the alphabet."
        },
        {
          term: "Internal Nodes",
          definition: "Non-terminal nodes that represent merged frequency groups during tree construction."
        },
        {
          term: "Tree Traversal",
          definition: "Process of visiting nodes to generate codes: left edge = 0, right edge = 1."
        }
      ]
    },
    {
      id: "algorithm",
      title: "Huffman Algorithm",
      icon: <Zap className="w-5 h-5" />,
      items: [
        {
          term: "Greedy Algorithm",
          definition: "Algorithm that makes locally optimal choices at each step to find a global optimum."
        },
        {
          term: "Priority Queue",
          definition: "Data structure used to efficiently select nodes with minimum frequency during tree construction."
        },
        {
          term: "Frequency Analysis",
          definition: "Process of counting symbol occurrences to determine their probabilities."
        },
        {
          term: "Tree Construction",
          definition: "Bottom-up process of building the Huffman tree by repeatedly merging lowest-frequency nodes."
        }
      ]
    },
    {
      id: "mathematics",
      title: "Mathematical Concepts",
      icon: <Calculator className="w-5 h-5" />,
      items: [
        {
          term: "Shannon's Theorem",
          definition: "Establishes the theoretical limit for lossless compression based on entropy."
        },
        {
          term: "Expected Code Length",
          definition: "Average number of bits per symbol: Σ(probability × code_length)."
        },
        {
          term: "Compression Ratio",
          definition: "Ratio of original size to compressed size, indicating compression effectiveness."
        },
        {
          term: "Kraft Inequality",
          definition: "Mathematical condition for the existence of prefix-free codes with given lengths."
        }
      ]
    },
    {
      id: "applications",
      title: "Real-World Applications",
      icon: <Award className="w-5 h-5" />,
      items: [
        {
          term: "File Compression",
          definition: "Used in ZIP, GZIP, and other file compression utilities for text and data files."
        },
        {
          term: "Image Compression",
          definition: "Component of JPEG compression for encoding quantized DCT coefficients."
        },
        {
          term: "Audio Compression",
          definition: "Used in MP3 and other audio codecs for lossless compression of audio data."
        },
        {
          term: "Network Protocols",
          definition: "Applied in HTTP/2, WebSocket compression, and other network communication protocols."
        }
      ]
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Key Concepts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Huffman Coding: Key Concepts & Terms
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <Accordion type="multiple" className="space-y-4">
            {concepts.map((category) => (
              <AccordionItem key={category.id} value={category.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {category.icon}
                    </div>
                    <span className="font-semibold text-lg">{category.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-semibold text-blue-800 mb-2">
                          {item.term}
                        </div>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          {item.definition}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">💡 Study Tip</h3>
            <p className="text-sm text-gray-600">
              Understanding these concepts will help you better appreciate the mathematical elegance 
              and practical importance of Huffman coding in computer science and information theory.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConceptsDialog;
