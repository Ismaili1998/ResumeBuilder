import React from 'react'
import Filters from '../components/Filters'
import useTemplates from '../hooks/useTemplates';
import { MainSpinner, Template } from '../components';
import { AnimatePresence, motion } from 'framer-motion';


export default function HomeContainer() {
    const {
        data: templates,
        isError: temp_isError,
        isLoading: temp_isLoading,
        refetch: temp_refetch,
    } = useTemplates();

    if (temp_isLoading) {
        return <MainSpinner />;
    }
    // Rest of your code to render based on templates or handle errors

    return (
        <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
            {/* Filter section */}
            <Filters />
            {/* Render those templates - Resume PIN */}
            {temp_isError ? (
                <React.Fragment>
                    <p className="text-lg text-txtDark">
                        Something went wrong... Please try again later
                    </p>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
                        {<RenderTemplate templates={templates} />}
                    </div>
                </React.Fragment>
            )}
        </div>

    )

};

const RenderTemplate = ({ templates }) => {
    return (
        <React.Fragment>
            {templates && templates.length > 0 && (
                <React.Fragment>
                    <AnimatePresence>
                        {templates.map((template, index) => (
                            <motion.div key={index}>
                                <Template data={template} index={index} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};
