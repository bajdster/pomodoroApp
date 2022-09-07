
const pomodoro = document.querySelector("#pomodoro");
const play = document.querySelector(".play");
const skip = document.querySelector(".skip");
const body = document.querySelector("body");

const modeButtons = document.querySelectorAll(".modeButton");
const workSessions = document.querySelector(".workSessions");
const breakSessions = document.querySelector(".breakSessions");

let time = document.querySelector(".time");
let currentClass = '';
currentIndex = 0;
let counter;
//for posibility to play/pause
let timerPlayed = false;
let wantNextMode = true;

let workTimes = 0;
let breakTimes = 0;
let degree = 360;

let timeSec;



function startApp()
{
    modeButtons[0].classList.add("modeActive");
    currentClass = "workCol"
    body.classList.add(currentClass);
    time.innerHTML = "01:00" //25;
    workSessions.innerHTML = workTimes
    breakSessions.innerHTML = breakTimes
    setTimeSec();
}


function setTimeSec()
{
    let splittedTime = time.innerHTML.split(":");
    timeSec = Number(splittedTime[0])*60+Number(splittedTime[1])
}


function countTime()
{
    let startTimeArr = time.innerHTML.split(":");

    let endMs = Date.now()+ (Number(startTimeArr[0]*60)+ Number(startTimeArr[1]))*1000;
    
    // let timeSec = Number(startTimeArr[0])*60+Number(startTimeArr[1])

    if(timerPlayed == false)
    {
        counter = setInterval(() => 
        {   
            //THERE IS A HOPE BUT FIND OUT HOW TO REACT ON TIME OUT
            //
            //
            //
            //

            let timeLeft = Math.round((endMs - Date.now())/1000);

            console.log(timeLeft)
            let minutes = Math.floor(timeLeft/60);
            let seconds = Math.floor(timeLeft%60);


            //changing cirle progress color
            let bodyColor = window.getComputedStyle(body).getPropertyValue("background-color")
            degree = degree-(360/timeSec);
            pomodoro.style.background = `conic-gradient(rgb(172, 44, 44) ${degree}deg,
            ${bodyColor} ${degree}deg)`
           
            if(seconds<10)
            {
                seconds = "0"+ seconds
            }

            time.innerHTML = `${minutes}:${seconds}`


            //end of this. Must be in this order to skipMode works

            //now works but timeleft doesn't minus regularly f.e 154, 94, 34, -26
            if(timeLeft <= 0)
            {
                if(currentClass == "workCol")
                {
                    workTimes++;
                    workSessions.innerHTML = workTimes
                }
                else if(currentClass == "sbreakCol" || currentClass == 'lbreakCol')
                {
                    breakTimes++;
                    breakSessions.innerHTML = breakTimes
                }
                timerPlayed = false;
                skipMode()
                clearInterval(counter);   
                const ring = new Audio("ring.mp3")
                ring.play()

            }
        }, 1000);
        timerPlayed = true;
        this.innerHTML = `<img src ="pause.png">`
    }

    else if(timerPlayed == true)
    {
        clearInterval(counter);
        this.innerHTML = `<img src ="play.png">`
        timerPlayed = false;
    }
   
}

function modeSwitch(modeCase)
{
    degree = 360;
    switch(modeCase)
    {
        case "Work":
            
            clearInterval(counter)
            time.innerHTML = "25:00";
            body.classList.replace(currentClass, "workCol");
            currentClass = "workCol";
            currentIndex = 0;
            setTimeSec()
            break;
        case "Short break":
            
            clearInterval(counter);
            time.innerHTML = "05:00";
            body.classList.replace(currentClass, "sbreakCol");
            currentClass = "sbreakCol";
            currentIndex = 1;
            setTimeSec()
            break;
        case "Long break":
            
            clearInterval(counter);
            time.innerHTML = "15:00";
            body.classList.replace(currentClass, "lbreakCol");
            currentClass = "lbreakCol";
            currentIndex = 2;
            setTimeSec()
            break;
    }
}

function setMode()
{
    if(timerPlayed)
    {
        wantNextMode = confirm("Are you sure?")
    }
    if(wantNextMode)
    {
        modeButtons.forEach(button=>button.classList.remove("modeActive"));
        this.classList.add("modeActive");
        play.innerHTML = `<img src ="play.png">`
        timerPlayed = false;
        modeSwitch(this.innerHTML)
        pomodoro.style.background = "rgb(172, 44, 44)";
    }
}

function changeMode(text)
{  
    modeSwitch(text)
    play.innerHTML =`<img src ="play.png">`
    timerPlayed = false;
}

function skipMode()
{
    if(timerPlayed)
    {
        wantNextMode = confirm("Are you sure?")
    }
    if(wantNextMode)
    {
        clearInterval(counter);
        modeButtons.forEach(button=>button.classList.remove("modeActive"));
        currentIndex++;
        if(currentIndex>=modeButtons.length) currentIndex = 0;
        modeButtons[currentIndex].classList.add("modeActive");
        changeMode(modeButtons[currentIndex].innerHTML);
        pomodoro.style.background = "rgb(172, 44, 44)";
    }
    else
    {
        return;
    }
   
}


window.addEventListener("load", startApp)
modeButtons.forEach(button=>
    {
        button.addEventListener("click", setMode)
    })

play.addEventListener("click", countTime)
skip.addEventListener("click", skipMode)
