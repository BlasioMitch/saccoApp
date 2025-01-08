import { FiChevronDown, FiChevronUp,FiChevronLeft } from "react-icons/fi"
const LogoToggle = ({expa}) => {

    return(<>
        <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
            <div className="flex p-0.5 hover:cursor-pointer hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
            <img src="https://api.dicebear.com/9.x/bottts/svg" alt="avatar" className={` rounded shrink-0 bg-violet-500 shadow ${expa?'size-8':'flex-1 size-10'}`} />
            <div className={`text-start ${expa?'duration-200':'hidden'}`}>
                <span className='text-sm font-bold block'>Mitchell is loading</span>
                <span className='text-xs block text-stone-500'>mitch@gm.aio</span>
            </div>
            <div className={`${expa?'duration-200':'hidden'}`}>

            <FiChevronDown className="absolute right-2 top-1/2 translate-y-[calc(-50%+4px)] text-xs"/>
            <FiChevronUp className="absolute right-2 top-1/2 translate-y-[calc(-50%-4px)] text-xs"/>
            </div>
            </div>
        </div>
    </>)
}

export default LogoToggle 