export function safeJsonParse<T>(value: string | undefined | null, fallback: T | null = null): T | null {
    if (!value) return fallback;
    try {
        // Handle potentially double-escaped user input from Env Vars
        // e.g. "{\"type\":...}" (string wrapped in quotes) -> {"type":...}
        const cleaned = value.trim();
        // If start/end with quotes, strip them (user error handling)
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
             try {
                return JSON.parse(JSON.parse(cleaned)); // Parse stringified JSON into object
             } catch {
                return JSON.parse(cleaned.slice(1, -1)); // Simple strip
             }
        }
        return JSON.parse(cleaned);
    } catch (error) {
        console.warn("safeJsonParse failed:", error);
        return fallback;
    }
}
