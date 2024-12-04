export const addVideoCall = (uuid, data) => ({ type: 'VIDEO_CALL_ADD', uuid, data });

export const removeVideoCall = uuid => ({ type: 'VIDEO_CALL_REMOVE', uuid });
