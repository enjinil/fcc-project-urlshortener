class UrlShortenerService {
    constructor() {
        this.urlMap = new Map();
        this.nextId = 1;
    }

    shortenUrl(originalUrl) {
        try {
            new URL(originalUrl);
        } catch {
            throw new Error("Invalid URL");
        }

        for (let [shortCode, url] of this.urlMap) {
            if (url === originalUrl) {
                return shortCode;
            }
        }

        const shortCode = this.nextId.toString();
        this.urlMap.set(shortCode, originalUrl);
        this.nextId++;
        return shortCode;
    }

    getOriginalUrl(shortCode) {
        const originalUrl = this.urlMap.get(shortCode);
        if (!originalUrl) {
            throw new Error("Short URL not found");
        }
        return originalUrl;
    }
}

module.exports = UrlShortenerService;
