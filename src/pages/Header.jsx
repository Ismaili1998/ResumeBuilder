import { React, useState } from 'react'
import useUser from '../hooks/useUser';
import { PuffLoader } from "react-spinners"
import { useQueryClient } from 'react-query';
import { auth } from '../config/firebase.config';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiLogout } from 'react-icons/hi'
import { slideUpDownMenu } from '../animations';
import { adminsId } from '../utils/helpers';
export default function Header() {

  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);
  const queryClient = useQueryClient();
  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null)
    });
  };

  return (
    <div>
      <nav
        class="flex items-center justify-between flex-wrap bg-white py-4 lg:px-12 shadow border-solid border-t-2 border-blue-700">
        <div class="flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-gray-300 pb-5 lg:pb-0">
          <div class="flex items-center flex-shrink-0 text-gray-800 mr-16">
            <AnimatePresence>
              <span className="font-semibold text-xl tracking-tight">
                {isLoading ? (
                  <PuffLoader color="#498FCD" size={40} />
                ) : (
                  <div>
                    {data ? (
                      <motion.div
                        className="relative"
                        onClick={() => {
                          setIsMenu(!isMenu);
                        }}
                        onMouseLeave={() => {
                          setIsMenu(false);
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {data.photoURL ? (
                          <div>
                            <img src={data.photoURL} alt="" className="w-11 h-11 rounded-full" />
                          </div>
                        ) : (
                          <p>{data?.email[0]}</p>
                        )}

                        {/* Drop down menu */}
                        <AnimatePresence>
                          {isMenu && (
                            <motion.div
                              className="absolute bg-white shadow-md p-4 z-10 rounded-md border border-gray-200"
                              {...slideUpDownMenu}
                              onMouseLeave={() => {
                                setIsMenu(false);
                              }}
                            >
                              {data.photoURL ? (
                                <div>
                                  <img src={data.photoURL} alt="User" className="w-10 h-10 rounded-full mb-2" />
                                </div>
                              ) : (
                                <p className="text-sm">{data?.email[0]}</p>
                              )}

                              {data?.displayName && <p className="text-sm">{data.displayName}</p>}

                              {/* Menu */}
                              <div className="w-full">
                                <Link to="/profile" className="text-sm block py-1 hover:text-blue-600">
                                  My account
                                </Link>
                                {adminsId.includes(data?.uid) &&
                                  <Link to="template/create" className="text-sm block py-1 hover:text-blue-600">
                                    <p className="mr-2"> New template</p>
                                  </Link>
                                }
                                {/* Menu for authenticated users */}
                                <div className="w-full flex items-center cursor-pointer text-sm py-1 hover:text-blue-600"
                                  onClick={signOutUser}
                                >
                                  <p className="mr-2">Sign out</p>
                                  <HiLogout />
                                </div>
                              </div>
                            </motion.div>

                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      <Link to="/auth">
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Login
                        </motion.button>
                      </Link>
                    )}
                  </div>
                )}
              </span>
            </AnimatePresence>
          </div>
          <div class="block lg:hidden ">
            <button
              id="nav"
              class="flex items-center px-3 py-2 border-2 rounded text-blue-700 border-blue-700 hover:text-blue-700 hover:border-blue-700">
              <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
        </div >

        <div class="menu w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8">
          <div class="text-md font-bold text-blue-700 lg:flex-grow">
            <a href="#responsive-header"
              class="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
              Menu 1
            </a>
            <a href="#responsive-header"
              class=" block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
              Menu 2
            </a>
            <a href="#responsive-header"
              class="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
              Menu 3
            </a>
          </div>
          <div class="relative mx-auto text-gray-600 lg:block hidden">
            <input
              class="border-2 border-gray-300 bg-white h-10 pl-2 pr-8 rounded-lg text-sm focus:outline-none"
              type="search" name="search" placeholder="Search" />
            <button type="submit" class="absolute right-0 top-0 mt-3 mr-2">

            </button>
          </div>
          <div class="flex ">
            <a href="#"
              class="block text-md px-4 py-2 rounded text-blue-700 ml-2 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0">Sign
              in</a>
            <a href="#"
              class=" block text-md px-4  ml-2 py-2 rounded text-blue-700 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0">login</a>
          </div>
        </div>
      </nav >
    </div >
  )
}
