import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';


const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const params = useLocation()
    const searchText = params.search.slice(3)

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])


    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='w-full [@media(min-height:1366px)]:min-w-[30px] min-w-[300px] lg:min-w-[250px] h-11 lg:h-12 rounded-full border overflow-hidden flex items-center text-neutral-500 bg-transparent group border-gray-300 focus-within:border-primary-200 cursor-text mt-20 lg:mt-0'>
        <div>
            {
                (isMobile && isSearchPage ) ? (
                    <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md'>
                        <FaArrowLeft size={20}/>
                    </Link>
                ) :(
                    <button className='flex justify-center items-center h-full p-3 group-focus-within:text-primary-200'>
                        <IoSearch size={22}/>
                    </button>
                )
            }
        </div>
        <div className='w-full h-full [@media(min-height:1366px)]:hidden'>
            {
                !isSearchPage ? (
                     //not in search page
                     <div onClick={redirectToSearchPage} className='w-full h-full flex items-center font-normal'>
                        <TypeAnimation
                                sequence={[
                                    // Same substring at the start will only be typed out once, initially
                                    '"Chocolate Tart"',
                                    500, // wait 1s before replacing "Mice" with "Hamsters"
                                    '"Jira Toast"',
                                    500,
                                    '"Rajwadi Dalmuth"',
                                    500,
                                    '"Anjir Dry Fruit Halvo"',
                                    500,
                                    '"Badam Barfi"',
                                    500,
                                    '"Almond Rocher"',
                                    500,
                                    '"Anjir Roll"',
                                    500,
                                    '"Kaju Maisoor"',
                                    500,
                                    '"Dry Fruit Suki Kachori "',
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                     </div>
                ) : (
                    //when i was search page
                    <div className='w-full h-full font-normal'>
                        <input
                            type='text'
                            placeholder='Search for Sweet, Namkeen, Bakery, Cookies, Dry Fruite.'
                            autoFocus
                            defaultValue={searchText}
                            className='bg-transparent w-full h-full outline-none'
                            onChange={handleOnChange}
                        />
                    </div>
                )
            }
        </div>
        
    </div>
  )
}

export default Search
