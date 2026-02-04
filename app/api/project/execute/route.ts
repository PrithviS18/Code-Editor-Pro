import { NextResponse } from "next/server";
import axios from "axios";
import { JUDGE0_LANGUAGES } from "@/lib/judge0languages";

export async function POST(request: Request) {
    try {
        const { code, language, input } = await request.json();
        const languageId = JUDGE0_LANGUAGES[language];

        if (!languageId) {
            return NextResponse.json({ message: "Unsupported Language" }, { status: 400 });
        }

        const response = await axios.post(
            `https://${process.env.JUDGE0_API_HOST}/submissions?wait=true`,
            {
                source_code: code,
                language_id: languageId,
                stdin: input,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY!,
                    "X-RapidAPI-Host": process.env.JUDGE0_API_HOST!,
                },
            }
        );

        return NextResponse.json({
            output: response.data.stdout,
            error: response.data.stderr,
            compileError: response.data.compile.output,
            status: response.data.status
        })
    } catch (error) {
        console.error("Judge0 error:", error);
        return NextResponse.json(
            { error: "Execution failed" },
            { status: 500 }
        );
    }
}

