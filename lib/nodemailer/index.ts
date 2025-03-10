// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { EmailContent, EmailProductInfo, NotificationType } from '@/types/page';
// import nodemailer from 'nodemailer';



// export const Notification = {
//   WELCOME: 'WELCOME',
//   CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
//   LOWEST_PRICE: 'LOWEST_PRICE',
//   THRESHOLD_MET: 'THRESHOLD_MET',
// }

// export async function generateEmailBody(

//   product: EmailProductInfo,
//   type: NotificationType
//   ) {
//   const THRESHOLD_PERCENTAGE = 40;  // discount rate

//   // Short the product title
//   const shortenedTitle =
//     product.title.length > 20
//       ? `${product.title.substring(0, 20)}...`
//       : product.title;

//   let subject = "";
//   let body = "";

//   switch (type) {
//     case Notification.WELCOME:
//       subject = `WELCOME to Ecomspy for ${shortenedTitle}`;
//       body = `
//         <div>
//           <h2>WELCOME to Ecomspy 🚀</h2>
//           <p>You are now tracking ${product.title}.</p>
//           <p>Here's an example of how you'll receive updates:</p>
//           <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
//             <h3>${product.title} is back in stock!</h3>
//             <p>We're excited to let you know that ${product.title} is now back in stock.</p>
//             <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
//             <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
//           </div>
//           <p>Stay tuned for more updates on ${product.title} and other products you're tracking.</p>
//         </div>
//       `;
//       break;

//     case Notification.CHANGE_OF_STOCK:
//       subject = `${shortenedTitle} is now back in stock!`;
//       body = `
//         <div>
//           <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
//           <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
//         </div>
//       `;
//       break;

//     case Notification.LOWEST_PRICE:
//       subject = `Lowest Price Alert for ${shortenedTitle}`;
//       body = `
//         <div>
//           <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
//           <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
//         </div>
//       `;
//       break;

//     case Notification.THRESHOLD_MET:
//       subject = `Discount Alert for ${shortenedTitle}`;
//       body = `
//         <div>
//           <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
//           <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
//         </div>
//       `;
//       break;

//     default:
//       throw new Error("Invalid notification type.");
//   }

//   return { subject, body };
// }



  


// export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
//   try{

//     let transporter =await nodemailer.createTransport({
//       host: process.env.NODEMAILER_HOST,
//       port: 587,
//       secure:false,
//       auth: {
//         user: process.env.NODEMAILER_USER,
//         pass: process.env.NODEMAILER_PASS,
//       }
  
//     });

//     const mailOptions = {
//       from: 'amit@123gmail.com',
//       to: sendTo, 
//       html: emailContent.body,
//       subject: emailContent.subject,
//     }
  
//      transporter.sendMail(mailOptions, (error: any, info: any) => {
//       if(error) return console.log(error);
//       console.log('Email sent: ', info);

//       if(info.response.ok) toast.success("email sent succesfully")
      
//     })




   
//   }catch(err){
//     console.log(err)
//   }
 
// }


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import nodemailer from 'nodemailer';
import { EmailContent, EmailProductInfo, NotificationType } from '@/types/page';

export const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

export async function generateEmailBody(product: EmailProductInfo, type: NotificationType) {
  const THRESHOLD_PERCENTAGE = 40; // discount rate

  // Shorten the product title
  const shortenedTitle = product.title.length > 20 ? `${product.title.substring(0, 20)}...` : product.title;

  let subject = '';
  let body = '';

  switch (type) {
    case Notification.WELCOME:
      subject = `WELCOME to Ecomspy for ${shortenedTitle}`;
      body = `
        <div>
          <h2>WELCOME to Ecomspy 🚀</h2>
          <p>You are now tracking ${product.title}.</p>
          <p>Here's an example of how you'll receive updates:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} is back in stock!</h3>
            <p>We're excited to let you know that ${product.title} is now back in stock.</p>
            <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
            <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Stay tuned for more updates on ${product.title} and other products you're tracking.</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
          <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: 'amit@123gmail.com',
      to: sendTo,
      html: emailContent.body,
      subject: emailContent.subject,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);

    toast.success("Email sent successfully");
  } catch (err) {
    console.error('Error sending email:', err);
    toast.error("Error sending email");
  }
};
