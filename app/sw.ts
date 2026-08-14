import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const dynamicRevision = Math.random().toString(36).substring(2);

const serwist = new Serwist({
    precacheEntries: [
        ...(self.__SW_MANIFEST || []),
        { url: '/', revision: dynamicRevision },
        { url: '/play', revision: dynamicRevision },
    ],
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
    fallbacks: {
        entries: [
            {
                url: '/~offline',
                matcher({ request }) {
                    return request.destination === 'document';
                },
            },
        ],
    },
})

serwist.addEventListeners();