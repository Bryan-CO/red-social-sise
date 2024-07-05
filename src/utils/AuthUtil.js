import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
/// Metodos para autenticacion 

export class AuthUtil {

    // GENERATE TOKEN WITH JWT
    static async generateToken( payload ) {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { id: payload.id, username: payload.username, role: payload.role },
                process.env.JWT_SECRET,
                { expiresIn: '3d' },
                (err, token) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                }
            );  
        });
    }

    // GENERATE PASSWORD WITH BCRYPT
    static async hashPassword( password ) {
        try {
            const rounds = parseInt(process.env.BCRYPT_SALT);
            const salt = await bcrypt.genSalt(rounds);
            const hashedPass = await bcrypt.hash(password, salt);
            return hashedPass;
        } catch (err) { 
            console.log(err);
        }
    }

    // COMPARE PASSWORD 
    static async comparePassword( password, hashedPassword ) {
        try {
            const validPassword = await bcrypt.compare(password, hashedPassword);
            return validPassword;
        } catch (err) {
            console.log(err);
        }
    }  
    
}