/**
 * Compresses a File (image) using Canvas so the result is ≤ maxSizeMB.
 * Iteratively reduces JPEG quality until the target size is met.
 * Returns a new File with the same name.
 */
export async function compressImage(file: File, maxSizeMB = 2): Promise<File> {
    const maxBytes = maxSizeMB * 1024 * 1024;

    // If already within limit, return as-is
    if (file.size <= maxBytes) return file;

    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement("canvas");
            // Scale down if image is very large (max 1920px wide)
            const MAX_WIDTH = 1920;
            let { width, height } = img;
            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, width, height);

            // Try reducing quality iteratively until ≤ maxBytes
            let quality = 0.85;
            const tryCompress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file); // fallback
                            return;
                        }
                        if (blob.size <= maxBytes || quality <= 0.1) {
                            resolve(new File([blob], file.name, { type: "image/jpeg" }));
                        } else {
                            quality -= 0.1;
                            tryCompress();
                        }
                    },
                    "image/jpeg",
                    quality
                );
            };

            tryCompress();
        };

        img.src = url;
    });
}
