import { User } from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    const user = await User.findOne({
        where: {
            email
        }
    })
    if (user) {
        return res.status(400).send({
            message: "Ya existe ese email"
        })
    }

    // Configura 10 rondas de salt (costo computacional)
    const saltRounds = 10;

    // Genera un salt único
    const salt = await bcrypt.genSalt(saltRounds);

    // Hashea la contraseña con el salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea el nuevo usuario en la base de datos
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Devuelve solo el ID del nuevo usuario
    res.json(newUser.id);
}

export const loginUser= async(req,res)=>{
    const {email, password}=req.body

    const user = await User.findOne({
        where:{
            email
        }
    })

    if (!user) {
        return res.status(400).send({
            message: "Usuario no registrado"
        })
    }

      // Compara la contraseña ingresada con el hash almacenado
      const comparison = await bcrypt.compare(password, user.password);

      // Si no coinciden, devuelve error 401
      if (!comparison)
          return res.status(401).send({ message: "Email y/o contraseña incorrecta" });
  
      // Clave secreta para firmar el token (debería estar en variables de entorno)
      const secretKey = 'programacion3-2025';
  
      // Genera un token JWT que expira en 1 hora
      const token = jwt.sign({ username:user.name,email }, secretKey, { expiresIn: '1h' });
  
      // Devuelve el token al cliente
      return res.json(token);
  }