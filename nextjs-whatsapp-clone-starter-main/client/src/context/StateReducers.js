import { reduceCases } from "./constants";


export const initialState = {
    userInfo:undefined,
    newUser:false,
    contactsPage:false,
    currentChatUser: undefined,
    messages: [],
    socket:undefined,
    messagesSearch:false,
    userContacts: [],
    onlineUsers:[],
    filteredContacts:[],
    videoCall:undefined,
    voiceCall:undefined,
    incomingVoiceCall:undefined,
    incomingVideoCall:undefined,
   
};

const reducer =(state, action) => {
    switch (action.type) {
       case reduceCases.SET_USER_INFO:  
       return{
            ...state,
            userInfo: action.userInfo,
       };
       case reduceCases.SET_NEW_USER:
        return {
            ...state,
            newUser:action.newUser, 
        };
        
        case reduceCases.SET_ALL_CONTACTS_PAGE:
            return{
                ...state,
                contactsPage: !state.contactsPage,
            };
        case reduceCases.CHANGE_CURRENT_CHAT_USER:
            return{
                ...state,
                currentChatUser: action.user,
            };
            case reduceCases.SET_MESSAGES:
                return{
                    ...state,
                    messages: action.messages,
                }; 
            case reduceCases.SET_SOCKET:
                return{
                    ...state,
                    socket: action.socket,
                };
            case reduceCases.ADD_MESSAGE:
                return{
                    ...state,
                    messages: [...state.messages, action.newMessage],
                };
            case reduceCases.SET_MESSAGE_SEARCH:
                    return{
                        ...state,
                        messagesSearch: !state.messagesSearch,
                    };
            case reduceCases.SET_USER_CONTACTS:
                        return{
                            ...state,
                            userContacts: action.userContacts,
                        };
            case reduceCases.SET_ONLINE_USERS:
                        return{
                            ...state,
                            onlineUsers: action.onlineUsers,
                        };   
            case reduceCases.SET_CONTACT_SEARCH:{
                      const filteredContacts = state.userContacts.filter((contact) =>
                        contact.name.toLowerCase().includes(action.contactSearch.toLowerCase())
                      
                    );
                    return {
                        ...state,
                        contactSearch: action.contactSearch,
                        filteredContacts,
                    }; 
                }
        case reduceCases.SET_VIDEO_CALL:
            return{
                ...state,
                videoCall: action.videoCall,
            }; 
        case reduceCases.SET_VOICE_CALL:
            return{
                ...state,
                voiceCall: action.voiceCall,
            };
        case reduceCases.SET_INCOMING_VOICE_CALL:
            return{
                ...state,
                incomingVoiceCall: action.incomingVoiceCall,
            };
        case reduceCases.SET_INCOMING_VIDEO_CALL:
            return{
                ...state,
                incomingVideoCall: action.incomingVideoCall,
            };
        case reduceCases.END_CALL:
            return{
                ...state,
                voiceCall:undefined,
                videoCall:undefined,
                incomingVideoCall:undefined,
                incomingVoiceCall:undefined,
            }
        case reduceCases.SET_EXIT_CHAT:
            return{
                ...state,
                currentChatUser:undefined,
            }
    

        default: 
          return state;
    }

};
 
export  default reducer;