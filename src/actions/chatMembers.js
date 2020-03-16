export const SAVE_CHAT_MEMBERS = 'SAVE_CHAT_MEMBERS'


export function saveChatMembers(members) {
    return {
        type: SAVE_CHAT_MEMBERS,
        members
    }
}
