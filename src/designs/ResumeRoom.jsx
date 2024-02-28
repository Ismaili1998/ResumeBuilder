// ResumeRoom.js
import React, { useState } from 'react';
import Experience from '../components/resumeComponents/Experience';
import { getTemplateDetailEditByUser } from '../api';
import { useQuery } from 'react-query';
import useUser from '../hooks/useUser';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RingLoader } from 'react-spinners';

const ResumeRoom = () => {

    const { pathname } = useLocation();
    const templateName = pathname?.split("/")?.slice(-1)?.[0] || '';
    const { data: user } = useUser();
    const {
        data: resumeData,
        isLoading: resume_isLoading,
    } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
        getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
    );

    return (
        <div className="flex justify-center items-center w-full">
            <div className="bg-white p-8 shadow-emerald-50 w-2/3">
                <h1 className="text-2xl font-bold mb-4">Resume Room - Page N° 1</h1>
                {!resume_isLoading ? (<div className="grid grid-cols-2 gap-4">
                    <div className='left-section'>
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold mb-2"> WORK EXPERIENCE </h2>
                            <Experience data={resumeData?.experiences} />
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold mb-2"> Education</h2>
                            {/* Add your education detai    ls here */}
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold mb-2"> Education</h2>
                            {/* Add your education details here */}
                        </div>
                        {/* Add other sections as needed */}
                    </div>
                    <div className='right-section'>
                        {/* Add your resume content, experience, education sections, etc. */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold mb-2"> SOFT SKILLS </h2>
                            {/* Add your experience details here */}
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold mb-2"> CERTIFICATES</h2>
                            {/* Add your education details here */}
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold mb-2"> INTERESTS</h2>
                            {/* Add your education details here */}
                        </div>
                        {/* Add other sections as needed */}
                    </div>
                </div>) : (
                    <RingLoader PuffLoader color="#498FCD" size={100} />
                )}
            </div>
        </div>

    );
};

export default ResumeRoom;
