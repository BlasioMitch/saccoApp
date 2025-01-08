const Plan = ({expa}) => {

    return (
    <>
        <div className={`flex sticky top-[calc(100vh_-_48px_-_16px)]
        flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs
        ${expa?'':'hidden'}
        `}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold">Enterprise</p>
                    <p className="text-stone-500">PAYG</p>
                </div>
                <button className="px-2 py-1.5 font-medium bg-dblack-700 
                hover:bg-dblack-100 hover:text-dcyan-300 transition-colors 
                rounded">
                    support
                </button>
            </div>

        </div>
    </>
    )
}

export default Plan