// @ts-nocheck

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useEditorContext } from '../markdown/context/EditorContext'
import { useMintNew } from '../../hooks/useMintNew'
import { useMintWithData } from '../../hooks/useMintWithData'

const junghwan_eth = "0x4C53C6D546C9E38db56040Ab505460A9187A5281"
const tranqui_eth = "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8"

const CreateForm = () => {

  const [mintNewConfig, setMintNewConfig] = useState({
      recipients: [junghwan_eth, tranqui_eth],
      quantity: "1",
      tokenLogic: "0x7Bc662793a16769777172A3a2c029A16BdC7E038",
      tokenLogicInit: {
          initialAdmin: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
          mintExistingStartTime: "0",
          mintExistingPrice: "0"
      },
      tokenRenderer: "0x0a2bAD624b74b0093fDcFe22C447294b2c512e48",
      tokenRendererInit: {
          // tokenURI: tokenURI ? tokenURI : ""
          tokenURI: ""
      },
      fundsRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
      royaltyBPS: "0",
      primarySaleFeeRecipient: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
      primarySaleFeeBPS: "0",
      soulbound: "false"
  })

  const {
    config,
    error,
    write,
    data,
    isError,
    isLoading,
    isSuccess,
    status,
    mintNewData,
    mintNewLoading,
    tokenIdMinted    
  } = useMintNew({
    mintNewConfig: mintNewConfig
  })

  console.log("tokenIdMinted", tokenIdMinted)

  const [mintWithDataConfig, setMintWithDataConfig] = useState({
    // curatedAddress not calculated in state
    selectedTokenId: "",
    // curator address not calculated in state
    curatorTargetType: 4, // (1 = nft contract, 3 = curation contract, 4 = nft item)
    sortOrder: 0,
    hasTokenId: true,
    chainId: 5    
  })

  const {
    curationConfig,
    curationError,
    curationWrite,
    curationData,
    curationIsError,
    curationIsLoading,
    curationIsSuccess,
    curationStatus,
    mintWaitData,
    mintWaitLoading   
  } = useMintWithData({
    mintWithDataConfig: mintWithDataConfig,
    tokenToCurate: tokenIdMinted
  })  

  // publishing markdown to ipfs 
  const editorContext = useEditorContext()
  // const [isPublishing, setIsPublishing] = useState(false);
  // const [publishError, setPublishError] = useState(false);
  // const [publishedCid, setPublishedCid] = useState('')

  // handling inputs for tokenMetadata + mint price
  const [tokenMetadata, setTokenMetadata] = useState({
      "name": "",
      "description": "",
      "image": "",
      "animation_url": "",
  })

  const [mintPrice, setMintPrice] = useState(0);

  const handleName = (e) => {
      setTokenMetadata((prevTokenMetadata) => ({
          ...prevTokenMetadata,
          name: e.target.value,
      }));
  };

  const handleDescription = (e) => {
      setTokenMetadata((prevTokenMetadata) => ({
          ...prevTokenMetadata,
          description: e.target.value,
      }));
  };

  const handleAnimationUrl = (path) => {
    setTokenMetadata((prevTokenMetadata) => ({
        ...prevTokenMetadata,
        animation_url: path,
    }));
  };

  const handleTokenURI = (uri) => {
    setMintNewConfig((prevConfig) => ({
        ...prevConfig,
        tokenRendererInit: {
          tokenURI: uri
        }
    }));
  };  

  // handling image upload
  const [thumbnail, setThumbnail] = useState(null);

  const [uploadLoading, setUploadLoading] = useState(false)

  const inputFileRef = useRef();

  const handleClick = () => {
    inputFileRef.current.click();
  };

  const coverImageUpload = async (file: File) => {
    const imageCID = await editorContext.uploadImage(file)
    console.log("imageCID: ", imageCID)
    setTokenMetadata((prevTokenMetadata) => ({
        ...prevTokenMetadata,
        image: "ipfs://" + imageCID,
    }));
}  

  const handleImageUpload = async (e) => {
    setUploadLoading(true)
    const imageFile = e.target.files[0];
    if (imageFile) {
        await coverImageUpload(imageFile);
        setThumbnail(imageFile)
    }
    setUploadLoading(false)
  };  

  const handleMarkdownUpload = async () => {
    try {
      const cid = await editorContext.publishMarkdown();
      console.log("published markdown cid: ", "ipfs://" + cid)
      const animationUrl = "ipfs://" + cid;
      handleAnimationUrl(animationUrl)
      return animationUrl;
    } catch (err) {
      console.error('Error publishing document', err);
    }
    console.log("what is the state :", tokenMetadata.animation_url)
  }

  const handleMetadataUpload = async (animationUrl) => {

    if (!animationUrl) return

    const updatedTokenMetadata = {
      ...tokenMetadata,
      animation_url: animationUrl,
    };    

    try {
      const jsonString = JSON.stringify(updatedTokenMetadata)
      const jsonBlob = new Blob([jsonString], { type: "application/json" });
      const jsonFile = new File([jsonBlob], "tokenMetadata.json", { type: "application/json", lastModified: Date.now() });
      const cid = await editorContext.uploadTokenMetadata(jsonFile)
      return cid
      console.log("metadata cid: ", cid)
    } catch (err) {
      console.error("Error uploading metadata", err)
    }
  }

  const [minting, setMinting] = useState(false)

  // tbd form submit / mint button?
  const pinAndMint = async () => {
    setMinting(true)
    try {
      const animationUrl = await handleMarkdownUpload();
      // const tokenURI = "ipfs://" + await handleMetadataUpload(animationUrl);
      handleTokenURI("ipfs://" + await handleMetadataUpload(animationUrl))
      // await handleTokenURI(tokenURI)
      write()
    } catch (err) {
      console.error("Error in minting process")
    }
    setMinting(false)
  };

  const justPin = async () => {
    setMinting(true)
    try {
      const animationUrl = await handleMarkdownUpload();
      const tokenURI = "ipfs://" + await handleMetadataUpload(animationUrl);
      console.log("tokenURI")
      handleTokenURI(tokenURI)
    } catch (err) {
      console.error("Error in minting process")
    }
    setMinting(false)    
  }

  const mintNewToken = async () => {
    write()
    setMintWithDataConfig((prevConfig) => ({
      ...prevConfig,
      selectedTokenId: tokenIdMinted
    }));
  }

  
  return (
    // <form onSubmit={handleSubmit} className="font-sans pl-4 flex flex-row flex-wrap justify-center items-start ">
    <div className="font-sans pl-4 flex flex-row flex-wrap justify-center items-start ">
      <h1 className="flex flex-row w-full h-fit  text-[18px]">Publish</h1>
      <>
      
        {!thumbnail ? (
            <div
                onClick={handleClick} 
                className="hover:bg-[#FAFAFA] hover:cursor-pointer flex flex-row w-full justify-center items-center h-[209px] border-[1.2px] border-[#E1E1E1] rounded-[8px]"
                >
                {/* Implement your drag-and-drop functionality here */}
                <div>
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="13.5" cy="13.5" r="13.5" fill="#F2F2F2"/>
                    <path d="M10.4667 11.1778L13.6444 8M13.6444 8L16.8222 11.1778M13.6444 8V17.4167M7 13.5V15.9722C7 18.5722 7.46222 19.7278 9.31111 19.7278C11.16 19.7278 14.3185 19.7278 17.1111 19.7278C18.0741 19.7278 20 19.3811 20 17.9944C20 16.6078 20 13.8852 20 13.5" stroke="#6B6B6B"/>
                    </svg>
                </div>
                &nbsp;
                <div>
                Upload cover image
                </div>
                <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />        
            </div>
        ) : (
            <div
                className="relative flex flex-row w-full justify-center items-center h-[209px] border-[1.2px] border-[#E1E1E1] rounded-[8px]"
            >
                <Image
                    src={URL.createObjectURL(thumbnail)}
                    fill
                    className="object-contain"
                    alt="Uploaded Thumbnail"
                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(thumbnail))}                
                />
            </div>            
        )}
      </>



      <div className="w-full">
        <h2>Title</h2>
        <input
          type="text"
          value={tokenMetadata.name}
          placeholder='Creating Public Assembly'
          onChange={handleName}
          className="p-2 w-full border-[1.2px] border-[#E1E1E1] rounded-[8px]"
        />
      </div>

      <div className="w-full">
        <h2>Description</h2>
        <input
          type="text"
          value={tokenMetadata.description}
          placeholder="For the past 173 days, I’ve been trying to figure out how to create and operate a DAO. The first 96 days was creating Public Assembly; under the one mission to create what’s missing. What I’ve realized since launching Public Assembly as an onchain DAO is that Public Assembly ..."
        //   onChange={(e) => setInput2(e.target.value)}
        onChange={handleDescription}
          className="p-2 w-full border-[1.2px] border-[#E1E1E1] rounded-[8px]"
        />
      </div>

      <div className="w-full">
        <h2>Price (ETH)</h2>
        <input
          type="text"
          value={mintPrice}
          onChange={(e) => setMintPrice(e.target.value)}
          placeholder='0.0007 ETH'
          className="p-2 w-full border-[1.2px] border-[#E1E1E1] rounded-[8px]"
        />
      </div>

      <div className="flex flex-row justify-start space-x-1 w-full h-fit">
        <button 
          onClick={()=>justPin()}
          className="w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white"
        >
            pin
        </button>
        <button 
          // onClick={()=>write()}
          onClick={()=>mintNewToken()}
          className="w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white"
        >
            mint
        </button>    
        <button 
          // onClick={()=>write()}
          onClick={()=>curationWrite()}
          className="w-[73px] py-2 rounded-[5.3px] border-[1.2px] border-black bg-black text-white hover:text-black hover:bg-white"
        >
            curate
        </button>               
      </div>
      

      {/* <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Submit
      </button> */}
    {/* </form> */}  
    </div>
  );
};

export default CreateForm;