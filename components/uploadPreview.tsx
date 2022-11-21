import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Router, {useRouter} from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";

type Props = {
    imageUrl: string;
};

const UploadPreview = ({ imageUrl }: Props) => {
    const [copied, setCopied] = useState<boolean>(false);
    const router = useRouter();

    return (
        <>
            <div className="flex w-full justify-center">
                <div className="preview_wrapper">
                    <CheckCircleIcon className="text-green-300 mx-auto w-12 h-12" />
                    <p className="text-center">Upload Successful</p>
                    <div className="preview_img_box">
                        <Image
                            alt="uploaded_img"
                            src={imageUrl}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="preview_link_container">
                        <span className="truncate">{imageUrl}</span>
                        <CopyToClipboard text={imageUrl} onCopy={() => setCopied(true)}>
                            <button className="preview_copy_button">
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </CopyToClipboard>
                    </div>

                    <button onClick= { router.reload }> Back to Image Uploader </button>
                </div>
            </div>
        </>
    );
};

export default UploadPreview;