import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slideUpDownWithScale } from "../animations";
import { tags } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";

const Filters = () => {
    const [isClearHovered, setIsClearHovered] = useState(false);
    const { data: filtersData, isLoading, isError } = useFilters();
    const queryClient = useQueryClient()
    const handleFilterValue = (value) => {
        // const prevState = queryClient.getQueryData('globalFilter');
        // const updateState = { ...prevState, searchItem: value }
        // queryClient.setQueryData("globalFilter", updateState)
        queryClient.setQueryData("globalFilter", {
            ...queryClient.getQueryData("globalFilter"),
            searchTerm: value
        });




    }

    const clearFilter = (e) => {
        queryClient.setQueryData("globalFilter", {
            ...queryClient.getQueryData("globalFilter"),
            searchTerm: ""
        });
    };


    return (
        <div className="w-full flex items-center justify-start py-4">
            <div
                onClick={clearFilter}

                className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative"
                onMouseEnter={() => setIsClearHovered(true)}
                onMouseLeave={() => setIsClearHovered(false)}
            >
                <MdLayersClear className="text-xl" />
                <AnimatePresence>
                    {isClearHovered && (
                        <motion.div
                            {...slideUpDownWithScale}
                            className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1"
                        >
                            <p className="whitespace-nowrap text-xs">Clear all</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
                {tags &&
                    tags.map((item, index) => (
                        <div
                            onClick={() => handleFilterValue(item)}
                            key={index}
                            className={`border border-gray-300 rounded cursor-pointer px-6 group hover:shadow-md
                        ${filtersData && filtersData?.searchTerm === item && 'bg-gray-300 shadow-md'}`}
                        >
                            <p className="text-sm text-txtPrimary group-hover:text-Dark whitespace-nowrap">
                                {item}
                            </p>
                        </div>
                    ))}
            </div>

        </div >

    );
};

export default Filters;
