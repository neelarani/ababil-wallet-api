import passportJS from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcryptjs from 'bcryptjs';
import { User } from '@/app/modules/user/user.model';
import { IsActive, Role } from '@/app/modules/user/user.interface';
import {
  Strategy as GoogleStrategy,
  Profile as GProfile,
} from 'passport-google-oauth20';
import { ENV } from './_env.config';

passportJS.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done('User does not exist');
        }

        if (!user.isVerified) return done('User is not verified');

        if (
          user.isActive === IsActive.BLOCKED ||
          user.isActive === IsActive.INACTIVE
        )
          return done(`User is ${user.isActive}`);

        if (user.isDeleted) done('User is deleted');

        const isGoogleAuthenticated = user.auths.some(
          providerObjects => providerObjects.provider == 'google'
        );

        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message:
              'You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.',
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          user.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: 'Password does not match' });
        }

        return done(null, user);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passportJS.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile: GProfile, done) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) return done(null, false, { message: 'No email found' });

        let user = await User.findOne({ email });

        if (user && !user.isVerified)
          return done(null, false, { message: 'User is not verified' });

        if (
          user &&
          (user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE)
        )
          return done(null, false, { message: `User is ${user.isActive}` });

        if (user && user.isDeleted)
          return done(null, false, { message: 'User is deleted' });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [{ provider: 'google', providerId: profile.id }],
          });
        }

        return done(null, user, { message: 'User has been created' });
      } catch (error) {
        console.log('Google Strategy Error:\n', error);
        return done(error);
      }
    }
  )
);

passportJS.serializeUser((user: any, done) => {
  done(null, user.id);
});

passportJS.deserializeUser(async (id: any, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
