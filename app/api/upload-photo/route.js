import { NextResponse } from "next/server";

export async function POST(request, response) {
  console.log(await request.formData());
  return new NextResponse("Thank you");
}
