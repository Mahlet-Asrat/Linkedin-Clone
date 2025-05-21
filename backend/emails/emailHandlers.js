import { mailtrapClient, sender } from "../lib/mailtrap.js"
import createWelcomeEmailTemplate from "./emailTemplates.js"

export const sendWelcomeEmail = async(email, name, profileUrl) =>{

    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient, 
            subject: 'Welcome to MyLinkedin',
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: 'welcome'
        })
        console.log("welcome email sent successfully", response)
    }catch(error){
        throw new Error({message: error.message})
    }
}