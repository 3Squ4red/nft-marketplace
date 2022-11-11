import { CryptoHookFactory } from "../../../types/hooks";
import { NFT } from "../../../types/nft";
import useSWR from "swr";
import { ethers } from "ethers";
import { toast } from "react-toastify";

type UseListedNftsResponse = {
  buyNFT: (token: number, value: number) => Promise<void>;
};
type ListedNftsHookFactory = CryptoHookFactory<NFT[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedNfts" : null,
      async () => {
        const nfts = [] as NFT[];
        const coreNfts = await contract!.getAllNFTsOnSale();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenID);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenID.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
        }

        return nfts;
      }
    );

    const buyNFT = async (tokenId: number, value: number) => {
      try {
        const result = await contract?.buyNFT(tokenId, {
          value: ethers.utils.parseEther(value.toString()),
        });

        await toast.promise(result!.wait(), {
          pending: "Just a moment.. and you'll adopt him!",
          success:
            "Woohoo! You just adopted a cute creature 🥰 Check it out in your profile",
          error: "Oops! Something went wrong. Please try again",
        });
      } catch (e: any) {
        console.error(e.message);
        toast.error(e.message);
      }
    };

    return {
      ...swr,
      buyNFT,
      data: data || [],
    };
  };
