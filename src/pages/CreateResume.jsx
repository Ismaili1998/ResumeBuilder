
import React from "react";
import { Route, Routes } from "react-router-dom";
import { TemplatesData } from "../utils/helpers";
import ResumeRoom from "../designs/ResumeRoom";


const CreateResume = () => {
    return (
        <div className="w-full flex flex-col items-center justify-start py-4">
            {/* <Routes>
                {TemplatesData.map((template) => (
                    <Route
                        key={template?.id}
                        path={`/${template.name}`}
                        Component={template.component}
                    />
                ))}
            </Routes> */}
            <ResumeRoom></ResumeRoom>
        </div>
    );
};

export default CreateResume;
