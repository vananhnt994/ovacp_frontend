import { Button } from "./ui/button";
import { RegisterDialog } from "./register-dialog";
import { LoginDialog } from "./login-dialog";

export function Navbar() {
  return (
    <nav className="w-full border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-blue-600">OVACP</h1>
          <span className="text-gray-500 text-sm">Omni-Channel-Vertriebsanalyse-Plattform</span>
        </div>
        
        <div className="flex items-center gap-3">
          <RegisterDialog />
          <LoginDialog />
        </div>
      </div>
    </nav>
  );
}