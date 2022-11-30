import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";

type Props = {
  imageUrls: string[];
};

type Test = {
  image: string;
  index: number;
};

const UploadPreview = ({ imageUrls }: Props) => {
  // const [copied, setCopied] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean[]>([]);
  const router = useRouter();

  const ShowImages = (image) => {
    console.log("image:", image);
    return (
      <div className="preview_img_box">
        <Image
          alt="uploaded_img"
          src={image}
          layout="fill"
          objectFit="cover"
          className="rounded-lg shadow-lg"
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="preview_wrapper">
          <CheckCircleIcon className="text-green-300 mx-auto w-12 h-12" />
          <p className="text-center">Upload Successful</p>

          {imageUrls.map((image, index) => {
            return (
              <>
                <div key={index} className="preview_img_box">
                  <Image
                    alt="uploaded_img"
                    src={image}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-lg"
                  />
                </div>
                {/*<ShowImages image={image} />*/}

                <div className="preview_link_container">
                  <span className="truncate">{image}</span>
                  <CopyToClipboard
                    text={image}
                    onCopy={() =>
                      setCopied((prevStates) => {
                        const newStates = [...prevStates];
                        newStates[index] = true;
                        return newStates;
                      })
                    }
                  >
                    <button className="preview_copy_button">
                      {copied[index] ? "Copied!" : "Copy"}
                    </button>
                  </CopyToClipboard>
                </div>
              </>
            );
          })}
          {/*<ShowImages imageUrls={imageUrls} />*/}
          <button onClick={router.reload}> Back to Image Uploader </button>
        </div>
      </div>
    </>
  );
};

export default UploadPreview;
