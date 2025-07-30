import passport from 'passport';
import { IsActive } from '@/app/modules/user/user.interface';
import { User } from '@/app/modules/user/user.model';
import bcryptjs from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(
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

        if (!user.isVerified) done('User is not verified');

        if (
          user.isActive === IsActive.BLOCKED ||
          user.isActive === IsActive.INACTIVE
        )
          done(`User is ${user.isActive}`);

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

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
