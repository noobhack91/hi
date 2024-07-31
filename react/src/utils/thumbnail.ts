const documentsPath = '/path/to/documents'; // Adjust this path as needed

/**
 * Generates a thumbnail URL for a given document URL.
 * 
 * @param url - The original document URL.
 * @param extension - The desired extension for the thumbnail.
 * @returns The thumbnail URL or null if the URL is not provided.
 */
export function thumbnail(url: string, extension?: string): string | null {
    if (url) {
        if (extension) {
            return `${documentsPath}/${url.replace(/(.*)\.(.*)$/, `$1_thumbnail.${extension}`)}` || null;
        }
        return `${documentsPath}/${url.replace(/(.*)\.(.*)$/, `$1_thumbnail.$2`)}` || null;
    }
    return null;
}
