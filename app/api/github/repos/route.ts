import { NextResponse } from "next/server";
import {githubHeaders, parseJsonSafely} from "@/lib/github"

export async function GET(req: Request) {
    // intentionally left blank : use this route to fetch https://api.github.com/users/(username)

    const { searchParams } = new URL(req.url);
    const username = (searchParams.get("username") || "").trim();
    const page = searchParams.get("page") ?? "1";
    const sort = searchParams.get("sort") ?? "updated";
  
    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 });
    }
  
    try {
      const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=20&page=${page}&sort=${sort}`;
      const res = await fetch(url, {
        headers: githubHeaders(),
        next: { revalidate: 60 },
      });
      const data = await parseJsonSafely(res);

      if(!res.ok) {
        return NextResponse.json({ error: "Unable to fetch repos" }, { status: 502 })
      }

      return NextResponse.json(data)
    }  
    catch {
        return NextResponse.json({error: "Network failure"}, {status: 502})
    }
}