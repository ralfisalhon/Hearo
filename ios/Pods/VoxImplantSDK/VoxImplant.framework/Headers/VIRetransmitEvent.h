/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VIMessengerEvent.h"

/**
 * Interface that represents messenger event for <[VIConversation retransmitEventsFrom:to:]> method call result.
 */
@interface VIRetransmitEvent : VIMessengerEvent

/**
 * Array of event objects that was retransmitted.
 */
@property(nonatomic, strong, readonly) NSArray<VIMessengerEventSeq *> *events;

/**
 * Event sequence number from which the events are retransmitted.
 */
@property(nonatomic, strong, readonly) NSNumber *fromSequence;

/**
 * Event sequence number to which the events are retransmitted.
 */
@property(nonatomic, strong, readonly) NSNumber *toSequence;

@end
