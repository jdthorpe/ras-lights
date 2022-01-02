import { show } from "@ras-lights/common/types/mode";

export async function fetch_modes(): Promise<show[]> {
    const response = await fetch("/api/mode/");
    return await response.json();
}

export async function save_show(show: show): Promise<void> {
    await fetch("/api/show/", {
        method: "POST",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(show),
    });
}

export async function set_current_show(show: show): Promise<void> {
    await fetch("/api/mode/", {
        method: "POST",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(show),
    });
}
