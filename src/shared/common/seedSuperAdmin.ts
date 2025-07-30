import { IAuthProvider, Role } from '@/app/modules/user/user.interface';
import { User } from '@/app/modules/user/user.model';
import { ENV } from '@/config';
import bcryptjs from 'bcryptjs';

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: ENV.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log(`super admin is already exists!`);
      return;
    }

    console.log('trying to create super admin');

    const hashedPassword = await bcryptjs.hash(
      ENV.SUPER_ADMIN_PASSWORD,
      Number(ENV.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: 'credentials',
      providerId: ENV.SUPER_ADMIN_EMAIL,
    };

    const payload = {
      name: 'super admin',
      role: Role.SUPER_ADMIN,
      email: ENV.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isverified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);

    console.log('super admin created successfully! \n');
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
