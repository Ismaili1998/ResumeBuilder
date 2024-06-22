import React, { useRef, useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import { FaMinus, FaTrash, FaPlus } from 'react-icons/fa6';
import { IoColorPalette } from "react-icons/io5";
import { CgArrowDown, CgArrowUp } from "react-icons/cg";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import "react-datepicker/dist/react-datepicker.css";
import ContentEditable from 'react-contenteditable';
import CustomDate from '../CustomDate';
import Achievement from './Achievement';

const Experience = ({ data }) => {

    const initialExperience = [
        {
            id: Date.now(),
            title: '',
            company: '',
            description: '',
            startDate: 33,
            endDate: Date.now(),
            achievements: ["value 1", "value 2"],
        },
    ];

    const { pathname } = useLocation();
    const templateName = pathname?.split("/")?.slice(-1)[0];

    const [experiences, setExperiences] = useState(data || initialExperience);
    const [isEdit, setIsEdit] = useState(-1);
    const [pushData, setPushData] = useState(false);
    const { data: user } = useUser();
    const containerRef = useRef(null);


    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsEdit(-1);
            setPushData(!pushData);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const removeExperience = (id) => {
        if (experiences.length > 1) {
            const updatedExperiences = experiences.filter((experiencen, index) => index !== id);
            setExperiences(updatedExperiences)
            setIsEdit(-1)
            setPushData(!pushData)
        } else {
            toast.info('Only one experience left ! ')
        }

    };

    const newExperience = (index) => {
        if (experiences.length < 50) {
            const newExperience = {
                id: Date.now(),
                title: '',
                company: '',
                description: '',
                startDate: '',
                endDate: '',
                achievements: ['A', 'B'],
            };
            let updatedExperiences = [...experiences];
            updatedExperiences.splice(index + 1, 0, newExperience);
            setExperiences(updatedExperiences);
            setIsEdit(-1);
        } else {
            toast.info('Are you sure, you have more thn 50 experiences ?')
        }
    };


    const moveDown = (index) => {
        if (index + 1 < experiences.length) {
            const updatedExperiences = [...experiences]; // Create a copy of the array
            const experience = updatedExperiences[index];
            updatedExperiences[index] = updatedExperiences[index + 1];
            updatedExperiences[index + 1] = experience;
            setExperiences(updatedExperiences); // Update the state with the new array
            setIsEdit(-1);
            setPushData(!pushData)

        }
    };

    const moveUp = (index) => {
        if (index > 0) {
            const updatedExperiences = [...experiences]; // Create a copy of the array
            const experience = updatedExperiences[index];
            updatedExperiences[index] = updatedExperiences[index - 1];
            updatedExperiences[index - 1] = experience;
            setExperiences(updatedExperiences); // Update the state with the new array
            setIsEdit(-1);
            setPushData(!pushData)

        }
    };

    const handleChange = (e, index, field) => {
        const value = e.target.value.replace(/<[^>]*>/g, '');
        const updatedExperiences = [...experiences];
        updatedExperiences[index][field] = value;
        setExperiences(updatedExperiences);

    };

    const handleDateChange = (date, index, field) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index][field] = date;
        setExperiences(updatedExperiences);
    }

    const handleAchievement = (achievements, index) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index].achievements = achievements;
        setExperiences(updatedExperiences);

    }

    const handleFocus = (index) => {
        if (isEdit != index) {
            setIsEdit(index)
            if (isEdit != -1) {
                setPushData(!pushData)

            }
        }
    }

    const saveExperiences = async () => {
        const resume_id = `${templateName}-${user?.uid}`;
        try {
            await updateDoc(doc(db, "users", user?.uid, "resumes", resume_id), {
                experiences: experiences
            });
            // toast.success(`Experiences Updated`);
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        {
            // saveExperiences()
        }
    }, [pushData])



    return (
        <div ref={containerRef}>
            {isEdit >= 0 && (<div class="w-10 absolute h-100 bg-gray-900 -left-5 -mt-10 rounded-full px-2 py-5">
                <div className='bg-green-500 rounded-full p-1 mb-8'
                    onClick={() => newExperience(isEdit)}
                >
                    <FaPlus className='cursor-pointe text-white cursor-pointer' />
                </div>
                <div className='bg-green-500 rounded-full p-1 mb-8'>
                    <CgArrowUp className='cursor-pointe text-white cursor-pointer'
                        onClick={() => moveUp(isEdit)}
                    />
                </div>
                <div className='bg-green-500 rounded-full p-1 mb-8'>
                    <CgArrowDown className='cursor-pointe text-white cursor-pointer'
                        onClick={() => moveDown(isEdit)}
                    />
                </div>
                <div className='bg-green-500 rounded-full p-1 mb-8'>
                    <IoColorPalette className='cursor-pointe text-white cursor-pointer'
                        onClick={() => moveDown(isEdit)}
                    />
                </div>
                <div className='p-1 cursor-pointer'
                    onClick={() => removeExperience(isEdit)}
                >
                    <FaTrash className='text-gray-300' />
                </div>
            </div>)}
            <ol class="relative w-full border-s border-gray-200 dark:border-gray-700"
            >
                {experiences.map((experience, index) => (

                    <li class="mb-6 ms-4"
                        key={index}
                        onFocus={() =>
                            handleFocus(index)}
                    >

                        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 
                                -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
                        </div>
                        <ContentEditable
                            className="w-full text-lg font-bold text-blue-500 
                                leading-5 dark:text-white focus:outline-none focus:border-b-2 border-blue-500"
                            html={experience.title}
                            placeholder={'Position title'}
                            onChange={(evt) => handleChange(evt, index, 'title')}
                        />
                        <ContentEditable
                            className="w-full text-lg text-blue-500 dark:text-white 
                                leading-5 focus:outline-none focus:border-b-2 border-blue-500"
                            html={experience.company}
                            type='text'
                            placeholder={'Company name'}
                            onChange={(evt) => handleChange(evt, index, 'company')}
                        />
                        <CustomDate handleDateChange={(date) => handleDateChange(date, index, 'start-date')}
                            customDate={new Date()}
                        />
                        <ContentEditable
                            className="w-full text-gray-500 dark:text-gray-600 
                                text-md leading-5 focus:outline-none focus:border-b-2 border-dashed"
                            html={experience.description}
                            placeholder={'Description'}
                            onChange={(evt) => handleChange(evt, index, 'description')}
                        />
                        <h6 class="flex items-center mb-1 text-base font-semibold text-gray-900 dark:text-white"> Achivements </h6>
                        <Achievement
                            achievements={experience.achievements}
                            handleAchievement={(achievements) => handleAchievement(achievements, index)}
                        />
                    </li>
                ))
                }

            </ol >
        </div >

    )
}

export default Experience;
