import { FiChevronLeft } from "react-icons/fi"
import LogoToggle from "./LogoToggle"
import Menu from "./Menu"
import Plan from "./Plan"
import Search from "./Search"

const Sidebar = ({handleToggle,expa,onChangePage}) => {
    return(<>
    <div className="">
        <div className="sticky top-4 h-[calc(100vh-32px-48px)]">
            <FiChevronLeft
                onClick={handleToggle} 
                className={`absolute size-5 top-12 pr-0.5 
                rounded-full right-[-25px] bg-dblack-50 ${!expa && 'rotate-180'}
                hover:cursor-pointer hover:bg-dcyan-300 hover:stroke-dblack-500
                `}/>
            <LogoToggle expa={expa}/>
            {
            expa
            ?<Search />
            :''
        }
            <Menu expa={expa} onChangePage={onChangePage}/>
        </div>
        <Plan expa={expa} />
    </div>
    </>)
}

export default Sidebar