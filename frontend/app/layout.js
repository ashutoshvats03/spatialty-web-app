"use client";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black  text-white">
        <AuthProvider>
          <Provider store={store}>
            <Navbar />
            {children}
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
