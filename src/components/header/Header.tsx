import Link from "next/link";
import Image from "next/image";
import React from "react";

export const Header = () => {
    return (
        <div className="  flex flex-row justify-start ml-[16px] sm:justify-start fixed flex-wrap text-[15px] top-[20px] w-full z-10">
            <div className="tracking-[0px] flex flex-row justify-start flex-wrap">
                <Link className="" href="/">
                    <img
                        src={"/icons/logo-mutual_blue.svg"}
                        alt="logo"
                    />
                </Link>
            </div>

        </div>
    );
};
