import FileDropzone from "../components/FileDropZone.tsx";

const DocumentAnalysis = ()=>
    <div className="py-4 w-full grid grid-cols-7 gap-4">

        <div className="flex  flex-col col-span-2 gap-2   h-fit">

            <h1 className={"text-xl font-semibold pb-4"}>Upload Policy Document</h1>
            <FileDropzone/>
            <button className={"w-full bg-blue-500 py-2 text-white cursor-pointer"} disabled={true}>Hss</button>

        </div>
        <div className="flex flex-col col-span-5  border border-slate-300 h-full">

        </div>

    </div>
export default DocumentAnalysis;
