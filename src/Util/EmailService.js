import emailjs from 'emailjs-com'

export const codigoAuth = () => {
  return Math.floor(Math.random() * 1000000) + 100000;
}

export const enviarCorreo = async (usuario, codigo) => {

  const templateParams = {
    nombre_usuario: usuario.nombres,
    codigo: codigo,
    to_email: usuario.correo
  }

  console.log('Enviando a: ', usuario.correo);

  try {
    const result = await emailjs.send(
      "service_uhotbeg",
      "template_otprll5",
      templateParams,
      process.env.REACT_APP_EMAILJS_ID
    );

    console.log('Correo enviado: ', result.text);
    return true
  } catch (error) {
    console.log('Error al enviar correo: ', error);
    return false
  }
}