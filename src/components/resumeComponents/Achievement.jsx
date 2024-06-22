import React, { useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { FaTrash, FaX } from 'react-icons/fa6';

const Achievement = (props) => {
    const [achievements, setAchievements] = useState(props.achievements || []);
    const [isEdit, setIsEdit] = useState(-1);
    const containerRef = useRef(null);


    const addAchievement = (index) => {
        const updatedAchievements = [...achievements];
        updatedAchievements.splice(index + 1, 0, ''); // Insert a new empty string
        setAchievements(updatedAchievements);
    };

    const removeAchievement = (index) => {
        const updatedAchievements = [...achievements];
        updatedAchievements.splice(index, 1); // Remove the achievement at the given index
        setAchievements(updatedAchievements);
    };

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/<[^>]*>/g, '');
        const updatedAchievements = [...achievements];
        updatedAchievements[index] = value;
        setAchievements(updatedAchievements);
    };

    const handleFocus = (index) => {
        if (isEdit != index) {
            setIsEdit(index)
        }
    }

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsEdit(-1);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        props.handleAchievement(achievements);
    }, [achievements]);

    return (
        <div ref={containerRef}>
            {achievements.map((achievement, index) => (
                <div key={index} className="mb-1 flex justify-items-start items-start gap-2"
                    onFocus={() => handleFocus(index)}
                >
                    <FaMinus className='w-2 text-teal-600 mt-1' />
                    <ContentEditable
                        className="leading-5 w-full text-sm text-left 
                        focus:outline-none focus:border-b-2 border-dashed"
                        html={achievement}
                        placeholder="New Achievement"
                        onChange={(evt) => handleChange(evt, index)}
                    />
                    {isEdit === index && (
                        <div className='flex justify-items-start items-start gap-1'>
                            <div className='cursor-pointer bg-green-200 hover:bg-green-400 rounded-full p-1'
                                onClick={() => addAchievement(index)}
                            >
                                <FaPlus className='text-white w-2 h-2'
                                />
                            </div>
                            <div className='cursor-pointer bg-red-200 hover:bg-red-400 rounded-full p-1'
                                onClick={() => removeAchievement(index)}
                            >
                                <FaX className='text-white w-2 h-2' />
                            </div>

                        </div>)}
                </div>
            ))
            }
        </div >
    );
};

export default Achievement;
