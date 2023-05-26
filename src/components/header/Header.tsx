import Link from "next/link";
import Image from "next/image";
import mutualLogo from "../../public/icons/logo-mutual_blue.svg"

export const Header = () => {
    return (
        <div className="  flex flex-row justify-start ml-[16px] sm:justify-start fixed flex-wrap text-[15px] top-[20px] w-full z-10">
            <div className="tracking-[0px] flex flex-row justify-start flex-wrap">
                <Link className="" href="/">
                    <Image
                        src={mutualLogo}
                        alt="logo"
                    />
                </Link>
            </div>

        </div>
    );
};
