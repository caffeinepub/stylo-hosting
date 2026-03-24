import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Site {
    name: string;
    blobId: ExternalBlob;
}
export interface SiteWithId {
    id: bigint;
    name: string;
    blobId: ExternalBlob;
}
export type SiteId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addSite(name: string, blobId: ExternalBlob): Promise<SiteId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSite(siteId: SiteId): Promise<void>;
    getAllCallerSites(): Promise<Array<Site>>;
    getAllSiteIds(): Promise<Array<SiteId>>;
    getCallerSitesWithIds(): Promise<Array<SiteWithId>>;
    getCallerUserRole(): Promise<UserRole>;
    getSite(siteId: SiteId): Promise<[string, Site]>;
    getSiteFile(siteId: SiteId): Promise<ExternalBlob>;
    isCallerAdmin(): Promise<boolean>;
}
