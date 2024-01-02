import React from 'react'
import { GoogleAuthProvider, GithubAuthProvider, signInWithRedirect } from "firebase/auth"
import { auth } from '../config/firebase.config'

export default function ButtonAuthProvider(props) {

    const { Icon, label, provider } = props.signInConfig

    const authWithProvider = async () => {

        const googleAuthProvider = new GoogleAuthProvider();
        const githubAuthProvider = new GithubAuthProvider();

        switch (provider) {

            case "Google":
                await signInWithRedirect(auth, googleAuthProvider).then((res) => {
                    console.log('Attemp to connect from Google');
                }).catch(err => {
                    console.log('Error to connect from Google');
                });
                break

            case "Github":
                await signInWithRedirect(auth, githubAuthProvider).then((res) => {
                    console.log('Attemp to connect from Github');
                }).catch(err => {
                    console.log('Error to connect from Github');
                });
                break
            default:
                console.log('Attemp to connect from Google ');
        }
    }

    return (
        <button
            onClick={authWithProvider}
            className="mb-5 w-full h-12 px-6 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
            type="submit"
        >
            <Icon />
            {label}
        </button>
    )
}
