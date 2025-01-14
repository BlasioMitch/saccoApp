import { FiHome, FiUsers, FiPaperclip, FiLink,FiDollarSign,FiSettings, FiInfo } from "react-icons/fi"
import { NavLink, Link } from "react-router-dom"
const Menu = ({expa, route}) => {

    return(
        <>
            <div className="space-y-2">
                <p className="text-base text-dblack-50 uppercase py-2">Menu</p>
                <div className="space-y-2 border-b-2 border-dblack-50 pb-2">

                <MenuItem 
                    icon={<FiHome className={`${expa?'':'flex-r1 size-5 delay-10 duration-100'}`}/>}
                    title="Dashboard"
                    selected={true}
                    expa={expa}
                    route="/home"
                    />
                <MenuItem 
                    icon={<FiUsers className={`${expa?'':'flex-r1 size-5 delay-10 duration-100'}`}/>}
                    title="Team"
                    selected={false}
                    expa={expa}
                    route="/team"

                    />
                <MenuItem 
                    icon={<FiPaperclip className={`${expa?'':'flex-r1 size-5 delay-10 duration-100'}`}/>}
                    title="transactions"
                    selected={false}
                    expa={expa}
                    route="/transactions"

                    />
                <MenuItem 
                    icon={<FiLink className={`${expa?'':'flex-r1 size-5 delay-10 duration-100'}`}/>}
                    title="loans"
                    selected={false}
                    expa={expa}
                    route="loans"

                    />
                <MenuItem 
                    icon={<FiDollarSign className={`${expa?'':'flex-r1 size-5 delay-10 duration-100'}`}/>}
                    title="Finances"
                    selected={false}
                    expa={expa}
                    route="balance"
                    />
                </div>
                <p className="text-base text-dblack-50 py-2 uppercase">support</p>
                <div className="space-y-2 border-b-2 border-dblack-50 pb-2">
                    <MenuItem 
                        icon={<FiSettings className={`${expa?'':'flex-r1 size-5 delay-100 duration-200'}`}/>}
                        title="settings"
                        selected={false}
                        expa={expa}
                        route="settings"
                        />
                    <MenuItem 
                        icon={<FiInfo className={`${expa?'':'flex-r1 size-5 delay-100 duration-200'}`}/>}
                        title="help"
                        selected={false}
                        expa={expa}
                        route="help"
                        />
                </div>


            </div>
        </>
    )
}

const MenuItem = ({selected, icon, title, expa,route}) => {
    return <NavLink to={route}
    className={({ isActive }) =>
                `flex items-center justify-start gap-2 w-full 
                 rounded px-2 py-1.5 text-sm capitalize
                 transition-[box-shadow,_background-color,_color]
                 ${
                     isActive
                         ? 'bg-dcyan-800 text-dblack-900 shadow'
                         : 'hover:bg-dcyan-400 hover:text-dblack-800 shadow-none'
                 }`
            }
    >
        {icon}
        <span className={`${expa?'':'hidden'}`}>{title}</span>
    </NavLink>
}
export default Menu