import Image from "next/image";
import Link from 'next/link';

export const Listing = ({index, metadata, collection}: any) => {

    // NOTE:
    // Not currently in use but can acceess info about the listing in the metadata prop
    // Ex: metadata?.title, metadata?.contract.contractDeployer

    const convertDate = (date: string | number | Date) => {
        const dateObj = new Date(date)
        const options: any = { month: 'long', day: 'numeric', year: 'numeric' };
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
            <div className=" flex flex-col w-full text-[15px] border-b-[1px] border-[#96C4E4] pb-[12px]">
                <div className="relative w-[352px] h-auto sm:h-[465px] sm:w-full mb-[4px]">
                    <Link className="" href={`/${index}`}>
                        <Image
                            src={metadata?.media[0]?.gateway}
                            height={465}
                            width={826}
                            className="object-contain object-left"
                            alt={`cover image for feed item ${index}: ${metadata?.title}`}
                        />
                    </Link>
                </div>
                <div className="pt-[2px] font-IBMPlexMonoLight text-[#646464] flex flex-col sm:flex-row items-start flex-wrap w-full break-words">
                    <p className="font-IBMPlexMono text-[#0194FF]">{metadata?.title.toUpperCase()}</p>
                    <p className="sm:ml-4 font-IBMPlexMonoLight text-[#646464]">{publicationDate}</p> 
                </div>  
            </div>
        )}
        </>
    )
}