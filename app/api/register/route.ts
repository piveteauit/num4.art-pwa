// import { NextResponse, NextRequest } from "next/server";
// import connectMongo from "@/libs/mongoose";
// import User from "@/models/User";

// // This route is used to store the leads that are generated from the landing page.
// // The API call is initiated by <ButtonLead /> component
// // Duplicate emails just return 200 OK
// export async function POST(req: NextRequest) {
//   await connectMongo();

//   const body = await req.json();

//   if (!body.email) {
//     return NextResponse.json({ error: "Email is required" }, { status: 400 });
//   }
//   if (!body.password) {
//     return NextResponse.json(
//       { error: "Password is required" },
//       { status: 400 }
//     );
//   }
//   if (!body.username) {
//     return NextResponse.json(
//       { error: "Username is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const user = await User.findOne({ email: body.email });

//     if (!user) {
//       await User.create(body);

//       // Here you can add your own logic
//       // For instance, sending a welcome email (use the the sendEmail helper function from /libs/mailgun)
//     }

//     return NextResponse.json(user, { status: 201 });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }
