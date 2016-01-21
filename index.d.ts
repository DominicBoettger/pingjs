declare class pinger {
    ping(dest: any, options: any): Promise<any>;
    protected generateEchoId(): Buffer;
    protected pingMessage(isReply: any, pingId: any, sequence: any, data: any): Buffer;
}
export = pinger;
