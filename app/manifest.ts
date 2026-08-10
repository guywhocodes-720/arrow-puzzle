import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Arrow Escape",
        short_name: "Arrow Escape",
        description: 'A minimalist directional logic puzzle game',
        start_url: "/",
        display: "standalone",
        background_color: "#1a1b26",
        theme_color: "#38bdf8",
        icons: [
            {
                src: '/android/launchericon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/android/launchericon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ],
    }
}