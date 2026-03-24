import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Incorporate authorization into actor
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type BlobId = Blob;
  type SiteId = Nat;

  type SiteData = {
    name : Text;
    blobId : Storage.ExternalBlob;
    uploadDate : Time.Time;
    owner : Principal;
  };

  module SiteData {
    public func compare(a : SiteData, b : SiteData) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  type Site = {
    name : Text;
    blobId : Storage.ExternalBlob;
  };

  type SiteWithId = {
    id : SiteId;
    name : Text;
    blobId : Storage.ExternalBlob;
  };

  var nextSiteId : SiteId = 0;
  let sites = Map.empty<SiteId, SiteData>();

  func getSiteInternal(siteId : SiteId) : SiteData {
    switch (sites.get(siteId)) {
      case (null) { Runtime.trap("Site not found!") };
      case (?site) { site };
    };
  };

  // Add new site
  public shared ({ caller }) func addSite(name : Text, blobId : Storage.ExternalBlob) : async SiteId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can add sites!");
    };
    let siteId = nextSiteId;
    let site : SiteData = {
      name;
      blobId;
      uploadDate = Time.now();
      owner = caller;
    };
    sites.add(siteId, site);
    nextSiteId += 1;
    siteId;
  };

  // Get all sites of caller (with IDs)
  public query ({ caller }) func getCallerSitesWithIds() : async [SiteWithId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can list sites!");
    };

    sites.toArray()
      .filter(func((_, site)) { site.owner == caller })
      .map(func((id, site)) { { id; name = site.name; blobId = site.blobId } });
  };

  // Get all sites of caller (legacy, without IDs)
  public query ({ caller }) func getAllCallerSites() : async [Site] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can list sites!");
    };

    sites.toArray()
      .filter(func((_, site)) { site.owner == caller })
      .map(func((_, site)) { { name = site.name; blobId = site.blobId } });
  };

  // Delete site by id
  public shared ({ caller }) func deleteSite(siteId : SiteId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can delete sites!");
    };
    switch (sites.get(siteId)) {
      case (null) { Runtime.trap("Site not found!") };
      case (?site) {
        if (site.owner != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: You can't delete someone else's site!");
        };
        sites.remove(siteId);
      };
    };
  };

  // Get all site IDs (admin only - for management purposes)
  public query ({ caller }) func getAllSiteIds() : async [SiteId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list all site IDs!");
    };
    sites.toArray().map(func((id, _site)) { id });
  };

  // Get site by id (owner or admin only)
  public query ({ caller }) func getSite(siteId : SiteId) : async (Text, Site) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view sites!");
    };
    let site = getSiteInternal(siteId);
    if (site.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own sites!");
    };
    (site.name, { name = site.name; blobId = site.blobId });
  };

  // Return site file content directly to browser (owner or admin only)
  public shared ({ caller }) func getSiteFile(siteId : SiteId) : async Storage.ExternalBlob {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can access site files!");
    };
    let site = getSiteInternal(siteId);
    if (site.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only access your own site files!");
    };
    site.blobId;
  };
};
