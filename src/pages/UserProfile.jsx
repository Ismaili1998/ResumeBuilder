import React, { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import useTemplates from '../hooks/useTemplates';
import { useNavigate } from 'react-router-dom';
import { Template } from '../components';
import { AnimatePresence } from 'framer-motion';

export default function UserProfile() {
    const { data: user, isLoading: userIsLoading } = useUser();
    const [activeTab, setActiveTab] = useState("collections");
    const navigate = useNavigate()
    const { data: templates, isLoading: templateIsLoading, isError: templateError, } = useTemplates();
    useEffect(
        () => {
            if (!userIsLoading && !user)
                return navigate("/auth", { replace: true })
        }, []
    );
    return (
        <div className="w-full flex flex-col items-center justify-start py-12">
            <div className="w-full h-72 bg-blue-500">
                <img
                    src="https://img.freepik.com/premium-photo/natural-marble-pattern-background_1258-22160.jpg"
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="flex items-center justify-center flex-col gap-4">
                    {user?.photoURL ? (
                        <img
                            className="w-24 h-24 rounded-full border-2 border-white shadow-md -mt-12"
                            src={user.photoURL}
                            alt="User Photo"
                            loading="lazy"
                        />
                    ) : (
                        <img
                            className="w-24 h-24 rounded-full border-2 border-white shadow-md -mt-12"
                            src={"avatar image "}
                            alt="User Photo"
                            loading="lazy"
                        />
                    )}
                    <p className="text-2xl text-txtDark"> {user?.displayName} </p>
                    <div className="flex items-center justify-center mt-12">
                        <div
                            className="px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer"
                            onClick={() => setActiveTab('collections')}
                        >
                            <p
                                className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'collections' && 'bg-white shadow-md text-blue-110'
                                    } `}
                            >
                                Collections
                            </p>
                        </div>

                        <div
                            className="px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer"
                            onClick={() => setActiveTab('resumes')}
                        >
                            <p
                                className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'resumes' && 'bg-white shadow-md text-blue-110'
                                    } `}
                            >
                                My Resumes
                            </p>
                        </div>
                    </div>

                </div>

                {/* tab content  */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
                    <AnimatePresence>
                        {activeTab === 'collections' && (
                            <React.Fragment>
                                {user?.collections && user?.collections.length > 0 ? (
                                    <RenderTemplate templates={templates.filter(temp =>
                                        user.collections.includes(temp?._id)

                                    )}
                                    />
                                ) : (
                                    <div>No collections available.</div>
                                )}
                            </React.Fragment>
                        )}

                        {activeTab === 'resumes' && (
                            <React.Fragment>
                                {/* Add code for 'resumes' tab content here */}
                            </React.Fragment>
                        )}
                    </AnimatePresence>
                </div>



            </div>
        </div>
    );
}

const RenderTemplate = ({ templates }) => {
    return (
        <React.Fragment>
            {templates && templates.length > 0 && (
                <React.Fragment>
                    <AnimatePresence>
                        {templates.map((template, index) => (
                            <Template
                                key={template?._id}
                                data={template}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};