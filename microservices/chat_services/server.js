const express = require('express')
const bodyParser = require("body-parser");
const moment = require('moment-timezone');
const cors = require("cors");
const {
    jwtTokenChecking,
    jwtTokenCheckingSocket
} = require('../../libs/core/middleware');
const uuid = require('uuid');
const {
    createMessage
} = require('../../libs/chats/usecase/chatServiceUsecase')
const objServiceApp = express();
/**
 * userid:{
 * strChatId:'fdg',
 * strJoinTime:'',
 * isOnline,
 * strRoomId
 * }
 */
let objUserRooms = {};
let objGroupRooms = {};
let objOnlineStatus = {}
try {
    //allDBInit();
    objServiceApp.use(cors({
        origin: '*'
    }));
    objServiceApp.use(jwtTokenChecking)
    objServiceApp.use(bodyParser.json({
        limit: '100mb'
    }));
    objServiceApp.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));
    objServiceApp.use(function (err, req, res, next) {
        if (err instanceof SyntaxError && "body" in err) {
            res.status(400).send({
                errCommon: [{
                    strMessage: "INVALID_JSON"
                }]
            });
        } else next();
    });
    //objServiceApp.use("/", routes);
    let objServer = objServiceApp.listen(4110, function () {
        console.log('App is listening on port ' + 4110);
    });


    const io = require("socket.io")(objServer, {
        pingTimeout: 60000,
        cors: {
            origin: "*",
        },
    });
    io.use(jwtTokenCheckingSocket);
    io.on("connection", (socket) => {
        let {
            id,
            strUserId,
            strFullName,
            strUserType
        } = socket;
        objOnlineStatus[strUserId] = true;
        
        socket.on("join_room", ({
            strChatId,
            strType
        }) => {
            const newUuid = uuid.v4();
            if (strType == 'private') {
                if (objUserRooms[strUserId]) {
                    let objRoom = objUserRooms[strUserId]
                    delete objUserRooms[strUserId]
                    if (objRoom?.strRoomId)
                        socket.leave(objRoom?.strRoomId);
                }
                objUserRooms[strUserId] = {
                    strChatId,
                    timReceived: moment().tz("Asia/Dubai").format('YYYY-MM-DD hh:mm:ss a'),
                    strRoomId: newUuid
                }
                socket.join(newUuid);
            } else if (strType == 'group') {
                if (objGroupRooms[strChatId]) {
                    objGroupRooms[strChatId] = {
                        ...objGroupRooms[strChatId],
                        [strUserId]: true
                    }
                } else {
                    objGroupRooms[strChatId] = {
                        [strUserId]: true
                    }
                }
                socket.join(strChatId);
            }
        });

        socket.on("send_message", async (objMessage) => {
            let {
                strChatId,
                strType,
                _id,
                strUserType
            } = objMessage;
            if (!strChatId) return console.log("chat.users not defined");
            let timReceived = moment().tz("Asia/Dubai").format('YYYY-MM-DD hh:mm:ss a');
            let strCreatedTime = moment().tz("Asia/Dubai").format('HH:mm');
            // let strCreatedTime = moment().format('HH:mm');
            let objResult = await createMessage({
                ...objMessage,
                timReceived,
                strCreatedTime,
                strUserId,
                strUserType
            });

            Promise.all([
                !_id ? socket.emit("get_message", {
                    ...objResult.objMessage,
                    "strName": "You"
                }) : () => true,
                socket.emit("chat_history", objResult.objHistory),
            ])
            if (objUserRooms[strChatId] && objOnlineStatus[strChatId] && objUserRooms[strChatId]?.strChatId == strUserId) {
                //Send to reciever
                Promise.all([
                    socket.to(objUserRooms[strChatId]?.strRoomId).emit("get_message", {
                        ...objResult.objMessage,
                        "strName": strFullName
                    }),
                    socket.to(strChatId).emit("chat_history", objResult.objHistory)
                ]);
            }
        });

        socket.on("left_room", ({
            strChatId,
            strType
        }) => {
            
                let objRoom = objUserRooms[strUserId]
                delete objUserRooms[strUserId]
                if (objRoom ?.strRoomId)
                    socket.leave(objRoom ?.strRoomId);
    
        });
        
        socket.on("add_booking", (objBooking) => {
            console.log("  booking   ", objBooking);
            socket.emit("get_booking", objBooking)
        });

        socket.on('disconnect', () => {
            objOnlineStatus[strUserId] = false;
            let objRoom = objUserRooms[strUserId]
            delete objUserRooms[strUserId]
            if (objRoom ?.strRoomId)
                socket.leave(objRoom ?.strRoomId);
        });
    });
} catch (error) {
    console.log(error);
}