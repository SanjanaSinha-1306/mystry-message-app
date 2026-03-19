import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import { signUpSchema } from "@/src/schemas/signUpSchema";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid signup data",
        }),
        { status: 400 },
      );
    }

    const { username, email, password } = parsed.data;

    // Only verified users should "reserve" usernames.
    const existingVerifiedByUsername = await UserModel.findOne({
      username,
      isVarified: true,
    });
    if (existingVerifiedByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "Username already exists" }),
        { status: 400 },
      );
    }

    // If there is an unverified user with same username, remove it so the username stays available.
    await UserModel.deleteMany({ username, isVarified: false });

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // We'll save the user first, then send the email. If sending fails, rollback so username stays available.
    if (existingUserByEmail) {
      if (existingUserByEmail.isVarified) {
        return new Response(
          JSON.stringify({ success: false, message: "Email already exists" }),
          { status: 400 },
        );
      }

      const prev = {
        username: existingUserByEmail.username,
        password: existingUserByEmail.password,
        varifyCode: existingUserByEmail.varifyCode,
        varifyCodeExpiry: existingUserByEmail.varifyCodeExpiry,
      };

      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.varifyCode = verifyCode;
      existingUserByEmail.varifyCodeExpiry = expiryDate;

      await existingUserByEmail.save();

      const emailResponse = await sendVerificationEmail(
        existingUserByEmail.email,
        existingUserByEmail.username,
        verifyCode,
      );
      if (!emailResponse.success) {
        // rollback and ensure username isn't reserved by an unverified record
        existingUserByEmail.username = prev.username;
        existingUserByEmail.password = prev.password;
        existingUserByEmail.varifyCode = prev.varifyCode;
        existingUserByEmail.varifyCodeExpiry = prev.varifyCodeExpiry;
        await existingUserByEmail.save();
        await UserModel.deleteMany({ username, isVarified: false });

        return new Response(JSON.stringify(emailResponse), { status: 500 });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message:
            "User registered successfully. Please check your email for verification.",
        }),
        { status: 201 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      varifyCode: verifyCode,
      varifyCodeExpiry: expiryDate,
      isVarified: false,
      isAcceptingMessages: true,
      messages: [],
    });

    await newUser.save();

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      // Ensure username does not stay reserved if OTP can't be sent
      await UserModel.deleteOne({ _id: newUser._id });
      return new Response(JSON.stringify(emailResponse), { status: 500 });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "User registered successfully. Please check your email for verification.",
      }),
      { status: 201 },
    );
  }
  catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid request body" }),
      { status: 500 },
    );
  }   
}