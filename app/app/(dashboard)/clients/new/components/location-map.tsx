"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";

const icon = L.divIcon({
  className: "",
  html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:oklch(0.45 0.09 195);border:3px solid oklch(0.88 0.2 128);box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

type Props = {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
};

export function LocationMap({ lat, lng, onChange }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const cb = useRef(onChange);

  useEffect(() => {
    cb.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current).setView([-14.235, -51.925], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(m);
    m.on("click", (e: L.LeafletMouseEvent) =>
      cb.current(e.latlng.lat, e.latlng.lng),
    );
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m || lat == null || lng == null) return;
    if (!marker.current) {
      marker.current = L.marker([lat, lng], { icon, draggable: true }).addTo(m);
      marker.current.on("dragend", () => {
        const p = marker.current!.getLatLng();
        cb.current(p.lat, p.lng);
      });
    } else marker.current.setLatLng([lat, lng]);
    m.setView([lat, lng], Math.max(m.getZoom(), 17));
  }, [lat, lng]);

  return (
    <div ref={el} className="h-80 w-full overflow-hidden rounded-md border" />
  );
}
