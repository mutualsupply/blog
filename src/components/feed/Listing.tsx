// @ts-nocheck
// import Image from "next/legacy/image";
import Image from "next/image";
import Link from 'next/link';

export const Listing = ({index,  metadata, collection}: any) => {

    const title = metadata && metadata?.title
    const author = metadata && metadata?.contract.contractDeployer

    const convertDate = (date) => {
        const dateObj = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options).toUpperCase()
        return formattedDate
    }        
    const publicationDate = metadata && convertDate(metadata?.timeLastUpdated)    

    return (
        <>
        {!metadata || !collection ? (
            // TODO: maybe add a loading state instead here?
            <div></div>            
        ) : (
            <div className="relative flex flex-col w-full text-[15px] border-b-[1px] border-[#96C4E4] pb-[12px]">
                <div className="w-[352px] h-full sm:h-[465px] sm:w-full relative mb-[4px]">
                    <Link href={`/${index}`}>
                        <Image
                            src={metadata?.media[0]?.gateway}
                            fill
                            className="object-contain object-left"

                        />
                    </Link>
                </div>
                <div className="pt-[2px] font-IBMPlexMonoLight text-[#646464] flex flex-row items-start flex-wrap w-full break-words">
                    <p className="font-IBMPlexMono text-[#0194FF]">{metadata?.title.toUpperCase()}</p>
                    &nbsp;&nbsp;{publicationDate}
                </div>  
            </div>
        )}
        </>
    )
}