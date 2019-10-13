/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

@class VIEndpoint;
@class VIVideoStream;
@class VICall;
@class VIEndpointStat;

NS_ASSUME_NONNULL_BEGIN

/**
 * Delegate that may be used to handle endpoint events.
 */
@protocol VIEndpointDelegate <NSObject>

@optional

/**
 * Triggered after endpoint added video stream to the call.
 *
 * Triggered always on the main thread, even delegateQueue is not the main thread.
 *
 * @param endpoint    Endpoint that triggered this event.
 * @param videoStream Remote video stream added to the call.
 */
- (void)endpoint:(VIEndpoint *)endpoint didAddRemoteVideoStream:(VIVideoStream *)videoStream;

/**
 * Triggered after endpoint removed video stream from the call.
 *
 * Triggered always on the main thread, even delegateQueue is not the main thread.
 *
 * @param endpoint    Endpoint that triggered this event.
 * @param videoStream Remote video stream removed from the call.
 */
- (void)endpoint:(VIEndpoint *)endpoint didRemoveRemoteVideoStream:(VIVideoStream *)videoStream;


/**
 * Invoked when endpoint information such as display name, user name and sip uri is updated.
 *
 * @param endpoint Endpoint which information is updated.
 */
- (void)endpointInfoDidUpdate:(VIEndpoint *)endpoint;

/**
 * Invoked after endpoint is removed from the call. Event is not triggered on call end.
 *
 * @param endpoint Removed endpoint.
 */
- (void)endpointDidRemove:(VIEndpoint *)endpoint;

@end

/** VIEndpoint */
@interface VIEndpoint : NSObject

/**
 * Delegate to handle the endpoint events.
 */
@property(nonatomic, weak, nullable) id <VIEndpointDelegate> delegate;


/**
 * Call associated with the endpoint.
 */
@property(nonatomic, weak, readonly) VICall *call;

/**
 * Statistics for the endpoint.
 */
@property(nonatomic, strong, readonly, nullable) VIEndpointStat *stat;

/**
 * Video streams associated with the endpoint.
 */
@property(nonatomic, strong, readonly) NSArray<VIVideoStream *> *remoteVideoStreams;

/**
 * The endpoint id.
 */
@property(nonatomic, strong, readonly) NSString *endpointId;

/**
 * User name of the endpoint.
 */
@property(nonatomic, strong, readonly, nullable) NSString *user;

/**
 * SIP URI of the endpoint.
 */
@property(nonatomic, strong, readonly, nullable) NSString *sipURI;

/**
 * User display name of the endpoint.
 */
@property(nonatomic, strong, readonly, nullable) NSString *userDisplayName;

@end

NS_ASSUME_NONNULL_END
