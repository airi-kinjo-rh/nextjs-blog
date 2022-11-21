import {NextPage} from "next";
import React, { useState, useCallback } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography, Button } from "@material-ui/core";

import { useDropzone } from "react-dropzone";
import firebase, { storage } from "../helpers/firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {alerts} from "firebase-functions/lib/v2";
import Head from "next/head";
import {PhotographIcon} from "@heroicons/react/solid";

type Image = {
    imageFile: Blob;
};

const ImageUploader: NextPage = () => {
    // useState() を使って、コンポーネント内で状態管理を行いたい変数を宣言する。
    // const [count, setCount] = useState(0);
    // ↑ count:変数, setCountメソッドを使ってcountの値を変更する。0がcount変数の初期値。
    let [progress, setProgress] = useState<number>(0); //データアップロードの進捗率%
    const [imageUrl, setImageUrl] = useState<string>(""); //アップロード完了後のファイルURL文字列
    const [loading, setLoading] = useState<boolean>(false); //これは、ただBooleanの変数を持ってるだけっぽいな
    const [success, setSuccess] = useState<boolean>(false); //loadingとどっちかで良さそうではある

    // useCallback()はパフォーマンス向上のためのフックで、メモ化したコールバック関数を返す。useCallback(コールバック関数, [依存配列])
    // メモ化: 同じ結果を返す処理において、初回のみ処理を実行記録しておき、2回目以降は前回の結果を計算せず値のみ呼び出せるようにすること。
    const onDrop = useCallback((acceptedFiles: File[]) => {
        //Upload files to storage
        const file = acceptedFiles[0];
        if (!file) return;
        uploadImageToFirebase({imageFile: file}).then(r => console.log('done upload image: ' + r));
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
        onDrop,
    });

    // Firebase Storage
    const uploadImageToFirebase = async ({ imageFile }: Image) => {
        try {
            setLoading(true);
            const storageRef = ref(storage, imageFile.name); // 引数2番めが、storageに保存するファイル名。 'images/' + file.name でディレクトリも指定可。
            const uploadTask = uploadBytesResumable(storageRef, imageFile); // upload the file and metadata
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done!!!');
                    setProgress(progress);
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log('User does not have permission to access the object');
                            console.log(error.message);
                            break;
                        default:
                            console.log(error.message);
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at: ', downloadURL);
                        setImageUrl(downloadURL);
                        setLoading(false);
                        setSuccess(true);
                    });
                },
            );
        } catch (e: any) {
            console.log(e.message);
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Image Uploader</title>
            </Head>
            <div className={` ${loading ? "hidden" : ""} flex justify-center mt-10 `}>
                <div className="dropzone">
                    <p className="font-bold">Upload your image</p>
                    <p>File should be jpeg, png...</p>
                    <div {...getRootProps()} className="drag_drop_wrapper">
                        {/*こういうもんっぽい*/}
                        <input hidden {...getInputProps()} />
                        <PhotographIcon className="w-16 h-16 text-blue-300" />
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
                </div>
            </div>
        </>
    )
};

export default ImageUploader;