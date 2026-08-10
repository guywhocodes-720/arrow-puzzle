import { Metadata } from "next";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
    title: "Offline | Arrow Escape",
};

export default function OfflinePage() {
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-4 w-full h-full min-h-[calc(100vh-3.5rem)] text-center">
            <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full shadow-lg flex flex-col items-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <WifiOff className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">You are offline</h1>
                    <p className="text-muted-foreground">
                        Arrow Escape requires an active connection to save your progress and load levels. Please check your network and try again.
                    </p>
                </div>
            </div>
        </main>
    );
}
