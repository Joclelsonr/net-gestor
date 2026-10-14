import { Wifi } from "lucide-react";

import { FormLogin } from "./components/form-login";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-blue-950 p-12 text-muted grid-signal lg:flex">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-blue-500 text-muted">
            <Wifi className="h-5 w-5" />
          </span>
          Norte Telecom
        </div>
        <div>
          <p className="font-display text-5xl font-semibold leading-tight">
            Internet <span className="text-blue-500">fibra óptica</span> para
            <br />
            residências e empresas.
            <br />
            {/* seu provedor <span className="text-blue-500">em um só lugar.</span> */}
          </p>
          <p className="mt-4 max-w-md text-muted/50">
            Clientes, planos, contratos, cobrança e suporte técnico.
          </p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="w-2 rounded-sm bg-blue-500"
              style={{ height: 8 + i * 6, opacity: 0.4 + i * 0.15 }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <FormLogin />
      </div>
    </div>
  );
}
