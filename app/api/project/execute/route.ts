import { NextResponse } from "next/server";
import axios from "axios";
import fileNameMap from "@/lib/fileNameMap"

export const runtime = "nodejs"; // REQUIRED (RapidAPI + axios)

export async function POST(request: Request) {
    try {
        const { code, input, language } = await request.json();


        const response = await axios.post(
            "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
            {
                language,
                stdin: input || "",
                files: [
                    {
                        name: fileNameMap[language],
                        content: code,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
                    "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
                },
            }
        );


        return NextResponse.json(
            {
                output: response.data?.stdout,
                error: response.data?.stderr,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("EXECUTION ERROR:", error);
        return NextResponse.json(
            { error: "Execution failed" },
            { status: 500 }
        );
    }
}
