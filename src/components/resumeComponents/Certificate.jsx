import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { CgArrowLeft, CgArrowRight } from 'react-icons/cg';
import { IoColorPalette } from 'react-icons/io5';
import ContentEditable from 'react-contenteditable';
import { CustomDate } from '..';
import { FaMinus } from 'react-icons/fa6';

const Certificate = () => {
    const [certificates, setCertificates] = useState([
        { title: 'Certificate Title 1', date: 'January 1, 2024' },
        { title: 'Certificate Title 2', date: 'February 15, 2024' },
    ]);
    const [isEdit, setIsEdit] = useState(null);

    const removeCertificate = (index) => {
        const updatedCertificates = certificates.filter((_, i) => i !== index);
        setCertificates(updatedCertificates);
        setIsEdit(null);
    };

    const addCertificate = (index) => {
        const newCertificate = { title: '', date: '' };
        const updatedCertificates = [...certificates];
        updatedCertificates.splice(index + 1, 0, newCertificate);
        setCertificates(updatedCertificates);
        setIsEdit(index + 1);
    };

    const moveCertificateDown = (index) => {
        if (index + 1 < certificates.length) {
            const updatedCertificates = [...certificates];
            const certificate = updatedCertificates[index];
            updatedCertificates[index] = updatedCertificates[index + 1];
            updatedCertificates[index + 1] = certificate;
            setCertificates(updatedCertificates);
            setIsEdit(null);
        }
    };

    const moveCertificateUp = (index) => {
        if (index > 0) {
            const updatedCertificates = [...certificates];
            const certificate = updatedCertificates[index];
            updatedCertificates[index] = updatedCertificates[index - 1];
            updatedCertificates[index - 1] = certificate;
            setCertificates(updatedCertificates);
            setIsEdit(null);
        }
    };

    const handleChange = (e, index, field) => {
        const value = e.target.value.replace(/<[^>]*>/g, '');
        const updatedCertificates = [...certificates];
        updatedCertificates[index][field] = value;
        setCertificates(updatedCertificates);

    };

    return (
        <div>
            {isEdit !== null && (
                <div className="w-10 absolute h-100 bg-gray-800 -right-5 -mt-20 rounded-full px-2 py-5">
                    <div className="bg-green-500 rounded-full p-1 mb-8" onClick={() => addCertificate(isEdit)}>
                        <FaPlus className="cursor-pointer text-white" />
                    </div>
                    <div className="bg-green-500 rounded-full p-1 mb-8">
                        <CgArrowLeft className="cursor-pointer text-white" onClick={() => moveCertificateUp(isEdit)} />
                    </div>
                    <div className="bg-green-500 rounded-full p-1 mb-8">
                        <CgArrowRight className="cursor-pointer text-white" onClick={() => moveCertificateDown(isEdit)} />
                    </div>
                    <div className='bg-green-500 rounded-full p-1 mb-8'>
                        <IoColorPalette className='text-white cursor-pointer' />
                    </div>
                    <div className="p-1 cursor-pointer" onClick={() => removeCertificate(isEdit)}>
                        <FaTrash className="text-gray-300" />
                    </div>
                </div>
            )}
            {certificates.map((certificate, index) => (
                <div
                    className='mb-2'
                    key={index}
                >
                    <ContentEditable
                        className="w-full text-lg text-blue-500 dark:text-white 
                                leading-5 focus:outline-none focus:border-b-2 border-blue-500"
                        html={certificate.title}
                        type='text'
                        placeholder={'title'}
                        onChange={(evt) => handleChange(evt, index, 'company')}
                    />
                    <div className='flex items-center gap-2'> {/* Adjusted className */}
                        <CustomDate customDate={new Date()} />
                        <FaMinus className='w-2 h-2 text-teal-600' />
                        <CustomDate customDate={new Date()} />
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Certificate;
