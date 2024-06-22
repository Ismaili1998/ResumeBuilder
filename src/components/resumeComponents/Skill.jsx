import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ContentEditable from 'react-contenteditable';
import { useLocation } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { CgArrowLeft, CgArrowRight } from 'react-icons/cg';
import useUser from '../../hooks/useUser';
import { IoColorPalette } from 'react-icons/io5';

const Skill = () => {
    const { pathname } = useLocation();
    const templateName = pathname?.split('/')?.slice(-1)[0];
    const { data: user } = useUser();

    const [skills, setSkills] = useState(['JavaScript', 'React', 'CSS']);
    const [isEdit, setIsEdit] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsEdit(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isEdit]);

    const removeSkill = (index) => {
        if (skills.length > 1) {
            const updatedSkills = skills.filter((_, i) => i !== index);
            setSkills(updatedSkills);
            setIsEdit(null);
        } else {
            toast.info('Only one skill left!');
        }
    };

    const addSkill = (index) => {
        if (skills.length < 50) {
            const newSkill = '';
            const updatedSkills = [...skills];
            updatedSkills.splice(index + 1, 0, newSkill);
            setSkills(updatedSkills);
            setIsEdit(-1);
        } else {
            toast.info('Are you sure you have more than 50 skills?');
        }
    };

    const moveSkillDown = (index) => {
        if (index + 1 < skills.length) {
            const updatedSkills = [...skills];
            const skill = updatedSkills[index];
            updatedSkills[index] = updatedSkills[index + 1];
            updatedSkills[index + 1] = skill;
            setSkills(updatedSkills);
            setIsEdit(null);
        }
    };

    const moveSkillUp = (index) => {
        if (index > 0) {
            const updatedSkills = [...skills];
            const skill = updatedSkills[index];
            updatedSkills[index] = updatedSkills[index - 1];
            updatedSkills[index - 1] = skill;
            setSkills(updatedSkills);
            setIsEdit(null);
        }
    };

    const handleSkillFocus = (index) => {
        if (isEdit !== index) {
            setIsEdit(index);
        }
    };

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/<[^>]*>/g, '');
        const updatedSkills = [...skills];
        updatedSkills[index] = value;
        setSkills(updatedSkills);
    };

    const saveSkill = async () => {
        const resume_id = `${templateName}-${user?.uid}`;
        // Implement saving logic here
    };


    return (
        <div className="flex justify-start gap-2 flex-wrap" ref={containerRef}>
            {isEdit !== null && (
                <div className="w-10 absolute h-100 bg-gray-800 -right-5 -mt-20 rounded-full px-2 py-5">
                    <div className="bg-green-500 rounded-full p-1 mb-8" onClick={() => addSkill(isEdit)}>
                        <FaPlus className="cursor-pointer text-white" />
                    </div>
                    <div className="bg-green-500 rounded-full p-1 mb-8">
                        <CgArrowLeft className="cursor-pointer text-white" onClick={() => moveSkillUp(isEdit)} />
                    </div>
                    <div className="bg-green-500 rounded-full p-1 mb-8">
                        <CgArrowRight className="cursor-pointer text-white" onClick={() => moveSkillDown(isEdit)} />
                    </div>
                    <div className='bg-green-500 rounded-full p-1 mb-8'>
                        <IoColorPalette className='text-white cursor-pointer'
                            onClick={() => moveSkillDown(isEdit)}
                        />
                    </div>
                    <div className="p-1 cursor-pointer" onClick={() => removeSkill(isEdit)}>
                        <FaTrash className="text-gray-300" />
                    </div>
                </div>
            )}
            {skills.map((skill, index) => (
                <div key={index}>
                    <ContentEditable
                        onFocus={() => handleSkillFocus(index)}
                        key={index}
                        className="break-all rounded-lg bg-gray-400 text-white text-md focus:outline-none px-2 py-0.5"
                        html={skill}
                        onChange={(e) => handleChange(e, index)}
                        placeholder={"Skill"}
                    />
                </div>
            ))}
        </div>
    );
};

export default Skill;
