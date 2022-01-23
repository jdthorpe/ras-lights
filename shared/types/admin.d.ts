export interface user_library {
    path: string;
    name: string;
}

export interface user_library_data extends user_library {
    type: "LIBRARY";
    // use: boolean;
    // watch: boolean;
}
