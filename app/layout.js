import './globals.css';
import { PP_Neue_Montreal } from 'next/font/google';

// const ppNeueMontreal = PP_Neue_Montreal({
//     subsets: ['latin'],
//     display: 'optional',
//     weight: ['400', '500', '600', '700'],
// });

export const metadata = {
  title: 'RGB Design',
  description: 'Creative design studio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
      </head>
      <body className="overflow-hidden m-0 p-0" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}