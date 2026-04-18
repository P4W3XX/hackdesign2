import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const user = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
        };

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch user info' },
            { status: 500 }
        );
    }
}