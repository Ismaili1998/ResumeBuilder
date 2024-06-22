import React, { useRef, useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import { FaMinus, FaTrash, FaPlus } from 'react-icons/fa6';
import { CgArrowDown, CgArrowUp } from "react-icons/cg";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import "react-datepicker/dist/react-datepicker.css";
import ContentEditable from 'react-contenteditable';


const Education = ({ data }) => {

    const initialEducation = [
        {
            id: Date.now(),
            title: '',
            institute: '',
            description: 'desc',
            startDate: '',
            endDate: '',
        },
    ];

    const { pathname } = useLocation();
    const templateName = pathname?.split("/")?.slice(-1)[0];

    const [educations, setEducations] = useState(data || initialEducation);
    const [isEdit, setIsEdit] = useState(-1);
    const [pushData, setPushData] = useState(false);
    const { data: user } = useUser();
    const containerRef = useRef(null);


    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target) && isEdit != -1) {
            setIsEdit(-1);
            setPushData(!pushData);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });

    const removeEducation = (id) => {
        if (educations.length > 1) {
            const updatedEducations = educations.filter((education) => education.id !== id);
            setEducations(updatedEducations)
            setIsEdit(-1)
            setPushData(!pushData)
        } else {
            toast.info('Only one education left ! ')
        }

    };

    const newEducation = (index) => {
        if (educations.length < 50) {
            const newEducation = {
                id: Date.now(),
                title: '',
                institute: '',
                description: '',
                startDate: '',
                endDate: '',
                achievements: [],
            };
            let updatedEducations = [...educations];
            updatedEducations.splice(index + 1, 0, newEducation);
            setEducations(updatedEducations);
            setIsEdit(-1);
        } else {
            toast.info('Are you sure, you have more thn 50 educations ?')
        }
    };


    const moveEducationDown = (index) => {
        if (index + 1 < educations.length) {
            const updatedEducations = [...educations]; // Create a copy of the array
            const education = updatedEducations[index];
            updatedEducations[index] = updatedEducations[index + 1];
            updatedEducations[index + 1] = education;
            setEducations(updatedEducations); // Update the state with the new array
            setIsEdit(-1);
            setPushData(!pushData)

        }
    };

    const moveEducationUp = (index) => {
        if (index > 0) {
            const updatedEducations = [...educations]; // Create a copy of the array
            const education = updatedEducations[index];
            updatedEducations[index] = updatedEducations[index - 1];
            updatedEducations[index - 1] = education;
            setEducations(updatedEducations); // Update the state with the new array
            setIsEdit(-1);
            setPushData(!pushData)

        }
    };

    const handleEdit = (e, index, field) => {
        const value = e.target.value.replace(/<[^>]*>/g, '');
        const updatedEducations = [...educations];
        updatedEducations[index][field] = value;
        setEducations(updatedEducations);

    };

    const handleFocus = (index) => {
        if (isEdit != index) {
            setIsEdit(index)
            if (isEdit != -1) {
                setPushData(!pushData)

            }
        }
    }

    const saveEducations = async () => {
        const resume_id = `${templateName}-${user?.uid}`;
        try {
            await updateDoc(doc(db, "users", user?.uid, "resumes", resume_id), {
                educations: educations
            });
            // toast.success(`Educations Updated`);
        } catch (err) {
            toast.error(`Error while saving your infos !`);
        }
    };

    useEffect(() => {
        {
            // saveEducations()
        }
    }, [pushData])


    return (
        <ol class="relative border-s border-gray-200 dark:border-gray-700"
            ref={containerRef}
        >
            {educations.map((education, index) => (

                <li class="mb-6 ms-4"
                    key={index}

                >
                    {index === isEdit && (<div class="absolute h-100 bg-gray-800 -ml-20 -mt-20 rounded-full px-3 py-5">
                        <div className='bg-green-500 rounded-full p-1 mb-8'
                            onClick={() => newEducation(index)}
                        >
                            <FaPlus className='cursor-pointe text-white cursor-pointer' />
                        </div>
                        <div className='bg-green-500 rounded-full p-1 mb-8'>
                            <CgArrowUp className='cursor-pointe text-white cursor-pointer'
                                onClick={() => moveEducationUp(index)}
                            />
                        </div>
                        <div className='bg-green-500 rounded-full p-1 mb-8'>
                            <CgArrowDown className='cursor-pointe text-white cursor-pointer'
                                onClick={() => moveEducationDown(index)}
                            />
                        </div>

                        <div className='p-1 cursor-pointer'
                            onClick={() => removeEducation(education.id)}
                        >
                            <FaTrash className='text-gray-300' />
                        </div>
                    </div>)}
                    <div
                        onFocus={() =>
                            handleFocus(index)}
                    >
                        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                        <div className='w-full'>
                            <ContentEditable
                                className="break-all w-full text-lg font-bold text-blue-500 
                                dark:text-white focus:outline-none focus:border-b-2 border-blue-500"
                                html={education.title}
                                placeholder={'Degree title'}
                                type='text'
                                onChange={(evt) => handleEdit(evt, index, 'title')}
                            />
                        </div>
                        <div>
                            <ContentEditable
                                className="w-full text-lg text-blue-500 dark:text-white 
                                focus:outline-none focus:border-b-2 border-blue-500"
                                html={education.institute}
                                type='text'
                                name='institute'
                                placeholder={'Institue name'}
                                onChange={(evt) => handleEdit(evt, index, 'institute')}
                            />
                        </div>
                        <time class="w-50 text-sm flex justify-start items-center font-normal 
                                    leading-none text-gray-400 dark:text-gray-500">
                            <span> 02/2024</span>
                            <FaMinus className='text-blue-600 mx-1' />
                            <span> 02/2025</span>
                        </time>
                        <div>
                            <ContentEditable
                                className="w-full text-gray-500 dark:text-gray-600 text-md 
                                focus:outline-none focus:border-b-2 border-dashed"
                                type='text'
                                name='description'
                                html={education.description}
                                placeholder={'description'}
                                onChange={(evt) => handleEdit(evt, index, 'description')}
                            />
                        </div>
                    </div>

                </li>
            ))
            }

        </ol >
    )
}

export default Education;
