import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/users.model';
import * as nodemailer from 'nodemailer';

@Injectable()
export class VerifyAccountMailService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async verificationEmail(
    email: string,
    verificationToken: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider here (e.g., 'Gmail', 'Outlook')
      auth: {
        user: process.env.NODEMAILER_EMAIL, // Your email address
        pass: process.env.NODEMAILER_PASSWORD, // Your email password or an app-specific password
      },
    });

    const verificationLink = `${process.env.BASE_URL}/auth/verify?email=${email}&token=${verificationToken}`;
    const message = `<html>
         <head>
           <title>Email Confirmation</title>
         </head>
         <body>
           <h1>Confirm Your Email</h1>
           <p>Please click the following link to confirm your email:</p>
           <a href="${verificationLink}">${verificationLink}</a>
          </body>
         </html>`;
    const mailOptions = {
      to: email,
      from: process.env.NODEMAILER_EMAIL,
      subject: 'Verify Your Account',
      html: message,
      headers: {
        'Content-Type': 'text/html',
      },
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyUserByToken(
    verificationToken: string,
    email: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ verificationToken, email });

    if (user) {
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      return user;
    }

    return null;
  }
}
