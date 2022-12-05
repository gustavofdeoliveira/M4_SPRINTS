var question = 1;
let playerOne
let playerTwo
var minute = 0;
var second = 0;
var millisecond = 0;
confirmPlayerOne = false;
confirmPlayerTwo = false;
var cron;
start();
function changeActiveClassesAfterClick(question) {
    var currentQuestionElement = document.getElementById("question-n" + (question - 1));
    var nextQuestionElement = document.getElementById("question-n" + question);
    currentQuestionElement.classList.remove('active');
    nextQuestionElement.classList.add('active');
}
let api = "http://10.254.18.226:3000";
function goToNextQuestion(confirmPlayerOne, confirmPlayerTwo) {
    if (question == 2 && playerOne != null && playerTwo != null && confirmPlayerTwo == true) {
        question++;
        changeActiveClassesAfterClick(question);
    }
    if (question == 1 && playerOne != null && confirmPlayerOne == true) {
        question++;
        changeActiveClassesAfterClick(question);
    }
    if (question == 3) {
        if (playerOne == playerTwo) {
            document.getElementById('tie').style.display = 'flex';
        }
        if ((playerOne - playerTwo == -2) || (playerOne - playerTwo == 1)) {
            document.getElementById('win').innerHTML = 'Win <br> Jogador 1';
        } else if ((playerOne - playerTwo != 1) && (playerOne != playerTwo)) {
            document.getElementById('win').innerHTML = 'win <br> Jogador 2';
        }

    }

}

function gamePlayerOne(result) {
    playerOne = result
}
function gamePlayerTwo(result) {
    playerTwo = result
}


function timer() {
    if ((millisecond += 10) == 1000) {
        millisecond = 0;
        second++;
    }
    if (second % 3 == 0) {
        atualizaPartida();

    }
}
function start() {
    cron = setInterval(() => { timer(); }, 10);
}
function postWin() {
    $.ajax({
        type: 'POST',
        url: api + '/postWin',
        data: { win: true },
    }).done(function () {
    }).fail(function (msg) {
    }).always(function (msg) {
    });

}
function atualizaPartida() {
    $.ajax({
        url: api + '/getPartida',
        type: 'GET',
        success: data => {
            if (data) {
                if (data[0].start == true) {
                    document.getElementById("start").style.display = "none";
                }
                if (data[0].playerOne) {
                    if (data[0].playerOne == 49) {
                        gamePlayerOne(0);
                        document.getElementById("you-1").checked = true;
                    }
                    if (data[0].playerOne == 50) {
                        gamePlayerOne(1);
                        document.getElementById("you-2").checked = true;
                    }
                    if (data[0].playerOne == 51) {
                        gamePlayerOne(2);
                        document.getElementById("you-3").checked = true;
                    }
                    document.getElementById("instrucoes-player-one").innerHTML = '<h3>Pressione * no teclado para confirmar!</h3>';
                }
                if (data[0].playerOne == 70) {
                    question = 1;
                    confirmPlayerOne = true;
                    goToNextQuestion(confirmPlayerOne, confirmPlayerTwo);
                }

                if (data[0].start) {
                    document.getElementById("start").style.display = "none";
                }
                if (data[0].playerTwo) {
                    if (data[0].playerTwo == 49) {
                        gamePlayerTwo(0);
                        document.getElementById("youu-1").checked = true;
                    }
                    if (data[0].playerTwo == 50) {
                        gamePlayerTwo(1);
                        document.getElementById("youu-2").checked = true;
                    }
                    if (data[0].playerTwo == 51) {
                        gamePlayerTwo(2);
                        document.getElementById("youu-3").checked = true;
                    }
                    document.getElementById("instrucoes-player-two").innerHTML = '<h3>Pressione * no teclado para confirmar!</h3>';
                }
                if (data[0].playerTwo == 70) {
                    confirmPlayerTwo = true
                    question = 2;
                    goToNextQuestion(confirmPlayerOne, confirmPlayerTwo);
                    postWin();

                }
            }
        }
    });

}