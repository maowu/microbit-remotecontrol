
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
    let P0 = 0
    let P1 = 0
    let P2 = 0
    let lastbtnA = 0
    let lastbtnB = 0
    let lastP0 = 0
    let lastP1 = 0
    let lastP2 = 0
    let imu_tiemr = 0
    let move = 0

    let cmd_list: number[] = []
    cmd_list = [0, 0, 0]

    let datatimer = 0


    /**
    * 初始，設定radio群組
    */
    //% blockId="ConsoleInit" block="console init|id %group_id"
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
    }


    /**
    * 改變參數設定
    */
    //% blockId="ChangeSetting" block="change setting|style %c_style|color %c_color|emoticon %c_emoticon"
    //% blockGap=20 weight=90
    export function ChangeSetting(c_style: number, c_color: number, c_emoticon: number): void {
        cmd_list[0] = c_style
        cmd_list[1] = c_color
        cmd_list[2] = c_emoticon
    }

    /**
    * 送出換裝資訊
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
    * 搖桿的執行功能，捕捉A/B按鍵以及加速計的X軸
    */
    //% blockId="ConsoleExcue" block="console excue"
    //% blockGap=20 weight=80
    export function ConsoleExcue(): void {
        if (input.buttonIsPressed(Button.A)) {
            btnA = 1
            basic.showString("A")
            radio.sendValue("btnA", 1)
        }else {
            btnA = 0
        }
        if (input.buttonIsPressed(Button.B)) {
            btnB = 1
            basic.showString("B")
            radio.sendValue("btnB", 1)
        }else {
            btnB = 0
        }
        if (input.pinIsPressed(TouchPin.P0)) {
            P0 = 1
            //basic.showString("0")
            radio.sendValue("P0", 1)
        }else {
            P0 = 0
        }
        if (input.pinIsPressed(TouchPin.P1)) {
            P1 = 1
            basic.showString("1")
            radio.sendValue("P1", 1)
        }else {
            P1 = 0
        }
        if (input.pinIsPressed(TouchPin.P2)) {
            P2 = 1
            basic.showString("2")
            radio.sendValue("P2", 1)
        }else {
            P2 = 0
        }
        if (btnA!=lastbtnA) {
            if(btnA > 0) {
                
            }else {
                basic.clearScreen()
                radio.sendValue("btnA", 0)
            }
            lastbtnA = btnA
        }
        if (btnB!=lastbtnB) {
            if(btnB > 0) {
                
            }else {
                basic.clearScreen()
                radio.sendValue("btnB", 0)
            }
            lastbtnB = btnB
        }
        if (P0!=lastP0) {
            if(P0 > 0) {
                
            }else {
                basic.clearScreen()
                radio.sendValue("P0", 0)
            }
            lastP0 = P0
        }
        if (P1!=lastP1) {
            if(P1 > 0) {
                
            }else {
                basic.clearScreen()
                radio.sendValue("P1", 0)
            }
            lastP1 = P1
        }
        if (P2!=lastP2) {
            if(P2 > 0) {
                
            }else {
                basic.clearScreen()
                radio.sendValue("P2", 0)
            }
            lastP2 = P2
        }

        if (input.acceleration(Dimension.X) > 500) {
            move = 1
        } else if (input.acceleration(Dimension.X) < -500) {
            move = -1
        } else {
            move =0
        }

        if(input.runningTime()-imu_tiemr > 100) {
            radio.sendValue("move", move)
            imu_tiemr = input.runningTime()
        }
    }

    /**
    * Radio接收端，可選擇是否Serial輸出
    */
    //% blockId="RemoteRadioDatasHandle" block="get datas from remote|SerialOut %isoutput"
    //% blockGap=20 weight=80
    export function RemoteRadioDatasHandle(isoutput: SetYesNo): void {
        let t_output = isoutput
        switch(isoutput) {
            case SetYesNo.NO: t_output = 0; break;
            case SetYesNo.YES: t_output = 1; break;
        };
        radio.onDataPacketReceived( ({ receivedString: msg_name, receivedNumber: msg_value }) =>  {
            //serial.writeLine("revStr=" + msg_name + " - " + msg_value)

            // -- start check message content --- //
            if (msg_name.compare("btnA") == 0) {
                if (msg_value > 0) {
                    basic.showString("A")
                    btnA = 1
                } else {
                    basic.clearScreen()
                    btnA = 0
                }
            } else if (msg_name.compare("btnB") == 0) {
                if (msg_value > 0) {
                    basic.showString("B")
                    btnB = 1
                } else {
                    basic.clearScreen()
                    btnB = 0
                }
            } else if (msg_name.compare("P0") == 0) {
                if (msg_value > 0) {
                    basic.showString("0")
                    P0 = 1
                } else {
                    basic.clearScreen()
                    P0 = 0
                }
            } else if (msg_name.compare("P1") == 0) {
                if (msg_value > 0) {
                    basic.showString("1")
                    P1 = 1
                } else {
                    basic.clearScreen()
                    P1 = 0
                }
            } else if (msg_name.compare("P2") == 0) {
                if (msg_value > 0) {
                    basic.showString("2")
                    P2 = 1
                } else {
                    basic.clearScreen()
                    P2 = 0
                }
            } else if (msg_name.compare("move") == 0) {
                if(t_output==1) {
                    serial.writeLine("move=" + msg_value)
                }
            } else if (msg_name.compare("cmd1") == 0) {
                if(t_output==1) {
                    serial.writeLine("cmd1=" + msg_value)
                }
            } else if (msg_name.compare("cmd2") == 0) {
                if(t_output==1) {
                    serial.writeLine("cmd2=" + msg_value)
                }
            } else if (msg_name.compare("cmd3") == 0) {
                if(t_output==1) {
                    serial.writeLine("cmd3=" + msg_value)
                }
            } else if (msg_name.compare("change") == 0) {
                if(t_output==1) {
                    serial.writeLine("cmd3=" + msg_value)
                }
            }

            // -- end check message content --- //

            if (t_output==1) {
                if (input.runningTime() - datatimer > 100) {
                    serial.writeLine("btnA=" + btnA)
                    serial.writeLine("btnB=" + btnB)
                    serial.writeLine("P0=" + P0)
                    serial.writeLine("P1=" + P1)
                    serial.writeLine("P2=" + P2)
                    datatimer = input.runningTime()
                }
            }
        })
    }
}
