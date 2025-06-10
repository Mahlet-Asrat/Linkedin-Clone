import { mailtrapClient, sender } from "../lib/mailtrap.js";
import createWelcomeEmailTemplate, {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to MyLinkedin",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome",
    });
    console.log("welcome email sent successfully", response);
  } catch (error) {
    throw new Error({ message: error.message });
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  comment
) => {
  const recipient = [{ email: recipientEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "New Comment on Your Post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        comment
      ),
      category: "comment_notification",
    });

    console.log("Comment Notification Email sent successfully", response);
  } catch (error) {
    throw error;
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  const recipient = [{ email: senderEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
      category: "connection_accepted",
    });
    
    console.log("Connection Accepted Email sent successfully", response);

  } catch (error) {
    throw error
  }
};
