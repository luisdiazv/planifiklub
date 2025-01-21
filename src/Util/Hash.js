import bcrypt from 'bcryptjs';

const salt = process.env.REACT_APP_HASH_SALT;

const hash = async (password) => {
  try {
    const passwordHasheada = await bcrypt.hash(password, salt);
    return (passwordHasheada);
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    throw new Error('Hubo un problema al encriptar la contraseña');
  }
};

export default hash;
