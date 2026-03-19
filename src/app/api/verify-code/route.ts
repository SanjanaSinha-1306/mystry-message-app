import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        { status: 404 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Email verified successfully.",
        }),
        { status: 200 },
      );
    } else if (!isCodeValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid verification code.",
        }),
        { status: 400 },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Verification code has expired.",
        }),
        { status: 400 },
      );
    }
  } catch (error) {
    console.log("Error verifying email :", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while verifying email.",
      }),
      { status: 500 },
    );
  }
}

