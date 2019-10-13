/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VIMessengerEvent.h"

/**
 * Interface that represents messenger events related to subscriptions.
 */
@interface VISubscribeEvent : VIMessengerEvent

/**
 *  Array of Voximplant user identifiers of current (un)subscription.
 */
@property(nonatomic, strong, readonly) NSArray<NSString *> *users;

@end

