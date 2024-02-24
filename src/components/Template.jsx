import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInWithOpacity, scaleInOut } from "../animations";
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from "react-icons/bi"; // Importing BiFolderPlus icon
import { saveToCollections, saveToFavourites } from "../api";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const Template = ({ data, index }) => {

    const { data: user, refetch: userRefetch } = useUser();
    const { refetch: templateRefetch } = useTemplates();
    const [isHovrred, setIsHoverred] = useState(false)
    const navigate = useNavigate()

    const addToCollection = async (e) => {
        e.stopPropagation(); // Ensure you call stopPropagation as a function
        await saveToCollections(user, data); // Assuming 'data' is available in the scope
        userRefetch(); // Assuming 'userRefetch' is a function provided by useUser()
    };

    const addToFavourites = async (e) => {
        e.stopPropagation(); // Ensure you call stopPropagation as a function
        await saveToFavourites(user, data); // Assuming 'data' is available in the scope
        templateRefetch(); // Assuming 'userRefetch' is a function provided by useUser()
    };

    const handleRouteNavigation = () => {
        navigate(`/resumeDetail/${data?._id}`, { replace: true });

    };

    return (
        <motion.div key={data?._id} {...scaleInOut(index)}>
            <div className="w-full h-[500px] 2xl:h-[740px] rounded-md bg-gray-200 overflow-hidden relative px-5 py-5"
                onMouseEnter={() => setIsHoverred(true)}
                onMouseLeave={() => setIsHoverred(false)}
            >
                <img
                    src={data?.imageURL}
                    className="w-full h-full object-cover"
                    alt="Image"
                />
                <AnimatePresence>
                    {isHovrred &&
                        <motion.div
                            {...fadeInWithOpacity} // Spread the animation variant props
                            onClick={handleRouteNavigation}
                            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col 
                            items-center justify-start px-4 py-3 z-50 cursor-pointer"
                        >
                            <div className="flex flex-col items-end justify-start w-full gap-8">
                                <InnerBoxCard
                                    label={user?.collections?.includes(data?._id) ? "Already in Collection" : "Add To Collection"}
                                    Icon={user?.collections?.includes(data?._id) ? BiSolidFolderPlus : BiFolderPlus}
                                    onHandle={addToCollection}
                                />
                                <InnerBoxCard
                                    label={data?.favourites?.includes(user?.uid) ? "Already in Favorites" : "Add to Favorites"}
                                    Icon={data?.favourites?.includes(user?.uid) ? BiSolidHeart : BiHeart}
                                    onHandle={addToFavourites}
                                />
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Template;
const InnerBoxCard = ({ label, Icon, onHandle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onHandle}
            onMouseEnter={() => setIsHovered(true)}  // Wrap in arrow function or pass as reference
            onMouseLeave={() => setIsHovered(false)} // Wrap in arrow function or pass as reference
            className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative cursor-pointer"
        >
            <Icon className="text-txtPrimary text-base" />
            {label && <p>{Icon}</p>}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.6, x: 50 }}
                        className="px-3 py-2 rounded-md bg-gray-200 absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45"
                    >
                        <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


