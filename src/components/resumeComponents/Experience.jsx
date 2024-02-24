import { FaMinus, FaTrash, FaPencil, FaPlus } from 'react-icons/fa6';
import { CgArrowDown, CgArrowUp } from "react-icons/cg";
import { toast } from 'react-toastify';
import React, { useRef, useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import { db } from '../../config/firebase.config';
import ContentEditable from "react-contenteditable";
import { saveToUserExperiences } from '../../api';

export default function Experience() {

    const { data: user, refetch: userRefetch } = useUser();
    const [experiences, setExperiences] = useState(user?.experiences);
    const [isEdit, setIsEdit] = useState(-1);
    const containerRef = useRef(null);

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target) && isEdit != -1) {
            setIsEdit(-1);
            console.log("push to cloud experience n: " + isEdit)
            saveToUserExperiences(user, experiences[isEdit])
            userRefetch()

        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });



    const removeExperience = (id) => {
        setIsEdit(-1)
        if (experiences.length > 1) {
            const updatedExperiences = experiences.filter((experience) => experience.id !== id);
            setExperiences(updatedExperiences);
        } else {
            toast.info('Only one experience left ! ')
        }

    };

    const newExperience = (index) => {
        setIsEdit(-1);
        const newId = `${Date.now()}`;;
        const newExperience = {
            id: newId,
            title: 'Position title',
            company: 'company name',
            year: '2020 - Present',
            description: 'description...',
            achievements: []
        };
        setExperiences((prevExperiences) => [
            ...prevExperiences.slice(0, index + 1),
            newExperience,
            ...prevExperiences.slice(index + 1),
        ]);
    };

    const moveDown = (index) => {
        if (index + 1 < experiences.length) {
            setIsEdit(-1);
            const updatedExperiences = [...experiences]; // Create a copy of the array
            const experience = updatedExperiences[index];
            updatedExperiences[index] = updatedExperiences[index + 1];
            updatedExperiences[index + 1] = experience;
            setExperiences(updatedExperiences); // Update the state with the new array
        }
    };

    const moveUp = (index) => {
        if (index > 0) {
            setIsEdit(-1);
            const updatedExperiences = [...experiences]; // Create a copy of the array
            const experience = updatedExperiences[index];
            updatedExperiences[index] = updatedExperiences[index - 1];
            updatedExperiences[index - 1] = experience;
            setExperiences(updatedExperiences); // Update the state with the new array
        }
    };

    const handleChange = (evt, key, index) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index][key] = evt.target.value;
        setExperiences(updatedExperiences);
    };

    const handleFocus = (index) => {
        if (isEdit != index) {
            setIsEdit(index)

            if (isEdit != -1) {
                console.log("push to cloud experience n:" + isEdit)
                saveToUserExperiences(user, experiences[isEdit])
                userRefetch()
            }

        }
    }




    return (
        <ol class="relative border-s border-gray-200 dark:border-gray-700"
            ref={containerRef}

        >
            {user?.experiences && user.experiences.map((experience, index) => (

                <li class="mb-6 ms-4"
                    key={index}

                >
                    {index === isEdit && (<div class="absolute h-100 bg-gray-800 -ml-20 -mt-20 rounded-full px-3 py-5">
                        <div className='bg-green-500 rounded-full p-1 mb-8'
                            onClick={() => newExperience(index)}
                        >
                            <FaPlus className='cursor-pointe text-white cursor-pointer' />
                        </div>
                        <div className='bg-green-500 rounded-full p-1 mb-8'>
                            <CgArrowUp className='cursor-pointe text-white cursor-pointer'
                                onClick={() => moveUp(index)}
                            />
                        </div>
                        <div className='bg-green-500 rounded-full p-1 mb-8'>
                            <CgArrowDown className='cursor-pointe text-white cursor-pointer'
                                onClick={() => moveDown(index)}
                            />
                        </div>

                        <div className='p-1 cursor-pointer'
                            onClick={() => removeExperience(experience.id)}
                        >
                            <FaTrash className='text-gray-300' />
                        </div>
                    </div>)}
                    <div
                        onFocus={() =>
                            handleFocus(index)}
                    >
                        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                        <ContentEditable
                            className="text-lg font-bold text-blue-500 dark:text-white focus:outline-none focus:border-b-2 border-blue-500"
                            html={experience.title}// innerHTML of the editable div
                            disabled={false} // use true to disable edition
                            key='title'
                            onChange={(evt) => handleChange(evt, 'title', index)} // handle innerHTML change
                        />
                        <ContentEditable
                            className="-mt-1 text-lg text-blue-500 dark:text-white focus:outline-none focus:border-b-2 border-blue-500"
                            html={experience.company}// innerHTML of the editable div
                            disabled={false} // use true to disable edition
                            onChange={(evt) => handleChange(evt, 'company', index)}
                        />
                        <div class="flex items-center justify-between">
                            <time class="flex items-center text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                <span> 07 / 2024 </span>
                                <FaMinus className='w-2 text-blue-600 mx-2' />
                                <span>  Present </span>
                            </time>
                            <p class="text-sm text-gray-400 ml-2">Casablanca, Morocco</p>
                        </div>
                        <ContentEditable
                            className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400 focus:outline-none focus:border-b-2 border-dashed"
                            html={experience.description} // innerHTML of the editable div
                            disabled={false} // use true to disable edition
                            onChange={(evt) => handleChange(evt, 'description', index)} // handle innerHTML change
                        />
                        <h6 class="flex items-center mb-1 text-base font-semibold text-gray-900 dark:text-white"> Achivements </h6>
                        {experience.achievements.map((achievement, i) => (
                            <div key={i} className="mb-1 flex items-start">
                                {/* Achievement icon */}
                                <FaMinus className='w-2 text-blue-600 mr-2 flex-shrink-0' />
                                {/* Achievement details */}
                                <ContentEditable
                                    className="text-sm focus:outline-none focus:border-b-2 border-dashed  w-full"
                                    html={achievement}// innerHTML of the editable div
                                    disabled={false} // use true to disable edition
                                    onChange={(evt) => handleChange(evt, 'achievements', index)} // handle innerHTML change
                                />
                            </div>
                        ))}
                    </div>

                </li>
            ))
            }

        </ol >
    )
}
