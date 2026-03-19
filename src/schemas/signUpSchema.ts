import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2,  "Username must be at least 2 characters long" )
    .max(20, "Username must be at most 20 characters long" )
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers" );


    export const signUpSchema = z
        .object({
            username: usernameValidation,
            email: z.string().email({message:"Invalid email address"})  ,
            password: z
              .string()
              .min(8, { message: "Password must be at least 8 characters long" })
              .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
              .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
              .regex(/[0-9]/, { message: "Password must include a number" })
              .regex(/[^a-zA-Z0-9]/, {
                message: "Password must include a special character",
              }),
        })