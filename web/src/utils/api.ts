import { show } from "@ras-lights/common/types/mode";

export async function fetch_modes(): Promise<show[]> {
    const response = await fetch("/api/mode/");
    return await response.json();
}

export async function save_mode(show: show): Promise<void> {
    await fetch("/api/mode/", {
        method: "PUT",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(show),
    });
}

export async function delete_mode(name: string): Promise<void> {
    await fetch("/api/mode/", {
        method: "DELETE",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
}

export async function set_current_mode(show: show): Promise<void> {
    await fetch("/api/mode/", {
        method: "POST",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(show),
    });
}
