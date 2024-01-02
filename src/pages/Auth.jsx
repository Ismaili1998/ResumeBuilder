import React, { useEffect } from 'react'
import { ButtonAuthProvider, MainSpinner } from '../components'
import { FaGoogle, FaGithub } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

export default function Auth() {

    const googleSignInConfig = {
        Icon: FaGoogle,
        label: 'Sign in with Google',
        provider: 'Google'
    };

    const githubSignInConfig = {
        Icon: FaGithub,
        label: 'Sign in with Github',
        provider: 'Github'
    };


    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const { data, isLoading, isError } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(data)
        if (!isLoading && data) {
            navigate("/", { replace: true })
        }
    }, [isLoading, data]);

    if (isLoading) {
        return <MainSpinner />
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-10 pt-6 pb-8 mb-4 w-screen mx-20">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <div className="mt-4 btn-block">
                    <ButtonAuthProvider signInConfig={googleSignInConfig} />
                    <ButtonAuthProvider signInConfig={githubSignInConfig} />
                </div>
            </form>
        </div>
    )
}



{/* @layer to add a custom class style   */ }

