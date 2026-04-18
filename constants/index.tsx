import { Info, Map, Calendar, Droplet } from "lucide-react";

export const sidebarItems = [
    {
        title: "Mapa Odbioru Odpadów",
        href: "/trasa",
        icon: Map
    },
    {
        title: "Detektor Odpadów",
        href: "/analyzer",
        icon: Info
    },
    {
        title: "Licznik Wody",
        href: "/water_meter",
        icon: Droplet
    },
    {
        title: "Harmonogram Odpadów",
        href: "/harmonogram",
        icon: Calendar
    },
]