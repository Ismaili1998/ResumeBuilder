import React from 'react'
import Footer from './Footer'
import Header from './Header'
import CreateTemplate from './CreateTemplate'
import { MainSpinner } from '../components'
import { Route, Routes } from 'react-router-dom'
import { Suspense } from 'react'
import HomeContainer from './HomeContainer'
import UserProfile from './UserProfile'
import CreateResume from './CreateResume'
import ResumeDetail from './ResumeDetail'

export default function Home() {

    return (
        <div className='overflow-y-auto'>
            <Header></Header>
            <main className="w-full">
                <Suspense fallback={<MainSpinner />}>
                    <Routes>
                        <Route path="/" element={<HomeContainer />} />
                        <Route path="/template/create" element={<CreateTemplate />} />
                        <Route path="/profile/:uid" element={<UserProfile />} />
                        <Route path="/resume/*" element={<CreateResume />} />
                        <Route path="/resumeDetail/:templateID" element={<ResumeDetail />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer></Footer>
        </div >
    )
}
