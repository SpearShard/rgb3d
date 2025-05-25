import './globals.css';

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