export type NFTAttribute = {
  trait_type: string;
  value: string;
};

export type NFTMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
};

export type NFTCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean;
};

export type NFT = {
  meta: NFTMeta;
} & NFTCore;

export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
};

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};
