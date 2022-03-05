import { user_library_data } from "shared/types/admin";

export async function fetch_libraries(): Promise<user_library_data[]> {
    const response = await fetch("/ras-lights/api/lib/");
    return await response.json();
}

export async function save_library(lib: user_library_data): Promise<void> {
    await fetch("/ras-lights/api/lib/", {
        method: "POST",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lib),
    });
}

export async function delete_library(name: string): Promise<void> {
    await fetch(`/ras-lights/api/lib/${name}`, {
        method: "DELETE",
        cache: "no-cache",
    });
}

export async function reload_library(name: string): Promise<void> {
    const res = await fetch(`/ras-lights/api/lib/reload/${name}`, {});
    return await res.json();
}
