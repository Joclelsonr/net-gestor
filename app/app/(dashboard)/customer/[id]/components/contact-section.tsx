import Link from "next/link";

import type { Customer, Address } from "@/generated/prisma/client";

type ContactProps = { customer: Customer & { address: Address[] } };

export function ContactSection({ customer }: ContactProps) {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-5 text-sm">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
        Contato e endereço
      </h2>
      <p>
        <span className="text-muted-foreground">Telefone:</span>{" "}
        {customer.phone}
      </p>
      <p>
        <span className="text-muted-foreground">WhatsApp:</span>
        {customer.whatsapp}
      </p>
      <p>
        <span className="text-muted-foreground">E-mail:</span> {customer.email}
      </p>
      {customer?.address?.map((address, index) => (
        <div key={address.id ?? index} className="space-y-2">
          <p>
            <span className="text-muted-foreground">Endereço:</span>{" "}
            {address.street}, {address.number} - {address.district}
          </p>
          <p>
            <span className="text-muted-foreground">Bairro:</span>{" "}
            {address.district}
          </p>
          <p>
            <span className="text-muted-foreground">Cidade:</span>{" "}
            {address.city}/{address.state}
          </p>

          {address.lat != null && address.lng != null && (
            <Link
              className="text-primary underline"
              target="_blank"
              rel="noreferrer"
              href={`https://www.openstreetmap.org/?mlat=${address.lat}&mlon=${address.lng}#map=18/${address.lat}/${address.lng}`}
            >
              Ver no mapa
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
