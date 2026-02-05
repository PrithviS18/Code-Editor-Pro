"use client";
import Axios from "@/lib/axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import coding from "@/public/coding.png";
import cpp from "@/public/cpp.png";
import java from "@/public/java.png";
import python from "@/public/python.png";
import javascript from "@/public/javascript.png";
import kotlin from "@/public/kotlin.png";
import go from "@/public/go.png";
import Link from "next/link";

interface Project {
    _id: string;
    name: string;
    language: string;
    updatedAt: string;
    createdAt: string;
}

const DashboardPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const lang: { [key: string]: any } = {
        "cpp":cpp,
        "java":java,
        "javascript":javascript,
        "python": python,
        "kotlin" : kotlin,
        "go": go
    }

    useEffect(() => {
        console.log("yes")
        const getAllProjects = async () => {
            try {
                const response = await Axios.get("/api/project/getAllProjects");


                if (response.status === 200) {
                    const data = response.data;
                    setProjects(Array.isArray(data) ? data : Object.values(data));
                }
            } catch (error) {
                console.log(error);
                setProjects([]);
            }
        };

        getAllProjects();
    }, []);

    return (
        <>
            {projects.length === 0 ?  
                <div className="flex w-full justify-center items-center">
                    <Image
                        src={coding}
                        alt="Person Coding"
                        className="w-96 h-96 md:w-xl md:h-full"
                    />
                </div>
                :
                <div className="w-full grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 overflow-scroll-y px-10 py-10 gap-20">
                    {
                        projects.map((item) => (
                            <Link href={`/editor/${item._id}`} key={item._id} className=" h-80 border-2 rounded-4xl shadow-md cursor-pointer bg-white flex justify-between flex-col items-center">
                                <Image src={lang[item.language]} alt={item.language} className="w-60 h-60 p-4"/>
                                <p className="w-full flex justify-center items-center font-bold font-sans h-10">
                                    {item.name}
                                </p>
                            </Link>
                        ))
                    }
                </div>
            }
        </>
    )
};

export default DashboardPage;
