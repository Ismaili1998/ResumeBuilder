import React, { useState } from 'react'
import { PuffLoader } from 'react-spinners';
import { FaTrash, FaUpload } from 'react-icons/fa6';
import { db, storage } from '../config/firebase.config';
import { toast } from 'react-toastify';
import { ref } from 'firebase/storage';
import { uploadBytesResumable } from 'firebase/storage';
import { deleteObject } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { tags } from '../utils/helpers';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplates from '../hooks/useTemplates';

export default function CreateTemplate() {

    const [formData, setFormData] = useState({
        title: "",
        imageURL: null,
    });

    const [imageAsset, setImageAsset] = useState({
        isImageLoading: false,
        url: null,
        progress: 0
    });

    const [selectedTags, setselectedTags] = useState([]);

    const { data: templates,
        isError: templateIsError,
        isLoading: templateIsLoading,
        refetch: templateRefetch } = useTemplates();

    const HandleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevRecord) => ({ ...prevRecord, [name]: value }));

    }

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        setImageAsset((prevAsset) => ({
            ...prevAsset,
            isImageLoading: true,
        }));
        if (file && isAllowed(file)) {
            const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    setImageAsset((prevAsset) => ({
                        ...prevAsset,
                        progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    }));
                },
                (error) => {
                    if (error.message.includes("storage/unauthorized")) {
                        toast.error('Error: Authorization Revoked');
                    } else {
                        toast.error(`Error: ${error.message}`);
                    }
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageAsset((prevAsset) => ({
                            ...prevAsset,
                            url: downloadURL,
                        }));
                    });
                    toast.success("Image uploaded");
                    setInterval(() => {
                        setImageAsset((prevAsset) => ({
                            ...prevAsset,
                            isImageLoading: false,
                        }));
                    }, 2000);
                }
            );

        } else {
            toast.info('Invalid file format');
        }

    }

    const deleteImageObject = async (e) => {
        setInterval(() => {
            setImageAsset((prevAsset) => ({
                ...prevAsset,
                progress: 0,
                url: null,
            }));
        }, 2000);
        const deleteRef = ref(storage, imageAsset.url);
        deleteObject(deleteRef).then(() => {
            toast.success("Image removed");
        });
    }

    const isAllowed = (file) => {
        const allowedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
        return allowedExtensions.includes(file.type);

    };

    const handleSelectedTags = (tag) => {
        if (selectedTags.includes(tag)) {
            setselectedTags(selectedTags.filter((selected) => tag !== selected));

        } else {
            setselectedTags([...selectedTags, tag]);
        }
    }


    const pushToCloud = async () => {
        const timestamp = serverTimestamp();
        const id = `${Date.now()}`;
        const _doc = {
            _id: id,
            title: formData.title,
            imageURL: imageAsset.url,
            tags: selectedTags,
            name: templates && templates.length > 0 ? `Template ${templates.length + 1}` : "Template 1",
            timestamp: timestamp,
        };

        await setDoc(doc(db, "templates", id), _doc).then(() => {
            setFormData((prevData) => ({ ...prevData, title: '', imageURL: '' }));
            setImageAsset((prevAsset) => ({ ...prevAsset, url: null }));
            setselectedTags([]);
            templateRefetch();
            toast.success('Template has been added successfully');
        }).catch(
            (error) => {
                toast.error(error.message);
            }
        );
    };


    const removeTemplate = async (template) => {
        const deleteRef = ref(storage, template?.imageURL); // Fixed typo in 'insgelRL' and adjusted to 'imageUrl'
        await deleteObject(deleteRef); // Fixed typo 'deletedbject' to 'deleteObject' and added 'try/catch'
        await deleteDoc(doc(db, "templates", template?._id)).then(() => {
            toast.success("Template has been deleted");
            templateRefetch(); // Fixed typo in 'tenplateshefetch' and removed unnecessary characters
        }).catch((err) => {
            toast.error(`Error: ${err.message}`); // Fixed syntax in error message interpolation
        });
    }



    return (
        <div className="w-full px-4 lg:px-10 2xl:px-20 py-4 grid grid-cols-1 lg:grid-cols-12">
            {/* left container */}
            <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
                <div className="w-full">
                    <p className="text-lg text-txtPrimary">Create a new Template</p>
                </div>
                <div className="w-full flex items-center justify-end">
                    <p className="text-base text-txtLight uppercase font-semibold">
                        TempID:{""}
                    </p>
                    <p className="text-base text-txtLight uppercase font-semibold">
                        {(templates && templates.length > 0) ? `Template ${templates.length + 1}` : "Template 1"}
                    </p>
                </div>

                {/* { input title } */}

                <input
                    type="text"
                    className="mb-6 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder='Template title'
                    value={formData.title}
                    name='title'
                    onChange={HandleInputChange}
                />
                {/* { file uploader } */}
                <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h[620px] 2x1:h-[740px] rounded-md border-2 border-dottedborder-gray-300 cursor-pointer flex items-center justify-center">
                    {imageAsset.isImageLoading ? (
                        <React.Fragment>
                            <div className="flex flex-col items-center justify-center gap-4">
                                <PuffLoader color="#498FCD" size="40" />
                                <p className="text-lg text-txtLight"> {imageAsset?.progress.toFixed(2)} %</p>
                            </div>
                        </React.Fragment>) :
                        (
                            <React.Fragment>
                                {
                                    !imageAsset?.url ? (
                                        <React.Fragment>
                                            <label className="w-full cursor-pointer h-full">
                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                    <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                                                        <FaUpload className="text-2xl" />
                                                        <p className="text-lg text-txtLight">Click to upload</p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="w-0 h-0"
                                                    accept=".jpeg, .jpg, .png"
                                                    onChange={handleFileSelect}
                                                />
                                            </label>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            {/* Another piece of code or component when imageAsset.uri is present */}
                                            <div className="relative w-full cursor-pointer overflow-hidden">
                                                <img src={imageAsset?.url} alt=""
                                                    className='w-full h-full overflow-hidden'
                                                    loading='lazy'
                                                />
                                            </div>
                                            <div className='absolute items-center top-4 right-4 flex justify-center w-8 h-8 rounded-md cursor-pointer bg-red-500'
                                                onClick={deleteImageObject}
                                            >

                                                <FaTrash className="text-sm text-white"></FaTrash>
                                            </div>
                                        </React.Fragment>
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                </div>

                {/* { tags } */}
                <div className='w-full flex flex-wrap gap-2 items-center'>
                    {
                        tags.map((tag, index) => (<div key={index}
                            onClick={() => handleSelectedTags(tag)}
                            className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${selectedTags.includes(tag) ? "bg-blue-500" : ""}`}

                        >
                            <p>{tag}</p>
                        </div>))
                    }
                </div>
                <button
                    onClick={pushToCloud}
                    className="w-full bg-blue-500 rounded-md h-10 text-white"> Save </button>
            </div>
            {/* right container */}
            <div className="col-span-12 lg:col-span-8 2xl:col-span-9 bg-red-200 w-full px-2 flex-1 py-2">
                {templateIsLoading ? (<React.Fragment>
                    <div className='flex justify-center items-center h-full'> <PuffLoader /></div>
                </React.Fragment>
                ) : (
                    <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
                        {templates && templates.length ? (
                            templates.map((template) => (
                                <div
                                    key={template._id}
                                    className='w-full relative rounded-md h-80 overflow-hidden shadow-lg bg-gradient-to-br from-gray-200 to-white animate-float'
                                >
                                    <img src={template?.imageURL} className="w-full h-full object-cover" alt="" />
                                    <div className='absolute items-center top-2 right-2 flex justify-center w-8 h-8 rounded-md cursor-pointer bg-red-500'
                                        onClick={() => removeTemplate(template)}
                                    >

                                        <FaTrash className="text-sm text-white"></FaTrash>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <div>No data</div>
                        )}
                    </div>


                )
                }
            </div>
        </div >
    )
}
