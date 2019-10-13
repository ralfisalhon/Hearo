/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VIMessengerEvent.h"

@class VIMessage;

/**
 * Interface that represents messenger events related to messages.
 */
@interface VIMessageEvent : VIMessengerEventSeq

/**
 * Message instance with updated information.
 */
@property(nonatomic, strong, readonly) VIMessage *message;

@end
