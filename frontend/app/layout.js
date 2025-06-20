"use client";
import { Provider } from "react-redux";
import '../src/styles.css';
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import store from "./redux/store";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 ">
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
