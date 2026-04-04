import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { status_code: 400, message: 'Template ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status_code: 200,
      status_msg: 'success',
      message: 'Template deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { status_code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
