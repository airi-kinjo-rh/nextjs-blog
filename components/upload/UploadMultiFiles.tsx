import { NextPage } from "next";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import initFirebase from "../../lib/firebase";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Head from "next/head";
import { PhotographIcon } from "@heroicons/react/solid";
import Link from "next/link";
import UploadProgress from "./UploadProgress";
import UploadPreview from "./UploadPreview";

type Image = {
  imageFile: Blob;
};

initFirebase().then((r) =>
  console.log("Firebase has been init successfully", r)
);
const storage = getStorage();

const MultiImageUploader: NextPage = () => {
  const [images, setImages] = useState([]);

  let [progress, setProgress] = useState<number>(0); //データアップロードの進捗率%
  const [imageUrls, setImageUrls] = useState<string[]>([]); //アップロード完了後のファイルURL文字列
  const [loading, setLoading] = useState<boolean>(false); //これは、ただBooleanの変数を持ってるだけっぽいな
  const [success, setSuccess] = useState<boolean>(false); //loadingとどっちかで良さそうではある

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.map((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: index, src: e.target.result },
        ]);
      };
      console.log("images: ", images);

      uploadImageToFirebase({ imageFile: file }).then((file) =>
        console.log(index + " done upload image: " + file)
      );
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 5,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const metadata = {
    contentType: "image/jpeg",
  };

  // Firebase Storage
  const uploadImageToFirebase = async ({ imageFile }: Image) => {
    try {
      setLoading(true);
      const storageRef = ref(storage, imageFile.name); // 引数2番めが、storageに保存するファイル名。 'images/' + file.name でディレクトリも指定可。
      const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata); // upload the file and metadata
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done!!!");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("User does not have permission to access the object");
              console.log(error.message);
              break;
            default:
              console.log(error.message);
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at: ", downloadURL);
            // setImageUrls((prevState) => [...prevState, downloadURL]);
            setImageUrls((prevState) => [...prevState, downloadURL]);
            setLoading(false);
            setSuccess(true);
          });
        }
      );
    } catch (e: any) {
      console.log("uploadTask.on catch error -->", e.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Image Uploader</title>
      </Head>
      <div className="main_container">
        {!success && (
          <div
            className={` ${loading ? "hidden" : ""} flex justify-center mt-10 `}
          >
            <div className="dropzone">
              <p className="font-bold">Upload your image</p>
              <p>File should be jpeg, png...</p>
              <div {...getRootProps()} className="drag_drop_wrapper">
                {/* react-dropzone の書き方 */}
                <input hidden {...getInputProps()} />
                <PhotographIcon className="w-16 h-16 text-blue-300" />
                {/* isDragActive は、領域にファイルがドラッグされているかどうかのBool値 */}
                {isDragActive ? (
                  <p> Drop the photo here... </p>
                ) : (
                  <p>Drag & Drop your image here</p>
                )}
              </div>
              <p>Or</p>
              <div className="flex w-full justify-center">
                <button onClick={open} className="dropzone_button">
                  Choose a file
                </button>
              </div>
              <Link href={`/`}>Back to HomePage</Link>
            </div>
          </div>
        )}

        {loading && <UploadProgress progress={progress} />}
        {success && <UploadPreview imageUrls={imageUrls} />}
      </div>
    </>
  );
};

export default MultiImageUploader;
