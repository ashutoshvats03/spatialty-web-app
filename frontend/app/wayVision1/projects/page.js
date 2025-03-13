"use client"
import { useAppSelector } from "@/app/redux/hooks";
import { setdisplayContent } from '@/app/redux/slices/contentSlice';
import { setProject } from '@/app/redux/slices/projectSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import DataComponents from './DataComponents/page';
import { useRouter } from "next/navigation";

function Page() {
    const router = useRouter();
    const [showInfoIndex, setShowInfoIndex] = useState(null);
    const [header, setheader] = useState("Highway Expansion");
    const dispatch = useDispatch();
    const displayContent = useAppSelector((state) => state.displayContent.displayContent);
    const [message, setMessage] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem("data");
        if (data) {
            const Proj = JSON.parse(data).Project;
            setMessage(Proj);
            setIsMounted(true);
        } else {
            router.push("/");
        }
    }, []);
    const projects = message;
    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }

    return (
        <div className="mt-14 ">
            <div className={`text bg-slate-300 text-center border-r-4 border-b-4 text-[16px] border-white rounded-lg border-2 mx-16 ${displayContent ? "block" : "hidden"}`}>
                <div className="location text-2xl font-extrabold mx-16 mt-5 mb-10">Projects Content</div>
                <div onMouseLeave={() => setShowInfoIndex(null)}>
                    {projects && projects.map((project, index) => (
                        <div onClick={() => { dispatch(setProject(project[0])); alert(project[0]), setheader(project[1]); dispatch(setdisplayContent(false)) }} className='border font-bold text-xl border-white' key={index}>
                            <div className={`flex my-5 mx-16 gap-10`}>
                                <div className="text-start flex-1">{project[1]}</div>
                                <div className="text-center flex-1">{project[4]}</div>
                                <div className={`text-center flex-[0.5] px-2 py-1 text-sm font-medium ${index !== 0 ? "text-white bg-red-600 rounded-xl" : ""}`}>
                                    {project[3]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`border-4 border-black mx-16 text-center my-10 ${displayContent ? "hidden" : "block"}`}>
                <div className='font-extrabold text-3xl bg-slate-300  rounded-lg py-5'>
                    {header}
                </div>
                <div className={`bg-slate-300  px-10`}>
                    {projects && projects[2]}
                    <DataComponents />
                </div>
            </div>
        </div>
    );
}

export default Page;
