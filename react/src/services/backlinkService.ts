// react/src/services/backlinkService.ts

interface BackLink {
    label: string;
    action: () => void;
}

class BacklinkService {
    private urls: BackLink[];

    constructor() {
        this.urls = [];
    }

    reset(): void {
        this.urls = [];
    }

    setUrls(backLinks: BackLink[]): void {
        this.reset();
        backLinks.forEach((backLink) => {
            this.addUrl(backLink);
        });
    }

    addUrl(backLink: BackLink): void {
        this.urls.push(backLink);
    }

    addBackUrl(label?: string): void {
        const backLabel = label || "Back";
        this.urls.push({ label: backLabel, action: () => window.history.back() });
    }

    getUrlByLabel(label: string): BackLink[] {
        return this.urls.filter((url) => url.label === label);
    }

    getAllUrls(): BackLink[] {
        return this.urls;
    }
}

export default new BacklinkService();
