import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return NextResponse.json({ error: "GitHub token not found" }, { status: 500 });
  }

  const response = await fetch(`https://api.github.com/orgs/acmuta/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
