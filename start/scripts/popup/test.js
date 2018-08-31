//var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html';
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1VF1FB45U_okcAuQkpVTNzinwUBU8Dam_rzEQ9LexURU/edit#gid=0';
// var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/10vr-bMOH_16Jk6yPyqB7WJTLF3EfKhXh1njP46M9AAc/edit#gid=0';
function init() {


    Tabletop.init({
        key: public_spreadsheet_url,
        callback: showInfo,
        simpleSheet: true
    });
}
window.addEventListener('DOMContentLoaded', init)
function showInfo(data) {

    
    console.log(data);
}