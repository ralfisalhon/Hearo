/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

@class VIPayload;

/**
 * Interface that represents message within a conversation.
 */
@interface VIMessage : NSObject

/**
 * UUID of the conversation this message belongs to.
 */
@property(nonatomic, strong, readonly) NSString *conversation;

/**
 * User id of the sender of this message.
 */
@property(nonatomic, strong, readonly) NSString *sender;

/**
 * Universally unique identifier of message.
 */
@property(nonatomic, strong, readonly) NSString *uuid;

/**
 * Message sequence number.
 */
@property(nonatomic, strong, readonly) NSNumber *seq;

/**
 * Text of this message.
 */
@property(nonatomic, strong) NSString *text;

/**
 * Array of Payload objects associated with the message.
 */
@property(nonatomic, strong) NSArray<VIPayload *> *payload;

/**
 * Sends text and payload changes to the server.
 */
- (void)update;

/**
 * Remove the message.
 *
 * Triggers the <[VIMessengerDelegate messenger:didRemoveMessage:]> event for all messenger objects on all clients, including this one.
 *
 * Clients that are not connected will receive it later.
 */
- (void)remove;


@end
