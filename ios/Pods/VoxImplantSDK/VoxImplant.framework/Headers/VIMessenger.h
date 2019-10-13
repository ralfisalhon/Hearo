/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

@class VIMessenger;
@class VIConversation;
@class VIMessage;
@class VIUser;
@class VIPayload;


@class VIConversationParticipant;
@class VISubscribeEvent;
@class VIErrorEvent;
@class VIUserEvent;
@class VIUserStatusEvent;
@class VIConversationEvent;
@class VIMessageEvent;
@class VIRetransmitEvent;
@class VIConversationServiceEvent;


/**
 * Events available for push notification subscription.
 */
typedef NS_ENUM(NSInteger, VIMessengerNotification) {
    /** Notify that message in a conversation is edited */
            VIMessengerNotificationEditMessage,
    /** Notify about new message in a conversation */
            VIMessengerNotificationSendMessage
};

/**
 * Delegate that may be used to handle messenger events.
 */
@protocol VIMessengerDelegate <NSObject>

/**
 * Triggered as a result of <[VIMessenger getUser:]> method call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with user data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didGetUser:(VIUserEvent *)event;

/**
 * Triggered as the result of <[VIMessenger editUserWithCustomData:privateCustomData:]> method call.
 *
 * Triggered only for users specified in the 'subscribe' method call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with user data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didEditUser:(VIUserEvent *)event;

/**
 * Triggered as the result of <[VIMessenger subscribe:]> method call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with subscription data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didSubscribe:(VISubscribeEvent *)event;

/**
 * Triggered as the result of <[VIMessenger unsubscribe:]> method call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with subscription data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didUnsubscribe:(VISubscribeEvent *)event;

/**
 * Triggered if error occurred as the result of any messenger API methods call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with error details and service information.
 */
- (void)messenger:(VIMessenger *)messenger didReceiveError:(VIErrorEvent *)event;

/**
 * Triggered after user presence state has been changed.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with user status data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didSetStatus:(VIUserStatusEvent *)event;

/**
 * Triggered when conversation is created as the result of <[VIMessenger createConversation:moderators:title:distinct:enablePublicJoin:customData:]> method call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with conversation data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didCreateConversation:(VIConversationEvent *)event;

/**
 * Triggered when conversation properties were modified.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with conversation data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didEditConversation:(VIConversationEvent *)event;

/**
 * Triggered when conversation was removed as the result of <[VIMessenger removeConversation:]> method call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with conversation data and service info.
 */
- (void)messenger:(VIMessenger *)messenger didRemoveConversation:(VIConversationEvent *)event;

/**
 * Triggered when conversation description is received as the result of <[VIMessenger getConversation:]> method call.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with conversation data and service info.
 */
- (void)messenger:(VIMessenger *)messenger didGetConversation:(VIConversationEvent *)event;

/**
 * Triggered when new message is received as the result of <[VIConversation sendMessage:payload:]> called by any user.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with message data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didSendMessage:(VIMessageEvent *)event;

/**
 * Triggered when message was edited.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with message data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didEditMessage:(VIMessageEvent *)event;

/**
 * Triggered when message was removed.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with message data and service information.
 */
- (void)messenger:(VIMessenger *)messenger didRemoveMessage:(VIMessageEvent *)event;

/**
 * Triggered when information that some user is typing something is received as the result of <[VIConversation typing]> called by any user.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with conversation UUID and service information.
 */
- (void)messenger:(VIMessenger *)messenger didReceiveTypingNotification:(VIConversationServiceEvent *)event;

/**
 * Triggered after another device with same logged in user called the <[VIConversation markAsRead:]> method.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with conversation UUID and service information.
 */
- (void)messenger:(VIMessenger *)messenger didReceiveReadConfirmation:(VIConversationServiceEvent *)event;

/**
 * Triggered after another device with same logged in user called <[VIConversation markAsDelivered:]> method.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with conversation UUID and service information.
 */
- (void)messenger:(VIMessenger *)messenger didReceiveDeliveryConfirmation:(VIConversationServiceEvent *)event;

/**
 * Triggered as the result of <[VIConversation retransmitEventsFrom:to:]> method call on some conversation for this SDK instance.
 *
 * @param messenger Messenger instance.
 * @param event     Event object with retransmitted events and service information.
 */
- (void)messenger:(VIMessenger *)messenger didRetransmitEvents:(VIRetransmitEvent *)event;
@end


/**
 * Interface that may be used to control messaging functions.
 */
@interface VIMessenger : NSObject

/**
 * Add delegate to handle messenger events.
 *
 * @param delegate Instance to be added as delegate.
 */
- (void)addDelegate:(id <VIMessengerDelegate>)delegate;

/**
 * Remove previously added delegate.
 *
 * @param delegate Delegate to be removed.
 */
- (void)removeDelegate:(id <VIMessengerDelegate>)delegate;

/**
 * Create new conversation.
 *
 * Triggers the <[VIMessengerDelegate messenger:didCreateConversation:]> event for all messenger
 * objects on all connected clients that are mentioned in the 'participants' array.
 *
 * @param participants     Array of participants.
 * @param moderators       Array of conversation moderators' names.
 * @param title            Conversation title.
 * @param distinct         Specify if conversation is distinct.
 * @param enablePublicJoin If set to 'YES', anyone can join conversation by uuid.
 * @param customData       Dictionary with custom data, up to 5kb.
 * @param uberConversation Specify if the conversation is uber conversation.
 */
- (void)createConversation:(NSArray<VIConversationParticipant *> *)participants
                moderators:(NSArray<NSString *> *)moderators
                     title:(NSString *)title
                  distinct:(BOOL)distinct
          enablePublicJoin:(BOOL)enablePublicJoin
                customData:(NSDictionary *)customData
          uberConversation:(BOOL)uberConversation;

/**
 * Leave current user from the conversation specified by the UUID.
 *
 * @param uuid Conversation UUID.
 */
- (void)leaveConversation:(NSString *)uuid;

/**
 * Join current user to the conversation specified by the UUID.
 *
 * @param uuid Conversation UUID.
 */
- (void)joinConversation:(NSString *)uuid;

/**
 * Remove the conversation specified by the UUID.
 *
 * @param uuid UUID of the conversation to be removed.
 */
- (void)removeConversation:(NSString *)uuid;

/**
 * Get the Voximplant user identifier, ex username@appname.accname, for the current user.
 *
 * @return Current user identifier.
 */
- (NSString *)getMe;

/**
 * Get user information for the user specified by the Voximplant user identifier, ex username@appname.accname.
 *
 * User will be returned with <[VIMessengerDelegate messenger:didGetUser:]> event.
 *
 * @param user User identifier.
 */
- (void)getUser:(NSString *)user;

/**
 * Get user information for the users specified by the array of the Voximplant user identifiers, ex username@appname.accname.
 *
 * Note that calling this method will result in multiple <[VIMessengerDelegate messenger:didGetUser:]> events.
 *
 * @param users Array of user identifiers.
 */
- (void)getUsers:(NSArray<NSString *> *)users;

/**
 * Edit current user information.
 *
 * @param customData        New custom data. If nil, previously set custom data will not be changed. If empty map, previously set custom data will be removed.
 * @param privateCustomData New private custom data. If nil, previously set private custom data will not be changed. If empty map, previously set private custom data will be removed.
 */
- (void)editUserWithCustomData:(NSDictionary *)customData privateCustomData:(NSDictionary *)privateCustomData;

/**
 * Subscribe for user information change and presence status change.
 *
 * On change, the <[VIMessengerDelegate messenger:didSetStatus:]> event will be triggered.
 *
 * @param users Array of Voximplant user identifiers, ex username@appname.accname.
 */
- (void)subscribe:(NSArray<NSString *> *)users;

/**
 * Unsubscribe for user information change and presence status change.
 *
 * @param users Array of Voximplant user identifiers, ex username@appname.accname.
 */
- (void)unsubscribe:(NSArray<NSString *> *)users;

/**
 * Get conversation by its UUID.
 *
 * Requested conversation will be returned with <[VIMessengerDelegate messenger:didGetConversation:]> event.
 *
 * @param uuid Conversation UUID.
 */
- (void)getConversation:(NSString *)uuid;

/**
 * Get multiple conversations by array of UUIDs. Maximum 30 conversations.
 *
 * Note that calling this method will result in multiple <[VIMessengerDelegate messenger:didGetConversation:]> events.
 *
 * @param uuids Array of conversation UUIDs.
 */
- (void)getConversations:(NSArray<NSString *> *)uuids;

/**
 * Set user presence status.
 *
 * Triggers the <[VIMessengerDelegate messenger:didSetStatus:]> event for all messenger objects on all connected clients which are subscribed for notifications about this user. Including this one if conditions are met.
 *
 * @param online YES if user is available for messaging, NO otherwise.
 */
- (void)setStatus:(BOOL)online;

/**
 * Manage messenger push notification subscriptions.
 *
 * @param notifications Array of <VIMessengerNotification> to be subscribed on.
 */
- (void)managePushNotifications:(NSArray<NSNumber *> *)notifications;

/**
 * Recreate conversation. Note that this method does not create conversation, but restore previously created conversation.
 *
 * @param participants     Array of conversation participants.
 * @param title            Conversation title.
 * @param distinct         Specify if conversation is distinct.
 * @param enablePublicJoin If set to 'YES', anyone can join conversation by uuid.
 * @param customData       Conversation custom data.
 * @param uuid             Conversation UUID.
 * @param sequence         Sequence of last event.
 * @param moderators       Array of conversation's moderators.
 * @param lastUpdate       UNIX timestamp that specifies the time of the last event in the conversation.
 * @param lastRead         Sequence of last event that was read by user.
 * @param createdAt        UNIX timestamp that specifies the time of the conversation creation.
 * @param uberConversation Specify if the conversation is uber conversation.
 * @return                 Conversation instance.
 */
- (VIConversation *)recreateConversation:(NSArray<VIConversationParticipant *> *)participants
                                   title:(NSString *)title
                                distinct:(BOOL)distinct
                        enablePublicJoin:(BOOL)enablePublicJoin
                              customData:(NSDictionary *)customData
                                    uuid:(NSString *)uuid
                                sequence:(NSNumber *)sequence
                              moderators:(NSArray<NSString *> *)moderators
                              lastUpdate:(NSNumber *)lastUpdate
                                lastRead:(NSNumber *)lastRead
                               createdAt:(NSNumber *)createdAt
                        uberConversation:(BOOL)uberConversation;

/**
 * Recreate a message. Note that this method does not create message, but restore previously created message.
 *
 * @param uuid             Universally unique identifier of message.
 * @param conversationUUID UUID of the conversation this message belongs to.
 * @param sender           User id of the sender of this message.
 * @param text             Text of this message.
 * @param payload          Array of Payload objects associated with the message.
 * @param sequence         Message sequence number.
 * @return                 Message instance.
 */
- (VIMessage *)recreateMessage:(NSString *)uuid
                  conversation:(NSString *)conversationUUID
                        sender:(NSString *)sender
                          text:(NSString *)text
                       payload:(NSArray<VIPayload *> *)payload
                      sequence:(NSNumber *)sequence;


@end
