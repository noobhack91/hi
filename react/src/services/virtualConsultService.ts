// react/src/services/virtualConsultService.ts

import { EventEmitter } from 'events';

class VirtualConsultService extends EventEmitter {
    launchMeeting(uuid: string, link: string): void {
        this.emit("event:launchVirtualConsult", { uuid, link });
    }
}

export default new VirtualConsultService();
