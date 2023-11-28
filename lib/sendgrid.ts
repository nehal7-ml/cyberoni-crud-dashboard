import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendPasswordEmail({ email, password }: { email: string, password: string }) {

    const msg: sgMail.MailDataRequired = {
        to: email, // Change to your recipient
        from: process.env.SENDGRID_EMAIL as string, // Change to your verified sender
        subject: 'Welcome to Apartment Guru',
        html: `
          <section>
            <h1>Welcome to Apartment Guru</h1>
            
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
