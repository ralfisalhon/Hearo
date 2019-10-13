/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VIMessengerEvent.h"

/**
 * Interface that represents messenger events related to user presence state changes.
 */
@interface VIUserStatusEvent : VIMessengerEvent

/**
 * User presence status.
 */
@property(nonatomic, assign, readonly) BOOL online;

/**
 * UNIX timestamp that specifies the time event was triggered.
 */
@property(nonatomic, strong, readonly) NSNumber *timestamp;

@end
