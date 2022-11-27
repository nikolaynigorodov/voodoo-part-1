function init() {
    classForCinema = "seat";
    classForCinemaBooked = "seat-booked";
    classForCinemaArchive = "seat-archive";
    classForCinemaBookedArchive = "seat-booked-archive";
    moviesSession = getMovieSession();
    checkDate = getDate();
    dateForArchive = 7;
    dateForAvailable = 7;
    nameLocalStorage = getNameLocalStorage();
    // plan of the hall by rows total capacity 300 seats
    let cinemaHall = {
        row: [10, 20, 30, 30, 30, 30, 30, 30, 30, 30, 30]
    };

    renderingCinemaHall(cinemaHall);
}

init();

function renderingCinemaHall(cinemaHall) {

    if(!compareArchiveDate()) {
        drawCinemaHallArchive(cinemaHall)
    } else {
        drawCinemaHall(cinemaHall);
    }
    setHtmlCinemaHall();
}

function drawCinemaHall(cinemaHall) {
    let numberTicket = 1;
    let ticketInLocalStorage = getParseTicketInLocal();
    cinemaHallMap = '';

    if(compareAvailableDate()) {
        $.each(cinemaHall.row, function(row, numberOfSeats) {
            let cinemaHallRow = '';

            for (i = 1; i <= numberOfSeats; i++) {
                // collection of rows
                cinemaHallRow += '<div class="'+checkingBookedTickets(ticketInLocalStorage, numberTicket)+'" data-row="' +
                    numberTicket + '">'+numberTicket+'</div>';
                numberTicket++;
            }
            //we assemble a hall with aisles between the rows
            cinemaHallMap += cinemaHallRow + '<div class="passageBetween">&nbsp;</div>';
        });
    }

}

function drawCinemaHallArchive(cinemaHall) {
    let numberTicket = 1;
    let ticketInLocalStorage = getParseTicketInLocal();
    cinemaHallMap = '';

    $.each(cinemaHall.row, function(row, numberOfSeats) {
        let cinemaHallRow = '';

        for (i = 1; i <= numberOfSeats; i++) {
            // collection of rows
            cinemaHallRow += '<div class="'+checkingBookedTicketsArchive(ticketInLocalStorage, numberTicket)+'" data-row="' +
                numberTicket + '">'+numberTicket+'</div>';
            numberTicket++;
        }
        //we assemble a hall with aisles between the rows
        cinemaHallMap += cinemaHallRow + '<div class="passageBetween">&nbsp;</div>';
    });
}

$('#movieSession, #datepicker').change(function () {
    init();
    setHtmlCinemaHall();
    checkIfErrors();
});

$(document).on('click', '.seat', function(e) {
    bookingTickets(e);
    $(e.currentTarget).toggleClass('bay');
});

function setHtmlCinemaHall() {
    $('.hall').html(cinemaHallMap);
}

function bookingTickets(e) {
    let seat = $(e.target).data('row');
    checkIfErrors();
    if(checkDate && moviesSession) {
        if(e.target.className == classForCinema) {
            addInLocalStorage(seat);
        } else {
            deleteInLocalStorage(seat);
        }
    }
}

function addInLocalStorage(numberTicket) {
    let allSeat = getParseTicketInLocal() || [];
    allSeat.push(numberTicket);
    localStorage.setItem(nameLocalStorage, JSON.stringify(allSeat));
}

function deleteInLocalStorage(numberTicket) {
    let allSeat = getParseTicketInLocal();
    let index = allSeat.indexOf(numberTicket);
    if (index !== -1) {
        allSeat.splice(index, 1);
        localStorage.setItem(nameLocalStorage, JSON.stringify(allSeat));
    }
}

function checkingBookedTickets(ticketInLocalStorage, value) {
    if(ticketInLocalStorage !== null) {
        if(ticketInLocalStorage.includes(value)) {
            return classForCinemaBooked;
        }
    }
    return classForCinema;
}

function checkingBookedTicketsArchive(ticketInLocalStorage, value) {
    if(ticketInLocalStorage !== null) {
        if(ticketInLocalStorage.includes(value)) {
            return classForCinemaBookedArchive;
        }
    }
    return classForCinemaArchive;
}

function compareArchiveDate() {
    let currentDate = new Date()
    let available = new Date(currentDate.setDate(currentDate.getDate() - dateForArchive))

    let dd = String(available.getDate()).padStart(2, '0');
    let mm = String(available.getMonth() + 1).padStart(2, '0');
    let yyyy = available.getFullYear();

    let archiveDate = mm + '-' + dd + '-' + yyyy;

    if(checkDate > archiveDate) {
        return true;
    } else {
        return false;
    }
}

function compareAvailableDate() {
    let currentDate = new Date()
    let available = new Date(currentDate.setDate(currentDate.getDate() + dateForAvailable))

    let dd = String(available.getDate()).padStart(2, '0');
    let mm = String(available.getMonth() + 1).padStart(2, '0');
    let yyyy = available.getFullYear();

    let futureDay = mm + '-' + dd + '-' + yyyy;

    if(checkDate < futureDay) {
        return true;
    } else {
        return false;
    }
}

function getDate() {
    let datePicker = $("#datepicker").datepicker("getDate");
    return $.datepicker.formatDate("mm-dd-yy", datePicker);
}

function getMovieSession() {
    return $("#movieSession").find(":selected").val();
}

function getNameLocalStorage() {
    return checkDate +"-"+ moviesSession.toString();
}

function getParseTicketInLocal() {
    return JSON.parse(localStorage.getItem(nameLocalStorage));
}

function checkIfErrors() {
    if( checkDate.length === 0 || moviesSession.length === 0) {
        $(".d-none-alert-danger").removeClass('d-none');
    } else {
        $(".d-none-alert-danger").addClass('d-none');
    }

    if(compareAvailableDate()) {
        $(".d-none-alert-danger").addClass('d-none');
    } else {
        $(".d-none-alert-danger").removeClass('d-none');
        $(".d-none-alert-danger > p").html("You can book a ticket for "+dateForAvailable+" days in advance.");
    }
}