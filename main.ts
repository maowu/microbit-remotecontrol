
enum SetGroup {
    //% block="P1"
    P1,
    //% block="P2"
    P2,
    //% block="P3"
    P3,
    //% block="P4"
    P4,
    //% block="P5"
    P5,
    //% block="P6"
    P6
};

enum SetYesNo {
    //% block="No"
    NO,
    //% block="Yes"
    YES
};

//% weight=0 color=#3CB371 icon="\uf11b"
namespace GameRemoteConsole{
    let btnA = 0
    let btnB = 0
    let btnAB = 0
    let P0 = 0
    let P1 = 0
    let P2 = 0
    let lastbtnA = -1
    let lastbtnB = -1
    let lastbtnAB = -1
    let lastP0 = -1
    let lastP1 = -1
    let lastP2 = -1
    let move = 0
    let lastmove = 0
    let lastup = 0
    let up = 0
    let upCount = 0
    let shake = 0

    let cmd_list: number[] = []
    cmd_list = [0, 0, 0]

    let imu_timer = 0
    let resetTimer = 0
    let datatimer = 0

    let cmd_timer_list: number[] = []
    cmd_timer_list = [0, 0, 0, 0]

    let btnAStr = "power"
    let btnBStr = "up"
    let btnABStr = "up2"
    let shakeStr = "power"
    let P0Str = "P0"
    let P1Str = "P1"
    let P2Str = "P2"
    
    let isPlay = 0

    //powerLED define
    let power_list = [
    images.createImage(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `), 
    images.createImage(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    # # # # #
    `), 
    images.createImage(`
    . . . . .
    . . . . .
    . . . . .
    # # # # #
    # # # # #
    `), 
    images.createImage(`
    . . . . .
    . . . . .
    # # # # #
    # # # # #
    # # # # #
    `), 
    images.createImage(`
    . . . . .
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `), 
    images.createImage(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)]


    /**
    * 初始，設定radio群組
    */
    //% blockId="ConsoleInit" block="console init|#id %group_id"
    //% blockGap=20 weight=90
    export function ConsoleInit(group_id: SetGroup): void {
        let t_id = 0
        switch(group_id) {
            case SetGroup.P1: t_id = 1; break;
            case SetGroup.P2: t_id = 2; break;
            case SetGroup.P3: t_id = 3; break;
            case SetGroup.P4: t_id = 4; break;
            case SetGroup.P5: t_id = 5; break;
            case SetGroup.P6: t_id = 6; break;
        }
        radio.setGroup(t_id)
        radio.setTransmitSerialNumber(true)
        radio.setTransmitPower(7)

        // init timer 
        resetTimer = input.runningTime()
        imu_timer = input.runningTime()
        datatimer = input.runningTime()
        for(let v=0; v<4; v++) {
            cmd_timer_list[v] = input.runningTime()
        }
    }


    /**
    * [RemoteControl] 改變參數設定
    */
    //% blockId="ChangeSetting" block="change setting|#style %c_style|#color %c_color|#emoticon %c_emoticon"
    //% blockGap=20 weight=90
    export function ChangeSetting(c_style: number, c_color: number, c_emoticon: number): void {
        cmd_list[0] = c_style
        cmd_list[1] = c_color
        cmd_list[2] = c_emoticon
    }

    /**
    * [RemoteControl] 送出換裝資訊
    */
    //% blockId="SettingOutput" block="Setting Output"
    //% blockGap=20 weight=75
    export function SettingOutput(): void {
        radio.sendValue("cmd1", cmd_list[0])
        basic.pause(30)
        radio.sendValue("cmd2", cmd_list[1])
        basic.pause(30)
        radio.sendValue("cmd3", cmd_list[2])
        basic.pause(30)
        radio.sendValue("change", 1)
    }

    /**
    * [RemoteControlSimple] 搖桿的執行功能簡單版，捕捉A/B按鍵以及加速計的X軸，並接收由配對裝置傳來的radio訊號
    */
    //% blockId="ConsoleExcueSimple" block="console excue simple"
    //% blockGap=20 weight=80
    export function ConsoleExcueSimple(): void {
        if (input.buttonIsPressed(Button.A)) {
            if(input.runningTime()-cmd_timer_list[0]>500) {
                //btnA = 1
                btnAB = 10
                basic.showString("A")
                //radio.sendValue("btnA", 1)
                //btnA = 0
                cmd_timer_list[0] = input.runningTime()
            }
        }
        if (input.buttonIsPressed(Button.B)) {
            if(input.runningTime()-cmd_timer_list[1]>500) {
                //btnB = 1
                btnAB = 20
                basic.showString("B")
                //radio.sendValue("btnB", 1)
                //btnB = 0
                cmd_timer_list[1] = input.runningTime()
            }
        }
        if (input.buttonIsPressed(Button.AB)) {
            if(input.runningTime()-cmd_timer_list[2]>500) {
                //btnAB = 1
                btnAB = 30
                basic.showString("C")
                //radio.sendValue("btnAB", 1)
                cmd_timer_list[2] = input.runningTime()
            }
        }

        input.onGesture(Gesture.ThreeG, () => {
            if (input.runningTime() - shakeTime > 500) {
                shake = 100
                shakeTime = input.runningTime()
            }
        })

        if (input.acceleration(Dimension.X) > 300) {
            move = 4    //right
        } else if (input.acceleration(Dimension.X) < -300) {
            move = 2    //left
        } else {
            move = 0
        }

        if (input.acceleration(Dimension.Y) > 200) {
            up = 1
        } else {
            up = 0
        }

        if(lastup != up) { 
            radio.sendValue("move", move+up)    // 0:down, 1:up, 2:l-down, 3: l_up, 4:r-down, 5:r-up
            lastup = up
        } 

        
        if(lastmove != move) {
            radio.sendValue("move", move+up)    // 0:down, 1:up, 2:l-down, 3: l_up, 4:r-down, 5:r-up
            lastmove = move;
        }

        if(input.runningTime()-imu_timer > 1000) {
            radio.sendValue("move", (move+up+btnAB+shake)     // 0:down, 1:up, 2:l-down, 3: l_up, 4:r-down, 5:r-up
            //radio.sendValue("move", move)
            btnAB = 0;
            shake = 0;
            imu_timer = input.runningTime()
        }

        radio.onDataPacketReceived( ({ receivedString: msg_name, receivedNumber: msg_value }) =>  {
            //--- while we get the power-value from pair device (from Unity game-> serial-master-micro:bit) ---//
            if (msg_name.compare("power") == 0) {
                if(msg_value >= 0 && msg_value <= 5) {
                    power_list[msg_value].showImage(0)
                }
            }
        })

    }

    

    /**
    * [MsgHnadle] Radio接收端，可選擇是否Serial輸出
    */
    //% blockId="RemoteRadioDatasHandle" block="get datas from remote|#SerialOut %isoutput|#ShowLED %isLED"
    //% blockGap=20 weight=80
    export function RemoteRadioDatasHandle(isoutput: SetYesNo=SetYesNo.NO, isLED: SetYesNo=SetYesNo.NO): void {
        let t_output = 0
        let t_led = 0
        switch(isoutput) {
            case SetYesNo.NO: t_output = 0; break;
            case SetYesNo.YES: t_output = 1; break;
        }
        switch(isLED) {
            case SetYesNo.NO: t_led = 0; break;
            case SetYesNo.YES: t_led = 1; break;
        }

        radio.onDataPacketReceived( ({ receivedString: msg_name, receivedNumber: msg_value }) =>  {

            // -- start check message content --- //
            /*
            if (msg_name.compare("btnA") == 0) {
                if (msg_value > 0) {
                    btnA = 1
                    if(t_led) {
                        if(input.runningTime()-cmd_timer_list[0]>500) {
                            basic.showString("A");
                            cmd_timer_list[0] = input.runningTime()
                        }
                    }
                } else {
                    btnA = 0
                }
                serial.writeLine(btnAStr + "=" + btnA)
                lastbtnA = btnA
                resetTimer = input.runningTime()
            } else if (msg_name.compare("btnB") == 0) {
                if (msg_value > 0) {
                    btnB = 1
                    if(t_led) {
                        if(input.runningTime()-cmd_timer_list[0]>500) {
                            basic.showString("B");
                            cmd_timer_list[0] = input.runningTime()
                        }
                    }
                } else {
                    btnB = 0
                }
                serial.writeLine(btnBStr + "=" + btnB)
                lastbtnB = btnB
                resetTimer = input.runningTime()
            } else if (msg_name.compare("btnAB") == 0) {
                if (msg_value > 0) {
                    btnAB = 1
                    if(t_led) {
                        if(input.runningTime()-cmd_timer_list[0]>500) {
                            basic.showString("C");
                            cmd_timer_list[0] = input.runningTime()
                        }
                    }
                } else {
                    btnAB = 0
                }
                serial.writeLine(btnABStr + "=" + btnAB)
                lastbtnAB = btnAB
                resetTimer = input.runningTime()
            }  else if (msg_name.compare("shake") == 0) {
                if(t_output==1) {                
                    if(input.runningTime()-cmd_timer_list[3]>1000) {
                        serial.writeLine(shakeStr + "=1")
                        cmd_timer_list[3] = input.runningTime()
                    }
                }
                resetTimer = input.runningTime()
            }
            */
            if (msg_name.compare("move") == 0) {
                /*
                if(msg_value>=100) {    // shack
                    if(input.runningTime()-cmd_timer_list[3]>500) {
                        serial.writeLine(shakeStr + "=1")
                        cmd_timer_list[3] = input.runningTime()
                    }
                    msg_value -= 100;
                }else if(msg_value>=30){    //btnAB
                    if(t_led) {
                        if(input.runningTime()-cmd_timer_list[0]>500) {
                            basic.showString("C");
                            cmd_timer_list[0] = input.runningTime()
                        }
                    }
                    msg_value -= 30;
                }else if(msg_value>=20){    //btnAB
                    if(t_led) {
                        if(input.runningTime()-cmd_timer_list[0]>500) {
                            basic.showString("B");
                            cmd_timer_list[0] = input.runningTime()
                        }
                    }
                    msg_value -= 20;
                }else if(msg_value>=10){    //btnAB
                    if(t_led) {
                        if(input.runningTime()-cmd_timer_list[0]>500) {
                            basic.showString("A");
                            cmd_timer_list[0] = input.runningTime()
                        }
                    }
                    msg_value -= 10;
                }
                */
                move = msg_value
            } 


            

            // -- end check message content --- //

            if (t_output==1) {
                if (input.runningTime() - datatimer > 300) {
                    serial.writeLine("move=" + move)  
                    datatimer = input.runningTime()
                }
            }

            
        })

        if (input.runningTime() - resetTimer > 120000) {
            control.reset()
            resetTimer = input.runningTime()
        }
    }

    /**
    * [MsgHnadle] Serial接收端，負責執行由Unity傳來的訊息，再丟回給remote console
    */
    //% blockId="SerialDatasHandle" block="get datas from serial|#RadioOut %isoutput"
    //% blockGap=20 weight=80
    export function SerialDatasHandle(isoutput: SetYesNo=SetYesNo.NO): void {
        let t_output = 0
        switch(isoutput) {
            case SetYesNo.NO: t_output = 0; break;
            case SetYesNo.YES: t_output = 1; break;
        }

        let tmpstr = ""
        let r_msgout = 0;
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            tmpstr = serial.readUntil('\n')
            if (tmpstr.compare("#0") == 0) {
                //power_list[0].showImage(0)
                r_msgout = 0;        
            } else if (tmpstr.compare("#1") == 0) {
                //power_list[1].showImage(0)
                r_msgout = 1;
            } else if (tmpstr.compare("#2") == 0) {
                //power_list[2].showImage(0)
                r_msgout = 2;
            } else if (tmpstr.compare("#3") == 0) {
                //power_list[3].showImage(0)
                r_msgout = 3;
            } else if (tmpstr.compare("#4") == 0) {
                //power_list[4].showImage(0)
                r_msgout = 4;
            } else if (tmpstr.compare("#5") == 0) {
                //power_list[5].showImage(0)
                r_msgout = 5;
            } else {
                //serial.writeLine("other string: " + tmpstr + " :" +     tmpstr.length)
            }

            if(t_output == 1) {
                radio.sendValue("power", r_msgout)
            }
        })
    }
}
