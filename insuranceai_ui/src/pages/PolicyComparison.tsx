
import React from "react";

const PolicyComparison: React.FC = () => {
    return (
        <div className={"flex-1 w-full grid grid-cols-6 gap-4 py-4"}>
            <div className="flex flex-col col-span-2 border border-slate-300 h-full">

            </div>
            <div className={"col-span-4 grid grid-rows-12 gap-4"}>
                <div className="flex flex-col row-span-3 border border-slate-300 h-full">

                </div>
                <div className="  row-span-9  grid grid-cols-2 gap-4 h-full">
                    <div className={"border border-slate-300"}>

                    </div>
                    <div className={"border border-slate-300"}>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default PolicyComparison;
