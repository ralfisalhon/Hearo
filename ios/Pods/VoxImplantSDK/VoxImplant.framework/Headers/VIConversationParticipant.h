/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

/**
 * Interface that represents participant of a conversation.
 */
@interface VIConversationParticipant : NSObject

/**
 * If 'YES', user can add, remove and edit access rights for conversation participants (but not conversation moderators).
 */
@property(nonatomic, assign) BOOL canManageParticipants;

/**
 * If 'YES', user can write to the conversation.
 */
@property(nonatomic, assign) BOOL canWrite;

/**
 * Voximplant user identifier, ex username@appname.accname.
 */
@property(nonatomic, copy, readonly) NSString *userId;

/**
 * Initialize conversation participant
 *
 * @param userId                 Voximplant user identifier, ex username@appname.accname.
 * @param canWrite               If 'YES', user can write to the conversation.
 * @param canManageParticipants  If 'YES', user can add, remove and edit access rights for conversation participants (but not conversation moderators).
 * @return                       Participant instance.
 */
- (instancetype)initWithUserId:(NSString *)userId canWrite:(BOOL)canWrite canManageParticipants:(BOOL)canManageParticipants;

@end
