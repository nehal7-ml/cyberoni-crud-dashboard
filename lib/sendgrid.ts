import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendPasswordEmail({ email, password, subject = "Cyberoni crud credentials" }: { email: string, password: string, subject?: string }) {

  const msg: sgMail.MailDataRequired = {
    to: email, // Change to your recipient
    from: process.env.SENDGRID_EMAIL as string, // Change to your verified sender
    subject: subject,
    html: `
          <section>
            <h1>Welcome to CyberOni</h1>
            
            <p>Login using the following credentials:</p>
            <div>
                <p>username: ${email}</p>
                <p>password: ${password}</p>
            </div>          
          <section>
        `
  }

  let response = await sgMail.send(msg);

  // console.log(response[0].body)
  return response[0].statusCode

}


export async function sendPasswordReset(email: string, token: string, subject: string = "Cyberoni crud credentials") {
  const msg: sgMail.MailDataRequired = {
    to: email, // Change to your recipient
    from: process.env.SENDGRID_EMAIL as string, // Change to your verified sender
    subject: 'Cyberoni crud Password reset request',
    html: `
          <section>
            <h1>Welcome to CyberOni</h1>
            
            <p>Click on the link to reset Password:</p>
            <div>
                <p>username: ${email}</p>
                <a href="${process.env.NEXTAUTH_URL}/auth/reset?token=${token}">Reset Password</a>
            </div>          
          <section>
        `
  }

  let response = await sgMail.send(msg);

  // console.log(response[0].body)
  return response[0].statusCode

}