import { ToastContainer } from "react-toastify";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customStyle = {
    backgroundImage:
      "linear-gradient(40deg, #000001 0%, #082540 75%, #ee4392 100%)",
  };

  return (
    <html lang="en">
      <body style={{ ...customStyle }}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
