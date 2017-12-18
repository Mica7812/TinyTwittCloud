export class Tweet {
    items: any[];
    nextPageToken: string;

    constructor() {
        this.items = [];
        this.nextPageToken = "";
    }
}
