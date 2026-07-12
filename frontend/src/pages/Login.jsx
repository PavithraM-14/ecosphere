import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">

      <div className="bg-white p-10 rounded-xl shadow-lg w-96">

        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          🌿 EcoSphere
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6"
        />

        <Link to="/dashboard">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg">
            Login
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Login;