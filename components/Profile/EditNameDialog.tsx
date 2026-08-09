"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateDisplayName } from "@/app/profile/action";

export function EditNameDialog({ currentName }: { currentName: string }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <button 
                    className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10 cursor-pointer"
                    aria-label="Edit display name"
                />
            }>
                <Pencil className="w-4 h-4" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md outline-none border-none">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-widest uppercase text-foreground">Edit Display Name</DialogTitle>
                </DialogHeader>
                <form action={async (formData) => {
                    await updateDisplayName(formData);
                    setOpen(false);
                }} className="flex flex-col gap-6 mt-2">
                    <input
                        className="rounded-xl px-4 py-3 bg-input border-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background outline-none transition-all text-base w-full text-foreground"
                        name="displayName"
                        placeholder="e.g. PuzzleMaster"
                        defaultValue={currentName !== "Unknown Player" ? currentName : ""}
                        required
                        minLength={3}
                        maxLength={20}
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase hover:brightness-110 rounded-xl border-b-[4px] border-primary/50 active:translate-y-[2px] active:border-b-[2px] duration-75 text-center"
                    >
                        Save Changes
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
