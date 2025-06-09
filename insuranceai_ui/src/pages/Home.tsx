import Logo from "../../public/logo.png";

const Home = () => (
    <div className="w-full flex items-center  h-full">
        <div className="grid grid-cols-4 gap-6 max-w-4xl ">

            <div
                className="col-span-4 gap-4 mb-2  ease-in-out duration-300 transition-all cursor-pointer border-slate-300 bg-white"
            >
                <h1 className="text-3xl font-semibold mb-2">
                    Let's get started!
                </h1>

            </div>

            {/* Empty placeholder squares */}
            <div className="border aspect-square h-[200px] hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer border-slate-300 bg-white"></div>
            <div className="border aspect-square h-[200px] hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer border-slate-300 bg-white"></div>
            <div className="border aspect-square h-[200px] hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer border-slate-300 bg-white"></div>

            {/* Chat AI card */}
            <div className="border aspect-square h-[200px] flex flex-col gap-2 items-center justify-center p-4 hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer border-slate-300 bg-white">
                <div className="aspect-square relative h-[100px] border p-4 border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
                <span className="text-slate-600 text-sm">Let's talk to Chat AI</span>
            </div>
            <div
                className="col-span-4 gap-2  mt-8 flex flex-col  ease-in-out duration-300 transition-all cursor-pointer border-slate-300 bg-white"
            >
                <h1 className="text-3xl font-semibold mb-2">
                    Intelligent Insurance Advisory Platform
                </h1>
                <p className="w-3xl text-justify break-words">
                    AI-powered insurance platform its helps users understand policies, compare coverage, file claims with guided assistance, and provides personalized insurance advice.
                </p>
            </div>
        </div>
    </div>
);

export default Home;
