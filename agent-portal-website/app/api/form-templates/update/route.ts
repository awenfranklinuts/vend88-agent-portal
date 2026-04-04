import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, fields, visibility, visible_roles, status } = body;

    if (!id) {
      return NextResponse.json(
        { status_code: 400, message: 'Template ID is required' },
        { status: 400 }
      );
    }

    if (fields && Array.isArray(fields)) {
      const hasEmail = fields.some((f: any) => f.id === 'contact_email' || f.type === 'email');
      if (!hasEmail) {
        return NextResponse.json(
          { status_code: 400, message: 'Email field is mandatory for all form templates' },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();

    // Mock: editing bumps the version
    return NextResponse.json({
      status_code: 200,
      status_msg: 'success',
      data: {
        id,
        name: name || 'Updated Template',
        description: description || '',
        fields: fields || [],
        version: (body.current_version || 1) + 1,
        visibility: visibility || 'all',
        visible_roles: visible_roles || [],
        status: status || 'active',
        updated_at: now,
      },
    });
  } catch {
    return NextResponse.json(
      { status_code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
