import React from 'react'
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom'
import { getTemplateDetails, saveToCollections, saveToFavourites } from '../api';
import { MainSpinner, Template } from '../components';
import { Link } from 'react-router-dom';
import { FaHouse } from 'react-icons/fa6';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import { fadeInWithOpacity } from '../animations';
import useUser from '../hooks/useUser';
import useTemplates from '../hooks/useTemplates';
import { AnimatePresence, } from 'framer-motion';


export default function ResumeDetail() {
    const { templateID } = useParams();
    const { data, isError, isLoading, refetch } =
        useQuery('template', () => getTemplateDetails(templateID));


    const { data: user, refetch: userRefetch } = useUser();
    const { data: templates, refetch: templateRefetch, isLoading: templateLoading } = useTemplates();

    if (isLoading) return <MainSpinner />;

    if (isError) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <p className="text-lg text-txtPrimary font-semibold">
                    Error while fetching the data... Please try again later
                </p>
            </div>
        );
    }

    const addToCollection = async (e) => {
        e.stopPropagation(); // Ensure you call stopPropagation as a function
        await saveToCollections(user, data); // Assuming 'data' is available in the scope
        userRefetch(); // Assuming 'userRefetch' is a function provided by useUser()
    };

    const addToFavourites = async (e) => {
        e.stopPropagation(); // Ensure you call stopPropagation as a function
        await saveToFavourites(user, data); // Assuming 'data' is available in the scope
        templateRefetch(); // Assuming 'userRefetch' is a function provided by useUser()
        refetch();
    };

    return (
        <div className="w-full flex items-center justify-start flex-col px-4 py-12">

            {/* headline */}
            <div className="w-full flex items-center pb-8 gap-2">
                <Link to="/" className="flex items-center justify-center gap-2 text-txtPrimary">
                    <FaHouse /> Home
                </Link>
                <p>/</p>
                <p>{data?.name}</p>
            </div>
            {/* main section */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12">
                {/* Left Section */}
                <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4"
                    {...fadeInWithOpacity}>
                    {/* Load the template image */}
                    <img
                        className="w-full h-auto object-contain rounded-md"
                        src={data?.imageURL}
                        alt={data?.title}
                    />
                    {/* Title and Other Options */}
                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        {/* Title Section */}
                        <div className="w-full flex items-center justify-between">
                            {/* Title */}
                            <p className="text-base text-txtPrimary font-semibold">{data?.title}</p>
                            {/* Likes */}
                            {data?.favourites?.length > 0 && (
                                <div className="flex items-center justify-center gap-1">
                                    <BiSolidHeart className="text-base text-red-500" />
                                    <p className="text-base text-txtPrimary font-semibold">
                                        {data?.favourites.length} likes
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* { collection and favourites options } */}
                        {user && (
                            <div className="flex items-center justify-center gap-3">
                                {user?.collections?.includes(data?._id) ? (
                                    <React.Fragment>
                                        <div className="flex items-center justify-center px-4 py-2 rounded-nd border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={addToCollection}>
                                            <BiSolidFolderPlus className="text-base text-txtPrimary" />
                                            <p className="text-sm text-txtPrimary whitespace-nowrap">
                                                Remove From Collections
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div className="flex items-center justify-center px-4 py-2 rounded-nd border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={addToCollection}>
                                            <BiFolderPlus className="text-base text-txtPrimary" />
                                            <p className="text-sm text-txtPrimary whitespace-nowrap">
                                                Add to Collections
                                            </p>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        )}

                        {data && (
                            <div className="flex items-center justify-center gap-3">
                                {data?.favourites?.includes(user?.uid) ? (
                                    <React.Fragment>
                                        <div className="flex items-center justify-center px-4 py-2 rounded-nd border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={addToFavourites}>
                                            <BiSolidHeart className="text-base text-txtPrimary" />
                                            <p className="text-sm text-txtPrimary whitespace-nowrap">
                                                Remove From Favourites
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div className="flex items-center justify-center px-4 py-2 rounded-nd border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={addToFavourites}>
                                            <BiHeart className="text-base text-txtPrimary" />
                                            <p className="text-sm text-txtPrimary whitespace-nowrap">
                                                Add to Favourites
                                            </p>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        )}

                    </div>
                </div>
                {/* right section */}
                <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6">
                    <div className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative" style={{
                        background: "url(https://en.wikipedia.org/wiki/Image#/media/File:Image_created_with_a_mobile_phone.png)",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}>
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                            <Link className="px-4 py-2 rounded-md border-2 border-gray-50 text-white">
                                Discover more
                            </Link>
                        </div>
                    </div>
                    {user && (
                        <Link
                            className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer"
                            to={`/resume/${data?.name}?templateId=${templateID}`}
                        >
                            <p className="text-white font-semibold text-lg">
                                Edit this Template
                            </p>
                        </Link>
                    )}

                    {/* tags */}
                    <div className="w-full flex items-center gap-2">
                        {data?.tags?.map((tag, index) => (
                            <p
                                key={index}
                                className="border border-gray-300 rounded cursor-pointer px-2 group whitespace-nowrap"
                            >
                                {tag}
                            </p>
                        ))}
                    </div>



                </div>

            </div>

            {/* similar templates */}
            {/* similar templates */}
            {templates?.filter((temp) => temp?._id !== data?._id)
                .length > 0 && (
                    <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
                        <p className="text-lg font-semibold text-txtDark">
                            You might also like
                        </p>
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
                            <>
                                {templates.filter((temp) => temp?._id !== data?._id)
                                    .map((template, index) => (
                                        <React.Fragment key={template?._id}>
                                            <AnimatePresence>
                                                <Template
                                                    key={template?._id}
                                                    data={template}
                                                    index={index}
                                                />
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))}
                            </>
                        </div>
                    </div>
                )}


        </div >

    );
};
