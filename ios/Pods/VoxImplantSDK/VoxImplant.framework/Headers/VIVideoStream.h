/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

@protocol RTCVideoRenderer;
@class VIStreamStat;

/**
 * Interface representing local and remote video streams. It may be used to add or remove video renderers.
 */
@interface VIVideoStream : NSObject

/**
 * Video renderers associated with the stream. UI elements of RTCVideoRenderer type are used to display local preview or remote video.
 */
@property(nonatomic, strong, readonly) NSSet<id <RTCVideoRenderer>> *renderers;

/**
 * Statistics for the video stream. Updated every 5 seconds.
 */
@property(nonatomic, strong, readonly) VIStreamStat *stat;

/**
 * The video stream id.
 */
@property(nonatomic, copy, readonly) NSString *streamId;

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * Add new video renderer to the video stream. UI elements of RTCVideoRenderer type are used to display local preview or remote video.
 *
 * @param renderer New video renderer to be added.
 */
- (void)addRenderer:(id <RTCVideoRenderer>)renderer;

/**
 * Remove previously added video renderer from the video stream. UI elements of RTCVideoRenderer type are used to display local preview or remote video.
 *
 * @param renderer Previously added video renderer.
 */
- (void)removeRenderer:(id <RTCVideoRenderer>)renderer;

/**
 * Remove all video renderers associated with the video stream.
 */
- (void)removeAllRenderers;

@end
