import { FiCommand, FiSearch } from "react-icons/fi"

const Search = () => {

    return (
    <>
        <div className={` bg-dblack-700  relative 
        rounded flex items-center p-2 text-sm`}>
        <FiSearch className="mr-2"/>
        <input type="text" placeholder="Search" id=""
        className="w-full bg-transparent placeholder:text-dcyan-500 
        focus:outline-none"
        />
        <span className="p-1 text-xs text-dcyan-500 flex gap-0.5 items-center 
        shadow bg-dblack-800 rounded absolute right-1.5 top-1/2 -translate-y-1/2">
            <FiCommand className="stroke-dcyan-500"/>K
        </span>
        </div>
    </>)
}

export default Search