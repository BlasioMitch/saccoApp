import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import Sidebar from "../Sidebar/Sidebar"
import TopBar from "./TopBar"

const Dashboard = () => {
    const [expand, setExpand] = useState(false)

    const handleToggleButton = () => setExpand(!expand)

    return(
        <>
        {/* Render side bar and header */}
            <main className={`grid gap-4 p-4 grid-cols-[220px,_1fr] 
                ${expand?'grid-cols-[220px,_1fr]':'grid-cols-[70px,_1fr]'} duration-300`}>
                <Sidebar  handleToggle={handleToggleButton} expa={expand} 
                />

            <div className="bg-dblack-800 rounded-lg pb-4 shadow h-[100vh] flex flex-col">
               <TopBar expa={expand}/>
               {/* to dynamically render child components */}
               <Outlet />

            </div>
        </main>
        </>
    )
}

export default Dashboard