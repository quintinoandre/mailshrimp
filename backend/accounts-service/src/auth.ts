import bcrypt from 'bcryptjs';

function hashPassword(password: string) {
	return bcrypt.hashSync(password, 10);
}

function comparePassword(password: string, hashPassword: string) {
	return bcrypt.compareSync(password, hashPassword);
}

export { hashPassword, comparePassword };
