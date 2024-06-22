import React, { useState, useEffect, useRef } from 'react';

const CustomeDate = (props) => {
    const [date, setDate] = useState({ month: '09', year: '2020' });
    const [formattedDate, setFormattedDate] = useState('');
    const [editing, setEditing] = useState(false);
    const dateRef = useRef(null);
    const monthInputRef = useRef(null);

    useEffect(() => {
        if (!editing) {
            if (date.month && date.year) {
                const formatted = `${date.month}/${date.year}`;
                setFormattedDate(formatted);
            } else {
                setFormattedDate('');
            }
        }
    }, [date, editing]);

    const handleClickOutside = (event) => {
        if (dateRef.current && !dateRef.current.contains(event.target)) {
            setEditing(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "month") {
            if (!MonthisValid(value)) return
        }
        else if (name === "year") {
            if (!YearisValid(value)) return
        }

        setDate(prevDate => ({
            ...prevDate,
            [name]: value
        }));

    };

    const handleFocus = () => {
        setEditing(true);
        setTimeout(() => {
            monthInputRef.current.focus();
        }, 0);
    };

    const MonthisValid = (value) => {
        if (!/^\d{1,2}$/.test(value) || parseInt(value, 10) < 0 || parseInt(value, 10) > 12) {
            return false
        }
        return true
    }

    const YearisValid = (value) => {
        if (!/^\d{4}$/.test(value)) {
            return false
        }
        return true
    };


    return (
        <div ref={dateRef}>
            {!editing ? (
                <p onClick={handleFocus}
                    className='text-sm text-left italic text-gray-600'
                >
                    {formattedDate}
                </p>
            ) : (

                <time className="w-50 text-sm flex justify-start items-center gap-0
                    leading-none text-gray-400 dark:text-gray-500">
                    <input
                        type="text"
                        className="w-7 text-center text-gray-500 dark:text-gray-600 text-md 
                                  focus:outline-none border-b-2 border-dashed"
                        onChange={handleChange}
                        value={date.month}
                        name="month"
                        ref={monthInputRef}
                    />
                    <span> /</span>
                    <input
                        type="text"
                        className="w-12 text-center text-gray-500 dark:text-gray-600 text-md 
                                    focus:outline-none border-b-2 border-dashed"
                        onChange={handleChange}
                        value={date.year}
                        name="year"
                    />
                </time>

            )}
        </div>
    );
};

export default CustomeDate;
