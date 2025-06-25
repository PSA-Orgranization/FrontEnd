import { ToastContainer } from "react-toastify";
import "./globals.css";

export const customStyle = {
  backgroundImage:
    "linear-gradient(40deg, #000001 0%, #082540 75%, #ee4392 100%)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ height: "100%", margin: 0 }}>
      <body style={{ ...customStyle }}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
