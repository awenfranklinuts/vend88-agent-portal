import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, fields, visibility, visible_roles, status } = body;

    if (!name || !fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        { status_code: 400, message: 'Name and at least one field are required' },
        { status: 400 }
      );
    }

    // Ensure email field is present and required
    const hasEmail = fields.some((f: any) => f.id === 'contact_email' || f.type === 'email');
    if (!hasEmail) {
      return NextResponse.json(
        { status_code: 400, message: 'Email field is mandatory for all form templates' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newTemplate = {
      id: `tpl_${Date.now()}`,
      name,
      description: description || '',
      fields,
      version: 1,
      visibility: visibility || 'all',
      visible_roles: visible_roles || [],
      status: status || 'active',
      created_by: body.admin_email || 'admin@vend88.com',
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json({
      status_code: 200,
      status_msg: 'success',
      data: newTemplate,
    });
  } catch {
    return NextResponse.json(
      { status_code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
