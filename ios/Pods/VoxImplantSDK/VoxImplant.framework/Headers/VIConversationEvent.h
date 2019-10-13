/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VIMessengerEvent.h"

@class VIConversation;

/**
 * Interface that represents messenger events related to conversation such as create, edit, remove and others.
 */
@interface VIConversationEvent : VIMessengerEventSeq

/**
 * Conversation instance with updated information.
 */
@property(nonatomic, strong) VIConversation *conversation;

@end

