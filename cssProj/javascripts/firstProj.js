// by binyamin green orev 3-2
window.onload = run;

function run() {
    var myCanvas = document.getElementById('canvas');
    loadFile();

    var square = document.getElementById('square');
    square.addEventListener("click", function () {
        makeShape(recProps());
    });

    var oval = document.getElementById('oval');
    oval.addEventListener("click", function () {
        makeShape(ovalProps());
    });

    var colors = document.getElementsByClassName('color');
    for (var i = 0; i < colors.length; ++i) {
        colors[i].addEventListener("click", paint)
    }
    var deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener("click", deleteShape);
    window.addEventListener("keydown", function (event) {
        if (event.which === 8) deleteShape();
    });
    var launchSave = document.getElementById('launchSave');
    launchSave.addEventListener('click', function () {
        document.getElementById('saveMode').style.display = 'block';
        document.getElementById('savePrompt').style.display = 'block';
    })
    var saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener("click", savePage);

    var loadPage = document.getElementById('load');

    var loadBtn = document.getElementById('loadBtn');
    loadBtn.addEventListener("click", loadFile);

    var exitSave = document.getElementsByClassName('exit');
    for (var i = 0; i < exitSave.length; ++i) {
        exitSave[i].addEventListener('click', function () {
            document.getElementById('saveMode').style.display = 'none';
            document.getElementById('loadPrompt').style.display = 'none';

        })
    }

    var myHeader = document.getElementsByTagName('header');
    var headerHight = myHeader[0].offsetHeight;

    var moved = 0;

    var front = 0;

    loadPage.addEventListener("click", function () {
        document.getElementById('saveMode').style.display = 'block';
        document.getElementById('loadPrompt').style.display = 'block';
        for (var i in localStorage) {
            var option = document.createElement('option');
            option.innerHTML = i;
            var optionList = document.getElementById('fileList').appendChild(option);
        }

    });

    function savePage() {
        event.stopPropagation();
        var myFile = document.getElementById('fileSave').value;
        if (!myFile) {
            alert('file must have a name')

        } else {

            if (localStorage[myFile]) {
                alert('file name exicting, please choose another name')
            } else {

                document.getElementById('savePrompt').style.display = "none";
                var savedAlert = document.getElementById("savedAlert");

                var savedShapes = [];
                var currentPageStatus = document.getElementsByClassName('shape');
                for (var i = 0; i < currentPageStatus.length; ++i) {
                    var savedProps = {
                        width: currentPageStatus[i].offsetWidth,
                        height: currentPageStatus[i].offsetHeight,
                        background: window.getComputedStyle(currentPageStatus[i]).background,
                        left: currentPageStatus[i].offsetLeft,
                        top: currentPageStatus[i].offsetTop,
                        borderRadius: window.getComputedStyle(currentPageStatus[i]).borderRadius
                    };
                    savedShapes.push(savedProps);
                }
                var obj = { savedShapes }
                localStorage[myFile] = JSON.stringify(obj);
                localStorage.lastSaved = JSON.stringify(obj);
                savedAlert.style.display = 'block';
                savedAlert.innerHTML = "<h3>saved " + myFile + "!</h3>";
                document.getElementById('saveMode').addEventListener('click', function () {
                    if (event.target === document.getElementById('saveMode')) {

                        clearTimeout(timeOut);
                        savedAlert.style.display = 'none';
                        document.getElementById('saveMode').style.display = "none";
                    }
                })
                var timeOut = setTimeout(function () {
                    savedAlert.style.display = 'none';
                    document.getElementById('saveMode').style.display = "none";

                }, 3000);
            }

        }

    }

    function deleteShape() {
        var selected = document.getElementsByClassName('selection');
        var len = selected.length;
        for (var i = 0; i < len; ++i) {
            selected[0].parentNode.removeChild(selected[0]);
        }
    }


    function paint() {
        var selected = document.getElementsByClassName('shape');
        for (var i = 0; i < selected.length; ++i) {
            if (selected[i].childNodes[0].classList.contains('show')) {
                selected[i].style.background = window.getComputedStyle(this).getPropertyValue('background');
            }
        }
    }
    function rotate() {
        myCanvas.addEventListener('mousemove', function angle() {
                var deg = Math.atan2(event.pageY - event.target.offsetTop - event.pageY, event.pageX)* 180 / Math.PI;
                console.log(deg);
            // if (event.target.classList.contains('controler')) {
            //     var diagonle = Math.pow(event.target.offsetWidth / 2, 2) + Math.pow(event.target.parentNode.offsetHeight / 2, 2);
            //     event.target.parentNode.style.transform = 'rotate(' + deg + 'deg)';
            // }
            myCanvas.addEventListener("mouseup", function () {
                myCanvas.removeEventListener("mousemove", angle)
            });
        });
    }

    function sizeChange(event) {
        if (event.ctrlKey) {
            rotate();
        } else {


            myCanvas.addEventListener('mousemove', resize);
            function resize(e) {
                var y = e.pageY - headerHight;
                var x = e.pageX;
                if (event.target.classList.contains('RB')) {
                    event.target.parentNode.style.height = y - event.target.parentNode.offsetTop + 'px';
                    event.target.parentNode.style.width = x - event.target.parentNode.offsetLeft + 'px';
                }
                if (event.target.classList.contains('LT')) {
                    if (y < (event.target.parentNode.offsetTop + event.target.parentNode.offsetHeight) && y > 0) {
                        event.target.parentNode.style.height = event.target.parentNode.offsetHeight + (event.target.parentNode.offsetTop - y) + 'px';
                        event.target.parentNode.style.top = y + 'px';
                        event.target.parentNode.style.width = event.target.parentNode.offsetWidth + (event.target.parentNode.offsetLeft - x) + 'px';
                        if (x < (event.target.parentNode.offsetLeft + event.target.parentNode.offsetWidth))
                            event.target.parentNode.style.left = x + 'px';
                    }
                }
                if (event.target.classList.contains('RT')) {

                    if (y < (event.target.parentNode.offsetTop + event.target.parentNode.offsetHeight) && y > 0) {
                        event.target.parentNode.style.height = event.target.parentNode.offsetHeight + (event.target.parentNode.offsetTop - y) + 'px';
                        event.target.parentNode.style.top = y + 'px';
                        event.target.parentNode.style.width = x - event.target.parentNode.offsetLeft + 'px';
                    }
                }
                if (event.target.classList.contains('LB')) {
                    event.target.parentNode.style.height = y - event.target.parentNode.offsetTop + 'px';
                    event.target.parentNode.style.width = parseInt(event.target.parentNode.style.width) + (event.target.parentNode.offsetLeft - x) + 'px';
                    if (x < (event.target.parentNode.offsetLeft + event.target.parentNode.offsetWidth))
                        event.target.parentNode.style.left = x + 'px';
                }
            }


            myCanvas.addEventListener("mouseup", function () {
                myCanvas.removeEventListener("mousemove", resize)
            });
        }

    }

    function move(event) {

        var y = event.pageY - headerHight;
        var x = event.pageX;
        if (event.target.classList.contains('selection')) {

            if ((y - event.target.offsetHeight / 2 > 0) && (x - event.target.offsetWidth / 2 > 0) && (x + event.target.offsetWidth / 2 < myCanvas.offsetWidth)) {
                event.target.style.top = y - (event.target.offsetHeight / 2) + 'px';
                event.target.style.left = x - (event.target.offsetWidth / 2) + 'px';
                moved = 1;
            }
        }
    }

    function drag(event) {
        var clicked = 1;
        if (event.target.classList.contains("selection")) {
            front = event.target.style.zIndex;
            myCanvas.addEventListener("mousemove", move);
        }
        event.target.addEventListener("mouseup", function () {


            if (clicked) {

                myCanvas.removeEventListener("mousemove", move);
                event.target.style.zIndex = ++front;
                clicked = 0;
                if (!moved) {
                    if (!event.target.classList.contains('shape')) return;
                    var allControlers = document.getElementsByClassName('controler');
                    if (!event.ctrlKey) {
                        for (var i = 0; i < allControlers.length; ++i) {
                            if (allControlers[i].parentNode === event.target) continue;
                            allControlers[i].classList.remove('show');
                            allControlers[i].parentNode.classList.remove('selection');
                        }
                    }
                    for (var i = 0; i < event.target.childNodes.length; ++i) {
                        event.target.childNodes[i].classList.toggle('show');
                    }
                    event.target.classList.toggle('selection');
                }
                moved = 0;
            }
        });

    }


    function loadFile() {
        myCanvas.innerHTML = '';
        var options = document.getElementsByTagName('option');
        var fileList = document.getElementById('fileList');
        if (options.length)
            var obj = JSON.parse(localStorage[options[fileList.selectedIndex].text]);
        else if (localStorage.lastSaved) var obj = JSON.parse(localStorage.lastSaved);
        else return;
        var savedProps = obj.savedShapes;
        for (var i = 0; i < savedProps.length; ++i) {
            makeShape(savedProps[i]);
        }
        document.getElementById('saveMode').style.display = "none";
        document.getElementById('loadPrompt').style.display = 'none';
    }


    function recProps() {

        var props = {

            width: (Math.random() * 300) + 50,
            height: (Math.random() * 300) + 50,
            background: getRandomColor(),
            left: Math.random() * (myCanvas.offsetWidth - 350),
            top: Math.random() * (myCanvas.offsetHeight - 350),
            borderRadius: 0

        }
        return props;
    }

    function ovalProps() {
        var props = {

            width: (Math.random() * 300) + 50,
            height: (Math.random() * 300) + 50,
            background: getRandomColor(),
            left: Math.random() * (myCanvas.offsetWidth - 350),
            top: Math.random() * (myCanvas.offsetHeight - 350),
            borderRadius: 50 + '%'

        }
        return props;
    }

    function makeShape(obj) {
        var newShape = document.createElement('div');
        newShape.style.width = obj.width + 'px';
        newShape.style.height = obj.height + 'px';
        newShape.style.background = obj.background;
        newShape.style.left = obj.left + 'px';
        newShape.style.top = obj.top + 'px';
        newShape.style.borderRadius = obj.borderRadius;
        newShape.style.position = 'absolute';
        newShape.className = 'shape';
        var controlerLT = document.createElement('div');
        var controlerRT = document.createElement('div');
        var controlerLB = document.createElement('div');
        var controlerRB = document.createElement('div');
        controlerLT.className = 'controler LT';
        controlerRT.className = 'controler RT';
        controlerLB.className = 'controler LB';
        controlerRB.className = 'controler RB';
        newShape.appendChild(controlerLT);
        newShape.appendChild(controlerRT);
        newShape.appendChild(controlerLB);
        newShape.appendChild(controlerRB);
        canvas.appendChild(newShape);
        var controlers = document.getElementsByClassName('controler');
        for (var i = 0; i < controlers.length; ++i) {
            controlers[i].addEventListener('mousedown', sizeChange);
        }

        newShape.addEventListener("mousedown", drag);
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}
