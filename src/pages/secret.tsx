// @ts-nocheck
import useMintNew from '../hooks/useMintNew';
import useMintWithData from '../hooks/useMintWithData';
import { useState } from 'react';

const mutualdesign_eth = "0xEfFE6b3DBA2E39aA1085f88a93AB8563Ba45bAa6"
const losingmyego_eth = "0xB00A93fF31217E49c3674e05b525f239a85bb78f"
const salief_eth = "0x784FA0c3C12aEe8f571EF3c91408cb2219B431dC"

// //

function Secret() {

    const [mintNewConfig, setMintNewConfig] = useState({
        recipients: [mutualdesign_eth, losingmyego_eth, salief_eth],
        quantity: "1",
        tokenLogic: "0x7218E2714d1C29FBda6E528F6b65E1216Cd2a73A",
        tokenLogicInit: {
            initialAdmin: mutualdesign_eth,
            mintExistingStartTime: "0",
            mintExistingPrice: "0"
        },
        tokenRenderer: "0x4E1AD7A0D2e25Fb80AE8B18aFc90243C07f4aED9",
        tokenRendererInit: {
            // tokenURI: tokenURI ? tokenURI : ""
            tokenURI: "ipfs://bafkreic5feo5bsxw3ugas3p3sczkg6smcx5xlsppg2cnjkgsuvxtoujisi"
        },
        fundsRecipient: mutualdesign_eth,
        royaltyBPS: "0",
        primarySaleFeeRecipient: mutualdesign_eth,
        primarySaleFeeBPS: "0",
        soulbound: "false"
    })    

    const {
        write,
        writeAsync,
        data,
        isError,
        isLoading,
        isSuccess,
        status,
        tokenIdMinted,
      } = useMintNew({ mintNewConfig });  
      
      const [mintWithDataConfig, setMintWithDataConfig] = useState({
        // curatedAddress not calculated in state
        selectedTokenId: "2",
        // curator address not calculated in state
        curatorTargetType: 4, // (1 = nft contract, 3 = curation contract, 4 = nft item)
        sortOrder: 0,
        hasTokenId: true,
        chainId: 11155 //incorrect chain id for sepolia to stay inside uint16 lmit    
      })
      
      const {
        curationConfig,
        curationError,
        curationWrite,
        curationWriteAsync,
        curationData,
        curationIsError,
        curationIsLoading,
        curationIsSuccess,
        curationStatus,
        mintWaitData,
        mintWaitLoading   
      } = useMintWithData({
        mintWithDataConfig: mintWithDataConfig,
        tokenToCurate: "2"
      })        


  return (
    <div className="flex flex-row justify-center items-center flex-wrap h-100vh w-full">
       <div className='pt-20 flex flex-row flex-wrap w-full justify-center'>
            <button onClick={()=>write?.()}className="w-fit px-4 py-2 border-black border-[1px] hover:bg-black hover:text-white">
                Mint
            </button>
            <button onClick={()=>curationWrite?.()}className="ml-2 w-fit px-4 py-2 border-black border-[1px] hover:bg-black hover:text-white">
                Curate
            </button>            
        </div> 
    </div>
  );
}

export default Secret;
