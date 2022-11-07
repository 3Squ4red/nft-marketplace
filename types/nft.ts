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
