
enum SetGroup {
    //% block="A"
    A,
    //% block="B"
    B,
    //% block="C"
    C,
    //% block="D"
    D,
    //% block="E"
    E,
    //% block="F"
    F
}

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

    let cmd_list: number[] = []
    cmd_list = [0, 0, 0]


    /**
    * 初始，設定radio群組
    */
    //% blockId="ConsoleInit" block="console init|group id %group_id"
    //% blockGap=20 weight=90
    export function ConsoleInit(group_id: SetGroup) {
        radio.setGroup(group_id)
        radio.setTransmitSerialNumber(true)
        radio.setTransmitPower(7)
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
            basic.showString("0")
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
            }
            lastbtnA = btnA
        }
        if (btnB!=lastbtnB) {
            if(btnB > 0) {
                
            }else {
                basic.clearScreen()
            }
            lastbtnB = btnB
        }
        if (P0!=lastP0) {
            if(P0 > 0) {
                
            }else {
                basic.clearScreen()
            }
            lastP0 = P0
        }
        if (P1!=lastP1) {
            if(P1 > 0) {
                
            }else {
                basic.clearScreen()
            }
            lastP1 = P1
        }
        if (P2!=lastP2) {
            if(P2 > 0) {
                
            }else {
                basic.clearScreen()
            }
            lastP2 = P2
        }
        if(input.runningTime()-imu_tiemr > 100) {
            radio.sendValue("pitch", input.rotation(Rotation.Pitch))
            radio.sendValue("roll", input.rotation(Rotation.Roll))
            imu_tiemr = input.runningTime()
        }
    }

}
