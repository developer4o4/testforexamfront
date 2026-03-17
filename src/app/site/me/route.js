export async function POST(request) {
    const API_BASE = process.env.NEXT_PUBLIC_STUDENT_CREATE;

    try {
        const authHeader = request.headers.get('authorization');
        const body = await request.json();
        const studentId = body.student_id;

        if (!authHeader || !studentId) {
            return NextResponse.json(
                { error: "Token yoki student_id yo'q" },
                { status: 400 }
            );
        }

        const backendResponse = await fetch(`${API_BASE}/students/get-student-data/`, {
            method: "POST",
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ student_id: studentId }),
        });

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            return NextResponse.json(
                { error: errorText },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
